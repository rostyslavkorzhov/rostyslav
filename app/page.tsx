import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='container mx-auto flex-1 px-5 py-16'>
      <div className='mx-auto max-w-4xl'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h1 className='text-title-h1 text-text-strong-950 mb-6'>
            Discover the Best E-Commerce Designs
          </h1>
          <p className='text-paragraph-lg text-text-sub-600 mb-8 max-w-2xl mx-auto'>
            Explore curated collections of product pages, homepages, and about pages from
            top e-commerce brands. Get inspired by the latest design trends and best
            practices.
          </p>
        </div>

        {/* Discovery Links */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-16'>
          <Link href='/discover/product'>
            <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-8 hover:shadow-regular-md transition-shadow text-center'>
              <h2 className='text-title-h3 text-text-strong-950 mb-3'>Product Pages</h2>
              <p className='text-paragraph-sm text-text-sub-600 mb-6'>
                Browse product detail pages from leading e-commerce brands
              </p>
              <Button variant='primary'>Explore Products</Button>
            </div>
          </Link>

          <Link href='/discover/home'>
            <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-8 hover:shadow-regular-md transition-shadow text-center'>
              <h2 className='text-title-h3 text-text-strong-950 mb-3'>Home Pages</h2>
              <p className='text-paragraph-sm text-text-sub-600 mb-6'>
                Discover homepage designs and layouts from top brands
              </p>
              <Button variant='primary'>Explore Home Pages</Button>
            </div>
          </Link>

          <Link href='/discover/about'>
            <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-8 hover:shadow-regular-md transition-shadow text-center'>
              <h2 className='text-title-h3 text-text-strong-950 mb-3'>About Pages</h2>
              <p className='text-paragraph-sm text-text-sub-600 mb-6'>
                See how brands tell their story through about pages
              </p>
              <Button variant='primary'>Explore About Pages</Button>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className='text-center'>
          <h2 className='text-title-h2 text-text-strong-950 mb-4'>Why Best of E-Commerce?</h2>
          <p className='text-paragraph-md text-text-sub-600 max-w-2xl mx-auto'>
            We curate the best e-commerce designs to help designers, developers, and
            marketers stay inspired and informed about the latest trends in online retail.
          </p>
        </div>
      </div>
    </div>
  );
}
