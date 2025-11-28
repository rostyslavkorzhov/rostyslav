'use client';

import { useState } from 'react';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import * as Breadcrumb from '@/components/ui/breadcrumb';
import * as Pagination from '@/components/ui/pagination';
import * as HorizontalStepper from '@/components/ui/horizontal-stepper';
import Link from 'next/link';

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

export function NavigationShowcase() {
  const [tabValue, setTabValue] = useState('tab1');
  const [page, setPage] = useState(1);

  return (
    <div>
      <h3 className='text-title-h4 mb-6 text-text-strong-950'>Navigation</h3>

      <div className='space-y-8'>
        {/* Tab Menu */}
        <ComponentShowcase title='Tab Menu Horizontal'>
          <div className='w-full max-w-md'>
            <TabMenuHorizontal.Root value={tabValue} onValueChange={setTabValue}>
              <TabMenuHorizontal.List>
                <TabMenuHorizontal.Trigger value='tab1'>
                  Tab 1
                </TabMenuHorizontal.Trigger>
                <TabMenuHorizontal.Trigger value='tab2'>
                  Tab 2
                </TabMenuHorizontal.Trigger>
                <TabMenuHorizontal.Trigger value='tab3'>
                  Tab 3
                </TabMenuHorizontal.Trigger>
              </TabMenuHorizontal.List>
              <TabMenuHorizontal.Content value='tab1'>
                Content for Tab 1
              </TabMenuHorizontal.Content>
              <TabMenuHorizontal.Content value='tab2'>
                Content for Tab 2
              </TabMenuHorizontal.Content>
              <TabMenuHorizontal.Content value='tab3'>
                Content for Tab 3
              </TabMenuHorizontal.Content>
            </TabMenuHorizontal.Root>
          </div>
        </ComponentShowcase>

        {/* Breadcrumb */}
        <ComponentShowcase title='Breadcrumb'>
          <Breadcrumb.Root>
            <Breadcrumb.Item asChild>
              <Link href='#'>Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.ArrowIcon />
            <Breadcrumb.Item asChild>
              <Link href='#'>Library</Link>
            </Breadcrumb.Item>
            <Breadcrumb.ArrowIcon />
            <Breadcrumb.Item active>Current Page</Breadcrumb.Item>
          </Breadcrumb.Root>
        </ComponentShowcase>

        {/* Pagination */}
        <ComponentShowcase title='Pagination'>
          <Pagination.Root variant='basic'>
            <Pagination.NavButton>
              <Pagination.NavIcon as='span'>←</Pagination.NavIcon>
            </Pagination.NavButton>
            <Pagination.Item current={page === 1} onClick={() => setPage(1)}>
              1
            </Pagination.Item>
            <Pagination.Item current={page === 2} onClick={() => setPage(2)}>
              2
            </Pagination.Item>
            <Pagination.Item current={page === 3} onClick={() => setPage(3)}>
              3
            </Pagination.Item>
            <Pagination.NavButton>
              <Pagination.NavIcon as='span'>→</Pagination.NavIcon>
            </Pagination.NavButton>
          </Pagination.Root>
        </ComponentShowcase>

        {/* Stepper */}
        <ComponentShowcase title='Horizontal Stepper'>
          <div className='w-full max-w-md'>
            <HorizontalStepper.Root>
              <HorizontalStepper.Item state='completed'>
                <HorizontalStepper.ItemIndicator state='completed' />
                Step 1
              </HorizontalStepper.Item>
              <HorizontalStepper.SeparatorIcon />
              <HorizontalStepper.Item state='active'>
                <HorizontalStepper.ItemIndicator state='active'>
                  2
                </HorizontalStepper.ItemIndicator>
                Step 2
              </HorizontalStepper.Item>
              <HorizontalStepper.SeparatorIcon />
              <HorizontalStepper.Item state='default'>
                <HorizontalStepper.ItemIndicator state='default'>
                  3
                </HorizontalStepper.ItemIndicator>
                Step 3
              </HorizontalStepper.Item>
              <HorizontalStepper.SeparatorIcon />
              <HorizontalStepper.Item state='default'>
                <HorizontalStepper.ItemIndicator state='default'>
                  4
                </HorizontalStepper.ItemIndicator>
                Step 4
              </HorizontalStepper.Item>
            </HorizontalStepper.Root>
          </div>
        </ComponentShowcase>
      </div>
    </div>
  );
}
