import { useState } from 'react';
import { useRouter } from 'next/router';

import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useUser } from '@/utils/useUser';

import { Price, ProductWithPrice } from 'types';
import { productIds } from '@/constant/products';

interface Props {
  products: ProductWithPrice[];
}


export default function Pricing({ products }: Props) {
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const { user, isLoading, subscription } = useUser();

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      return router.push('/signin');
    }
    if (subscription) {
      return router.push('/account');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };
  return (
    <section id='pricing' >
      <div className="max-w-6x mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Pricing Plans
          </h1>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.active === true
            );
            if (!price) return null;
            let priceString;
            if (product.id === productIds.standard) {
              priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: price.currency,
                minimumFractionDigits: 0
              }).format((price?.unit_amount || 0) / 1200);
            } else {
              priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: price.currency,
                minimumFractionDigits: 0
              }).format((price?.unit_amount || 0) / 100);
            }

            return (
              <div key={product.id}>
                <div className="backdrop-blur bg-white/20 rounded-lg shadow-sm -mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                  <div className="rounded-2xl py-10 text-center ring-1 ring-inset ring-white/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                    <div className="mx-auto max-w-xs px-8">
                      <h2 className="text-2xl leading-6 font-semibold text-white">{product.name}</h2>
                      <p className="mt-4 text-zinc-300">{product.description}</p>
                      <p className="mt-6 flex items-baseline justify-center gap-x-2">
                        <span className="text-5xl font-extrabold text-white">{priceString}</span >
                        {product.id === productIds.standard ? <span className="text-sm font-semibold leading-6 tracking-wide text-white">/Month</span> : null}
                      </p>
                      {product.id === productIds.standard ? <p className="mt-6 text-sm leading-5 text-white">
                        Billed annually
                      </p> : <p className="mt-6 text-sm leading-5 text-white">
                        Pay once, own it forever
                      </p>}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleCheckout(price)}
                        className="mt-8 rounded-md bg-white bg-opacity-20 px-5 py-3.5 text-sm font-semibold text-white hover:shadow-sm hover:opacity-75"
                        >
                        {product.name === subscription?.prices?.products?.name
                          ? 'Manage'
                          : 'Get Started'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/*
 <div
                key={product.id}
                className={cn(
                  'rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
                  {
                    'border border-pink-500': subscription
                      ? product.name === subscription?.prices?.products?.name
                      : product.name === 'Freelancer'
                  }
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl leading-6 font-semibold text-white">
                    {product.name}
                  </h2>
                  <p className="mt-4 text-zinc-300">{product.description}</p>
                  <p className="mt-8">
                    <span className="text-5xl font-extrabold white">
                      {priceString}
                    </span>
                  </p>
                  <Button
                    variant="slim"
                    type="button"
                    disabled={isLoading}
                    loading={priceIdLoading === price.id}
                    onClick={() => handleCheckout(price)}
                    className="mt-8 block w-full rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-zinc-900"
                  >
                    {product.name === subscription?.prices?.products?.name
                      ? 'Manage'
                      : 'Subscribe'}
                  </Button>
                </div>
              </div>
              */

/*
<Button
                    variant="slim"
                    type="button"
                    disabled={isLoading}
                    loading={priceIdLoading === price.id}
                    onClick={() => handleCheckout(price)}
                    className="mt-8 block w-full rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-zinc-900"
                  >
                    {product.name === subscription?.prices?.products?.name
                      ? 'Manage'
                      : 'Subscribe'}
                  </Button>
                  */