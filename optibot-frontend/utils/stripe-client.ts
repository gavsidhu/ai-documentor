import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NODE_ENV === 'development'
        ? (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_DEV as string)
        : (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
    );
  }

  return stripePromise;
};
