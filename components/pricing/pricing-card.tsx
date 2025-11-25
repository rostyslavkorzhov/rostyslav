'use client';

import * as React from 'react';
import type { PricingPlan, ProductPricing } from '@/types/pricing';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Table from '@/components/ui/table';
import * as Tooltip from '@/components/ui/tooltip';
import * as Badge from '@/components/ui/badge';
import { RiInformationLine } from '@remixicon/react';
import { cn } from '@/utils/cn';

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const [selectedProduct, setSelectedProduct] = React.useState<'hardPOS' | 'softPOS'>(() => {
    // Determine initial selection based on available products
    if (plan.products.hardPOS) return 'hardPOS';
    if (plan.products.softPOS) return 'softPOS';
    return 'hardPOS'; // Fallback (should not happen)
  });

  const currentProduct = plan.products[selectedProduct];

  if (!currentProduct) {
    return null;
  }

  const hasBothProducts = Boolean(plan.products.hardPOS && plan.products.softPOS);

  return (
    <Tooltip.Provider>
      <div
        className={cn(
          'rounded-20 bg-bg-white-0 shadow-regular-md border border-stroke-soft-200 overflow-hidden',
          plan.isDefault && 'ring-2 ring-primary-base',
        )}
      >
      {/* Card Header */}
      <div className='p-6 border-b border-stroke-soft-200'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-title-h3 text-text-strong-950'>{plan.title.en}</h2>
          {plan.isDefault && (
            <Badge.Root variant='light' color='blue' size='small'>
              Default
            </Badge.Root>
          )}
        </div>

        {/* Product Toggle */}
        {hasBothProducts && (
          <SegmentedControl.Root
            value={selectedProduct}
            onValueChange={(value) => setSelectedProduct(value as 'hardPOS' | 'softPOS')}
          >
            <SegmentedControl.List>
              <SegmentedControl.Trigger value='hardPOS'>HardPOS</SegmentedControl.Trigger>
              <SegmentedControl.Trigger value='softPOS'>SoftPOS</SegmentedControl.Trigger>
            </SegmentedControl.List>
          </SegmentedControl.Root>
        )}
      </div>

      {/* Card Content */}
      <div className='p-6 space-y-6'>
        {/* Setup Fee */}
        <div className='flex items-center justify-between'>
          <span className='text-paragraph-sm text-text-sub-600'>Setup Fee</span>
          {currentProduct.setupFee.amount === 0 ? (
            <Badge.Root variant='light' color='green' size='small'>
              Free Setup
            </Badge.Root>
          ) : (
            <span className='text-paragraph-md text-text-strong-950 font-medium'>
              {currentProduct.setupFee.amount} SAR
              <span className='text-paragraph-xs text-text-sub-600 ml-1'>
                (One-time)
              </span>
            </span>
          )}
        </div>

        {/* Subscription Fee */}
        {currentProduct.subscriptionFee.isDisabled ? (
          <div className='flex items-center justify-between opacity-50'>
            <span className='text-paragraph-sm text-text-sub-600'>Monthly Subscription</span>
            <span className='text-paragraph-md text-text-disabled-300 line-through'>
              {currentProduct.subscriptionFee.amount} SAR
            </span>
          </div>
        ) : currentProduct.subscriptionFee.amount > 0 ? (
          <div className='flex items-center justify-between'>
            <span className='text-paragraph-sm text-text-sub-600'>Monthly Subscription</span>
            <span className='text-paragraph-md text-text-strong-950 font-medium'>
              {currentProduct.subscriptionFee.amount} SAR
              <span className='text-paragraph-xs text-text-sub-600 ml-1'>
                /month
              </span>
            </span>
          </div>
        ) : null}

        {/* Transaction Fees */}
        {currentProduct.transactionFees.length > 0 && (
          <div>
            <h3 className='text-subheading-md text-text-strong-950 mb-4'>
              Transaction Fees
            </h3>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Scheme</Table.Head>
                  <Table.Head>Fee</Table.Head>
                  <Table.Head className='text-right'>Details</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {currentProduct.transactionFees.map((fee, index) => (
                  <React.Fragment key={fee.scheme}>
                    <Table.Row>
                      <Table.Cell>{fee.scheme}</Table.Cell>
                      <Table.Cell>
                        <div className='flex flex-col gap-1'>
                          <span className='text-paragraph-sm text-text-strong-950'>
                            {fee.percent}%
                            {fee.fixedAmount > 0 && (
                              <span className='text-text-sub-600'> + {fee.fixedAmount} SAR</span>
                            )}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          {fee.cap > 0 && (
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <button
                                  type='button'
                                  className='inline-flex items-center gap-1 text-paragraph-xs text-text-sub-600 hover:text-text-strong-950 transition-colors'
                                >
                                  <RiInformationLine className='size-4' />
                                  Cap
                                </button>
                              </Tooltip.Trigger>
                              <Tooltip.Content>
                                Capped at {fee.cap} SAR
                              </Tooltip.Content>
                            </Tooltip.Root>
                          )}
                          {fee.threshold &&
                            fee.threshold.amount > 0 &&
                            fee.threshold.feeBelowThreshold > 0 && (
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <button
                                    type='button'
                                    className='inline-flex items-center gap-1 text-paragraph-xs text-text-sub-600 hover:text-text-strong-950 transition-colors'
                                    aria-label='Threshold information'
                                  >
                                    <RiInformationLine className='size-4' />
                                  </button>
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                  Transactions below {fee.threshold.amount} SAR have a fixed fee
                                  of {fee.threshold.feeBelowThreshold} SAR
                                </Tooltip.Content>
                              </Tooltip.Root>
                            )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    {index < currentProduct.transactionFees.length - 1 && (
                      <Table.RowDivider />
                    )}
                  </React.Fragment>
                ))}
              </Table.Body>
            </Table.Root>
        </div>
        )}
      </div>
    </div>
    </Tooltip.Provider>
  );
}

