'use client';

import * as Button from '@/components/ui/button';
import { RiStarLine } from '@remixicon/react';

function ComponentShowcase({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
      <h4 className='text-title-h5 mb-6 text-text-strong-950'>{title}</h4>
      <div className='flex flex-wrap gap-4'>{children}</div>
    </div>
  );
}

export function ButtonsShowcase() {
  return (
    <div>
      <h3 className='text-title-h4 mb-6 text-text-strong-950'>Buttons</h3>

      <div className='space-y-8'>
        {/* Variants - Primary */}
        <ComponentShowcase title='Primary Variant'>
          <Button.Root variant='primary' mode='filled'>
            Filled
          </Button.Root>
          <Button.Root variant='primary' mode='stroke'>
            Stroke
          </Button.Root>
          <Button.Root variant='primary' mode='lighter'>
            Lighter
          </Button.Root>
          <Button.Root variant='primary' mode='ghost'>
            Ghost
          </Button.Root>
        </ComponentShowcase>

        {/* Variants - Neutral */}
        <ComponentShowcase title='Neutral Variant'>
          <Button.Root variant='neutral' mode='filled'>
            Filled
          </Button.Root>
          <Button.Root variant='neutral' mode='stroke'>
            Stroke
          </Button.Root>
          <Button.Root variant='neutral' mode='lighter'>
            Lighter
          </Button.Root>
          <Button.Root variant='neutral' mode='ghost'>
            Ghost
          </Button.Root>
        </ComponentShowcase>

        {/* Variants - Error */}
        <ComponentShowcase title='Error Variant'>
          <Button.Root variant='error' mode='filled'>
            Filled
          </Button.Root>
          <Button.Root variant='error' mode='stroke'>
            Stroke
          </Button.Root>
          <Button.Root variant='error' mode='lighter'>
            Lighter
          </Button.Root>
          <Button.Root variant='error' mode='ghost'>
            Ghost
          </Button.Root>
        </ComponentShowcase>

        {/* Sizes */}
        <ComponentShowcase title='Sizes'>
          <Button.Root variant='primary' size='medium'>
            Medium
          </Button.Root>
          <Button.Root variant='primary' size='small'>
            Small
          </Button.Root>
          <Button.Root variant='primary' size='xsmall'>
            XSmall
          </Button.Root>
          <Button.Root variant='primary' size='xxsmall'>
            XXSmall
          </Button.Root>
        </ComponentShowcase>

        {/* With Icons */}
        <ComponentShowcase title='With Icons'>
          <Button.Root variant='primary'>
            <Button.Icon as={RiStarLine} />
            With Icon
          </Button.Root>
          <Button.Root variant='primary'>
            With Icon
            <Button.Icon as={RiStarLine} />
          </Button.Root>
          <Button.Root variant='primary' size='small'>
            <Button.Icon as={RiStarLine} />
            Small
          </Button.Root>
        </ComponentShowcase>

        {/* Disabled */}
        <ComponentShowcase title='Disabled'>
          <Button.Root variant='primary' disabled>
            Disabled
          </Button.Root>
          <Button.Root variant='neutral' mode='stroke' disabled>
            Disabled
          </Button.Root>
        </ComponentShowcase>
      </div>
    </div>
  );
}
