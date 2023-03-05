import { GetStaticPropsResult } from 'next';

import Pricing from '@/components/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { Product } from 'types';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/features/Features';

interface Props {
  products: Product[];
}

export default function PricingPage({ products }: Props) {
  return (
    <>
      <Hero />
      <Features />
      <Pricing products={products} />
    </>
  );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const products = await getActiveProductsWithPrices();

  return {
    props: {
      products
    },
    revalidate: 60
  };
}
