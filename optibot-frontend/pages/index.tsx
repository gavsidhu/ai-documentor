import { GetStaticPropsResult } from 'next';

import Pricing from '@/components/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { Product } from 'types';
import Features from '@/components/home/features/Features';
import Hero from '@/components/home/hero/Hero';

interface Props {
  products: Product[];
}

export default function PricingPage({ products }: Props) {
  return (
    <div className='gradient'>
      <Hero />
      <Features />
      <Pricing products={products} />
    </div>
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
