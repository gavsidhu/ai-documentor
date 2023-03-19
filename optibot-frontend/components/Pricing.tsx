import { useState } from 'react';
import { useRouter } from 'next/router';

import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useUser } from '@/utils/useUser';

import { Price, ProductWithPrice } from 'types';
import { productIds } from '@/constant/products';
import { HiCheck } from 'react-icons/hi2';

interface Props {
  products: ProductWithPrice[];
}

const includedFeatures = [
  'Document',
  'Refactor',
]

export default function Pricing({ products }: Props) {
  console.log(products)
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
      <div className="bg-transparent py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Pricing</h2>
          </div>
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.active === true
            );
            if (!price) return null;

            if (price.unit_amount === undefined) return null;
            const unitAmount = price.unit_amount
            return (
              <div key={product.id} className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                <div className="p-8 sm:p-10 lg:flex-auto">
                  <h3 className="text-2xl font-bold tracking-tight text-white">{product.name}</h3>
                  <p className="mt-6 text-base leading-7 text-white">
                    {product.description}
                  </p>
                  <div className="mt-10 flex items-center gap-x-4">
                    <h4 className="flex-none text-sm font-semibold leading-6 text-white">What's included</h4>
                    <div className="h-px flex-auto bg-gray-100" />
                  </div>
                  <ul
                    role="list"
                    className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-white sm:grid-cols-2 sm:gap-6"
                  >
                    {includedFeatures.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <HiCheck className="h-6 w-5 flex-none text-white" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                  <div className="rounded-2xl bg-white/20 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                    <div className="mx-auto max-w-xs px-8">
                      <p className="text-base font-semibold text-white">Pay once, own it forever</p>
                      <p className="mt-6 flex items-baseline justify-center gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-white">${unitAmount / 100}</span>
                        <span className="text-sm font-semibold leading-6 tracking-wide text-white">USD</span>
                      </p>
                      <button
                        className="mt-10 min-w-0 flex-auto border-0 bg-white text-zinc-800 transition ease-in-out duration-150 font-semibold text-center justify-center px-3.5 py-2  shadow-sm sm:text-sm sm:leading-6 hover:bg-zinc-800 hover:text-white hover:border-white"
                        onClick={() => handleCheckout(price)}
                      >
                        Get started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section >
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