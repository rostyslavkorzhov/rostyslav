'use client';

import * as Button from '@/components/ui/button';
import * as FancyButton from '@/components/ui/fancy-button';
import * as CompactButton from '@/components/ui/compact-button';
import * as LinkButton from '@/components/ui/link-button';
import * as SocialButton from '@/components/ui/social-button';
import { RiAddLine, RiArrowRightSLine, RiCheckLine } from '@remixicon/react';

export default function ButtonsPage() {
  return (
    <div className='container mx-auto flex-1 px-5 py-8'>
      <div className='mx-auto max-w-6xl'>
        <h1 className='text-title-h1 text-text-strong-950 mb-8'>Buttons</h1>

        {/* Button Component */}
        <section className='mb-12'>
          <h2 className='text-title-h2 text-text-strong-950 mb-6'>Button</h2>

          {/* Variants */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Variants</h3>
            <div className='flex flex-wrap gap-4'>
              {/* Primary */}
              <div className='flex flex-col gap-2'>
                <Button.Root variant='primary' mode='filled'>
                  Primary Filled
                </Button.Root>
                <Button.Root variant='primary' mode='stroke'>
                  Primary Stroke
                </Button.Root>
                <Button.Root variant='primary' mode='lighter'>
                  Primary Lighter
                </Button.Root>
                <Button.Root variant='primary' mode='ghost'>
                  Primary Ghost
                </Button.Root>
              </div>

              {/* Neutral */}
              <div className='flex flex-col gap-2'>
                <Button.Root variant='neutral' mode='filled'>
                  Neutral Filled
                </Button.Root>
                <Button.Root variant='neutral' mode='stroke'>
                  Neutral Stroke
                </Button.Root>
                <Button.Root variant='neutral' mode='lighter'>
                  Neutral Lighter
                </Button.Root>
                <Button.Root variant='neutral' mode='ghost'>
                  Neutral Ghost
                </Button.Root>
              </div>

              {/* Error */}
              <div className='flex flex-col gap-2'>
                <Button.Root variant='error' mode='filled'>
                  Error Filled
                </Button.Root>
                <Button.Root variant='error' mode='stroke'>
                  Error Stroke
                </Button.Root>
                <Button.Root variant='error' mode='lighter'>
                  Error Lighter
                </Button.Root>
                <Button.Root variant='error' mode='ghost'>
                  Error Ghost
                </Button.Root>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Sizes</h3>
            <div className='flex flex-wrap items-center gap-4'>
              <Button.Root variant='primary' mode='filled' size='medium'>
                Medium
              </Button.Root>
              <Button.Root variant='primary' mode='filled' size='small'>
                Small
              </Button.Root>
              <Button.Root variant='primary' mode='filled' size='xsmall'>
                XSmall
              </Button.Root>
              <Button.Root variant='primary' mode='filled' size='xxsmall'>
                XXSmall
              </Button.Root>
            </div>
          </div>

          {/* With Icons */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>With Icons</h3>
            <div className='flex flex-wrap gap-4'>
              <Button.Root variant='primary' mode='filled'>
                <Button.Icon as={RiAddLine} />
                Add Item
              </Button.Root>
              <Button.Root variant='primary' mode='filled'>
                Continue
                <Button.Icon as={RiArrowRightSLine} />
              </Button.Root>
              <Button.Root variant='neutral' mode='stroke'>
                <Button.Icon as={RiCheckLine} />
                Confirm
              </Button.Root>
            </div>
          </div>

          {/* Disabled */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Disabled</h3>
            <div className='flex flex-wrap gap-4'>
              <Button.Root variant='primary' mode='filled' disabled>
                Disabled
              </Button.Root>
              <Button.Root variant='neutral' mode='stroke' disabled>
                Disabled
              </Button.Root>
              <Button.Root variant='error' mode='filled' disabled>
                Disabled
              </Button.Root>
            </div>
          </div>
        </section>

        {/* FancyButton Component */}
        <section className='mb-12'>
          <h2 className='text-title-h2 text-text-strong-950 mb-6'>FancyButton</h2>

          {/* Variants */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Variants</h3>
            <div className='flex flex-wrap gap-4'>
              <FancyButton.Root variant='neutral'>Neutral</FancyButton.Root>
              <FancyButton.Root variant='primary'>Primary</FancyButton.Root>
              <FancyButton.Root variant='destructive'>Destructive</FancyButton.Root>
              <FancyButton.Root variant='basic'>Basic</FancyButton.Root>
            </div>
          </div>

          {/* Sizes */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Sizes</h3>
            <div className='flex flex-wrap items-center gap-4'>
              <FancyButton.Root variant='primary' size='medium'>
                Medium
              </FancyButton.Root>
              <FancyButton.Root variant='primary' size='small'>
                Small
              </FancyButton.Root>
              <FancyButton.Root variant='primary' size='xsmall'>
                XSmall
              </FancyButton.Root>
            </div>
          </div>

          {/* With Icons */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>With Icons</h3>
            <div className='flex flex-wrap gap-4'>
              <FancyButton.Root variant='primary'>
                <FancyButton.Icon as={RiAddLine} />
                Add Item
              </FancyButton.Root>
              <FancyButton.Root variant='neutral'>
                Continue
                <FancyButton.Icon as={RiArrowRightSLine} />
              </FancyButton.Root>
            </div>
          </div>

          {/* Disabled */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Disabled</h3>
            <div className='flex flex-wrap gap-4'>
              <FancyButton.Root variant='primary' disabled>
                Disabled
              </FancyButton.Root>
              <FancyButton.Root variant='neutral' disabled>
                Disabled
              </FancyButton.Root>
            </div>
          </div>
        </section>

        {/* CompactButton Component */}
        <section className='mb-12'>
          <h2 className='text-title-h2 text-text-strong-950 mb-6'>CompactButton</h2>

          {/* Variants */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Variants</h3>
            <div className='flex flex-wrap items-center gap-4'>
              <CompactButton.Root variant='stroke'>
                <CompactButton.Icon as={RiAddLine} />
              </CompactButton.Root>
              <CompactButton.Root variant='ghost'>
                <CompactButton.Icon as={RiAddLine} />
              </CompactButton.Root>
              <CompactButton.Root variant='white'>
                <CompactButton.Icon as={RiAddLine} />
              </CompactButton.Root>
            </div>
          </div>

          {/* Sizes */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Sizes</h3>
            <div className='flex flex-wrap items-center gap-4'>
              <CompactButton.Root variant='stroke' size='large'>
                <CompactButton.Icon as={RiAddLine} />
              </CompactButton.Root>
              <CompactButton.Root variant='stroke' size='medium'>
                <CompactButton.Icon as={RiAddLine} />
              </CompactButton.Root>
            </div>
          </div>

          {/* Full Radius */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Full Radius</h3>
            <div className='flex flex-wrap items-center gap-4'>
              <CompactButton.Root variant='stroke' fullRadius={false}>
                <CompactButton.Icon as={RiAddLine} />
              </CompactButton.Root>
              <CompactButton.Root variant='stroke' fullRadius={true}>
                <CompactButton.Icon as={RiAddLine} />
              </CompactButton.Root>
            </div>
          </div>

          {/* Disabled */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Disabled</h3>
            <div className='flex flex-wrap items-center gap-4'>
              <CompactButton.Root variant='stroke' disabled>
                <CompactButton.Icon as={RiAddLine} />
              </CompactButton.Root>
              <CompactButton.Root variant='ghost' disabled>
                <CompactButton.Icon as={RiAddLine} />
              </CompactButton.Root>
            </div>
          </div>
        </section>

        {/* LinkButton Component */}
        <section className='mb-12'>
          <h2 className='text-title-h2 text-text-strong-950 mb-6'>LinkButton</h2>

          {/* Variants */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Variants</h3>
            <div className='flex flex-wrap gap-4'>
              <LinkButton.Root variant='gray'>Gray Link</LinkButton.Root>
              <LinkButton.Root variant='black'>Black Link</LinkButton.Root>
              <LinkButton.Root variant='primary'>Primary Link</LinkButton.Root>
              <LinkButton.Root variant='error'>Error Link</LinkButton.Root>
            </div>
          </div>

          {/* Sizes */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Sizes</h3>
            <div className='flex flex-wrap items-center gap-4'>
              <LinkButton.Root variant='primary' size='medium'>
                Medium
              </LinkButton.Root>
              <LinkButton.Root variant='primary' size='small'>
                Small
              </LinkButton.Root>
            </div>
          </div>

          {/* With Icons */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>With Icons</h3>
            <div className='flex flex-wrap gap-4'>
              <LinkButton.Root variant='primary'>
                <LinkButton.Icon as={RiArrowRightSLine} />
                Learn More
              </LinkButton.Root>
              <LinkButton.Root variant='gray'>
                Read More
                <LinkButton.Icon as={RiArrowRightSLine} />
              </LinkButton.Root>
            </div>
          </div>

          {/* Underline */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Underline</h3>
            <div className='flex flex-wrap gap-4'>
              <LinkButton.Root variant='primary' underline={false}>
                Without Underline
              </LinkButton.Root>
              <LinkButton.Root variant='primary' underline={true}>
                With Underline
              </LinkButton.Root>
            </div>
          </div>

          {/* Disabled */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Disabled</h3>
            <div className='flex flex-wrap gap-4'>
              <LinkButton.Root variant='primary' disabled>
                Disabled
              </LinkButton.Root>
              <LinkButton.Root variant='gray' disabled>
                Disabled
              </LinkButton.Root>
            </div>
          </div>
        </section>

        {/* SocialButton Component */}
        <section className='mb-12'>
          <h2 className='text-title-h2 text-text-strong-950 mb-6'>SocialButton</h2>

          {/* Filled Mode */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Filled Mode</h3>
            <div className='flex flex-wrap gap-4'>
              <SocialButton.Root brand='apple' mode='filled'>
                <SocialButton.Icon as={RiAddLine} />
                Apple
              </SocialButton.Root>
              <SocialButton.Root brand='twitter' mode='filled'>
                <SocialButton.Icon as={RiAddLine} />
                Twitter
              </SocialButton.Root>
              <SocialButton.Root brand='google' mode='filled'>
                <SocialButton.Icon as={RiAddLine} />
                Google
              </SocialButton.Root>
              <SocialButton.Root brand='facebook' mode='filled'>
                <SocialButton.Icon as={RiAddLine} />
                Facebook
              </SocialButton.Root>
              <SocialButton.Root brand='linkedin' mode='filled'>
                <SocialButton.Icon as={RiAddLine} />
                LinkedIn
              </SocialButton.Root>
              <SocialButton.Root brand='dropbox' mode='filled'>
                <SocialButton.Icon as={RiAddLine} />
                Dropbox
              </SocialButton.Root>
            </div>
          </div>

          {/* Stroke Mode */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Stroke Mode</h3>
            <div className='flex flex-wrap gap-4'>
              <SocialButton.Root brand='apple' mode='stroke'>
                <SocialButton.Icon as={RiAddLine} />
                Apple
              </SocialButton.Root>
              <SocialButton.Root brand='twitter' mode='stroke'>
                <SocialButton.Icon as={RiAddLine} />
                Twitter
              </SocialButton.Root>
            </div>
          </div>

          {/* Disabled */}
          <div className='mb-8'>
            <h3 className='text-subheading-md text-text-sub-600 mb-4'>Disabled</h3>
            <div className='flex flex-wrap gap-4'>
              <SocialButton.Root brand='google' mode='filled' disabled>
                <SocialButton.Icon as={RiAddLine} />
                Disabled
              </SocialButton.Root>
              <SocialButton.Root brand='facebook' mode='stroke' disabled>
                <SocialButton.Icon as={RiAddLine} />
                Disabled
              </SocialButton.Root>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

