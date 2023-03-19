import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

import { stripe } from './stripe';
import { decrypt, encrypt, toDateTime } from './helpers';

import { Customer, UserDetails, Price, Product } from 'types';
import type { Database } from 'types_db';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  };

  const { error } = await supabaseAdmin.from('products').upsert([productData]);
  if (error) throw error;
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    type: price.type,
    unit_amount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata
  };

  const { error } = await supabaseAdmin.from('prices').upsert([priceData]);
  if (error) throw error;
  console.log(`Price inserted/updated: ${price.id}`);
};

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', uuid)
    .single();
  if (error || !data?.stripe_customer_id) {
    // No customer record found, let's create one.
    const customerData: { metadata: { supabaseUUID: string }; email?: string } =
      {
        metadata: {
          supabaseUUID: uuid
        }
      };
    if (email) customerData.email = email;
    const customer = await stripe.customers.create(customerData);
    // Now insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabaseAdmin
      .from('customers')
      .insert([{ id: uuid, stripe_customer_id: customer.id }]);
    if (supabaseError) throw supabaseError;
    console.log(`New customer created and inserted for ${uuid}.`);
    return customer.id;
  }
  return data.stripe_customer_id;
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] }
    })
    .eq('id', uuid);
  if (error) throw error;
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();
  if (noCustomerError) throw noCustomerError;

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] =
    {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      //TODO check quantity on subscription
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: toDateTime(
        subscription.current_period_end
      ).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString()
        : null
    };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (error) throw error;
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};

const addSuccessfulPayment = async (
  checkoutSession: Stripe.Checkout.Session,
  paymentIntentId: string,
  customerId: string
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();
  if (noCustomerError) throw noCustomerError;

  const { id: uuid } = customerData!;
  console.log('checkout session: ', checkoutSession);

  const lineItems = await stripe.checkout.sessions.listLineItems(
    checkoutSession.id
  );
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const price = lineItems.data[0].price?.id;
  const quantity = lineItems.data[0].quantity;

  const { error } = await supabaseAdmin.from('payments').insert({
    id: paymentIntentId,
    user_id: uuid,
    checkout_session_id: checkoutSession.id,
    payment_intent_status: paymentIntent.status,
    checkout_status: checkoutSession.status,
    payment_status: checkoutSession.payment_status,
    metadata: checkoutSession.metadata,
    price_id: price,
    quantity: quantity
  });
  if (error) throw error;
  console.log(
    `Inserted/updated subscription [${paymentIntentId}] for user [${uuid}]`
  );
};

const checkIfUserExists = async (email: string) => {
  const { data } = await supabaseAdmin
    .from('users')
    .select()
    .eq('email', email);

  if (!data || data.length === 0) {
    return null;
  }
  return data[0];
};

const checkIfUserIsSubscribed = async (
  user: Database['public']['Tables']['users']['Row']
) => {
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', user?.id);
  if (!data) {
    return null;
  }
  return data[0];
};

const checkIfUserPaid = async (
  user: Database['public']['Tables']['users']['Row']
) => {
  const { data } = await supabaseAdmin
    .from('payments')
    .select('payment_status')
    .eq('user_id', user?.id);
  if (!data) {
    return null;
  }
  return data[0];
};

const getSecurityKey = async (email: string) => {
  const { data } = await supabaseAdmin
    .from('security_keys')
    .select()
    .eq('user_email', email);

  if (!data || data.length === 0) {
    return null;
  }
  return data[0].security_key;
};

const addApiKey = async (apiKey: string, userId: string) => {
  const encryptedKey = encrypt(
    apiKey,
    process.env.API_ENCRYPT_PASSWORD as string
  );
  const { data } = await supabaseAdmin
    .from('api_keys')
    .insert({ user_id: userId, api_key: encryptedKey });
};

const removeApiKey = async (userId: string) => {
  const { data } = await supabaseAdmin
    .from('api_keys')
    .delete()
    .eq('user_id', userId);
};

const getApiKey = async (userId: string) => {
  const { data } = await supabaseAdmin
    .from('api_keys')
    .select()
    .eq('user_id', userId);
  if (!data || data.length === 0) {
    return null;
  }
  const decryptedKey = decrypt(
    data[0].api_key as { iv: string; encryptedData: string; },
    process.env.API_ENCRYPT_PASSWORD as string
  );
  return decryptedKey;
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  checkIfUserExists,
  checkIfUserIsSubscribed,
  getSecurityKey,
  addApiKey,
  removeApiKey,
  getApiKey,
  addSuccessfulPayment,
  checkIfUserPaid
};
