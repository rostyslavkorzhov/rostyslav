'use client';

import * as Alert from '@/components/ui/alert';
import * as Badge from '@/components/ui/badge';
import * as Tag from '@/components/ui/tag';
import * as StatusBadge from '@/components/ui/status-badge';
import * as ProgressBar from '@/components/ui/progress-bar';
import * as ProgressCircle from '@/components/ui/progress-circle';
import { RiErrorWarningLine, RiCheckLine, RiInformationLine, RiCloseLine } from '@remixicon/react';

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

export function FeedbackShowcase() {
  return (
    <div>
      <h3 className='text-title-h4 mb-6 text-text-strong-950'>Feedback</h3>

      <div className='space-y-8'>
        {/* Alert */}
        <ComponentShowcase title='Alert'>
          <div className='w-full max-w-md'>
            <Alert.Root variant='lighter' status='error' size='large'>
              <Alert.Icon as={RiErrorWarningLine} />
              <div>
                <h3>Error Alert</h3>
                <p>This is an error message example.</p>
              </div>
            </Alert.Root>
          </div>
          <div className='w-full max-w-md'>
            <Alert.Root variant='lighter' status='success' size='large'>
              <Alert.Icon as={RiCheckLine} />
              <div>
                <h3>Success Alert</h3>
                <p>This is a success message example.</p>
              </div>
            </Alert.Root>
          </div>
          <div className='w-full max-w-md'>
            <Alert.Root variant='lighter' status='information' size='large'>
              <Alert.Icon as={RiInformationLine} />
              <div>
                <h3>Information Alert</h3>
                <p>This is an information message example.</p>
              </div>
            </Alert.Root>
          </div>
        </ComponentShowcase>

        {/* Badge */}
        <ComponentShowcase title='Badge'>
          <Badge.Root variant='filled' color='blue' size='medium'>
            Blue
          </Badge.Root>
          <Badge.Root variant='filled' color='red' size='medium'>
            Red
          </Badge.Root>
          <Badge.Root variant='filled' color='green' size='medium'>
            Green
          </Badge.Root>
          <Badge.Root variant='filled' color='orange' size='medium'>
            Orange
          </Badge.Root>
          <Badge.Root variant='light' color='blue' size='medium'>
            Light Blue
          </Badge.Root>
          <Badge.Root variant='lighter' color='blue' size='medium'>
            Lighter Blue
          </Badge.Root>
          <Badge.Root variant='stroke' color='blue' size='medium'>
            Stroke Blue
          </Badge.Root>
        </ComponentShowcase>

        {/* Badge Sizes */}
        <ComponentShowcase title='Badge Sizes'>
          <Badge.Root variant='filled' color='blue' size='small'>
            Small
          </Badge.Root>
          <Badge.Root variant='filled' color='blue' size='medium'>
            Medium
          </Badge.Root>
        </ComponentShowcase>

        {/* Tag */}
        <ComponentShowcase title='Tag'>
          <Tag.Root>Default Tag</Tag.Root>
          <Tag.Root variant='stroke'>Stroke Tag</Tag.Root>
          <Tag.Root variant='gray'>Gray Tag</Tag.Root>
        </ComponentShowcase>

        {/* Status Badge */}
        <ComponentShowcase title='Status Badge'>
          <StatusBadge.Root status='completed' variant='light'>
            Completed
          </StatusBadge.Root>
          <StatusBadge.Root status='pending' variant='light'>
            Pending
          </StatusBadge.Root>
          <StatusBadge.Root status='failed' variant='light'>
            Failed
          </StatusBadge.Root>
          <StatusBadge.Root status='disabled' variant='light'>
            Disabled
          </StatusBadge.Root>
        </ComponentShowcase>

        {/* Progress Bar */}
        <ComponentShowcase title='Progress Bar'>
          <div className='w-full max-w-xs space-y-2'>
            <ProgressBar.Root value={25} color='blue' />
            <ProgressBar.Root value={50} color='green' />
            <ProgressBar.Root value={75} color='orange' />
            <ProgressBar.Root value={100} color='red' />
          </div>
        </ComponentShowcase>

        {/* Progress Circle */}
        <ComponentShowcase title='Progress Circle'>
          <ProgressCircle.Root value={25} size='64' />
          <ProgressCircle.Root value={50} size='64' />
          <ProgressCircle.Root value={75} size='64' />
          <ProgressCircle.Root value={100} size='64' />
        </ComponentShowcase>
      </div>
    </div>
  );
}
