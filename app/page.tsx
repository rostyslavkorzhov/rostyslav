'use client';

import Link from 'next/link';
import * as Button from '@/components/ui/button';
import * as Badge from '@/components/ui/badge';
import { RiArrowRightSLine, RiSparklingFill } from '@remixicon/react';

export default function Home() {
  return (
    <div className='container mx-auto flex-1 px-5 py-16'>
      <div className='mx-auto max-w-4xl'>
        {/* Hero Section */}
        <div className='mb-16 text-center'>
          <Badge.Root variant='primary' className='mb-6'>
            <Badge.Icon as={RiSparklingFill} />
            AlignUI Design System
          </Badge.Root>
          
          <h1 className='text-title-h1 text-text-strong-950 mb-6'>
            Build Beautiful UIs with AlignUI
          </h1>
          
          <p className='text-paragraph-lg text-text-sub-600 mb-8 max-w-2xl mx-auto'>
            A comprehensive design system built for Next.js applications. 
            Featuring accessible components, consistent styling, and dark mode support.
          </p>

          <div className='flex flex-wrap gap-4 justify-center'>
            <Button.Root variant='primary' mode='filled' size='medium' asChild>
              <Link href='/buttons'>
                Explore Components
                <Button.Icon as={RiArrowRightSLine} />
              </Link>
            </Button.Root>
            <Button.Root variant='neutral' mode='stroke' size='medium' asChild>
              <a href='https://alignui.com' target='_blank' rel='noopener noreferrer'>
                Documentation
              </a>
            </Button.Root>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid md:grid-cols-3 gap-6 mb-16'>
          <div className='rounded-20 bg-bg-weak-50 p-6'>
            <h3 className='text-title-h5 text-text-strong-950 mb-2'>
              Accessible
            </h3>
            <p className='text-paragraph-sm text-text-sub-600'>
              Built on Radix UI primitives for full accessibility support
            </p>
          </div>
          
          <div className='rounded-20 bg-bg-weak-50 p-6'>
            <h3 className='text-title-h5 text-text-strong-950 mb-2'>
              Customizable
            </h3>
            <p className='text-paragraph-sm text-text-sub-600'>
              Tailwind CSS based with easy theming and customization
            </p>
          </div>
          
          <div className='rounded-20 bg-bg-weak-50 p-6'>
            <h3 className='text-title-h5 text-text-strong-950 mb-2'>
              Type-Safe
            </h3>
            <p className='text-paragraph-sm text-text-sub-600'>
              Full TypeScript support with excellent developer experience
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className='text-center'>
          <h2 className='text-title-h3 text-text-strong-950 mb-6'>
            Get Started
          </h2>
          <div className='flex flex-wrap gap-4 justify-center'>
            <Button.Root variant='neutral' mode='ghost' size='small' asChild>
              <Link href='/buttons'>Buttons</Link>
            </Button.Root>
            <Button.Root variant='neutral' mode='ghost' size='small' asChild>
              <a href='https://alignui.com' target='_blank' rel='noopener noreferrer'>
                Full Documentation
              </a>
            </Button.Root>
            <Button.Root variant='neutral' mode='ghost' size='small' asChild>
              <a href='https://discord.gg/alignui' target='_blank' rel='noopener noreferrer'>
                Join Community
              </a>
            </Button.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
