'use client';

import * as Modal from '@/components/ui/modal';
import * as Dropdown from '@/components/ui/dropdown';
import * as Popover from '@/components/ui/popover';
import * as Tooltip from '@/components/ui/tooltip';
import * as Button from '@/components/ui/button';
import { RiMoreLine, RiSettingsLine } from '@remixicon/react';

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

export function OverlaysShowcase() {
  return (
    <div>
      <h3 className='text-title-h4 mb-6 text-text-strong-950'>Overlays</h3>

      <div className='space-y-8'>
        {/* Modal */}
        <ComponentShowcase title='Modal'>
          <Modal.Root>
            <Modal.Trigger asChild>
              <Button.Root variant='primary'>Open Modal</Button.Root>
            </Modal.Trigger>
            <Modal.Content>
              <Modal.Header>
                <Modal.Title>Modal Title</Modal.Title>
                <Modal.Description>
                  This is a modal dialog example.
                </Modal.Description>
              </Modal.Header>
              <Modal.Body>
                <p className='text-paragraph-md text-text-sub-600'>
                  Modal content goes here. You can add any content you want.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button.Root variant='neutral' mode='ghost'>
                  Cancel
                </Button.Root>
                <Button.Root variant='primary'>Confirm</Button.Root>
              </Modal.Footer>
            </Modal.Content>
          </Modal.Root>
        </ComponentShowcase>

        {/* Dropdown */}
        <ComponentShowcase title='Dropdown'>
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button.Root variant='neutral' mode='stroke'>
                Open Dropdown
                <Button.Icon as={RiMoreLine} />
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align='start' className='min-w-[200px]'>
              <Dropdown.Group>
                <Dropdown.Item>Item 1</Dropdown.Item>
                <Dropdown.Item>Item 2</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item>Item 3</Dropdown.Item>
              </Dropdown.Group>
            </Dropdown.Content>
          </Dropdown.Root>
        </ComponentShowcase>

        {/* Popover */}
        <ComponentShowcase title='Popover'>
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button.Root variant='primary'>Open Popover</Button.Root>
            </Popover.Trigger>
            <Popover.Content align='start' className='w-80'>
              <div className='space-y-2'>
                <h4 className='text-label-md font-medium text-text-strong-950'>
                  Popover Title
                </h4>
                <p className='text-paragraph-sm text-text-sub-600'>
                  This is a popover content example.
                </p>
              </div>
            </Popover.Content>
          </Popover.Root>
        </ComponentShowcase>

        {/* Tooltip */}
        <ComponentShowcase title='Tooltip'>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button.Root variant='neutral' mode='stroke'>
                  Hover for tooltip
                </Button.Root>
              </Tooltip.Trigger>
              <Tooltip.Content size='medium' variant='dark'>
                This is a tooltip
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </ComponentShowcase>
      </div>
    </div>
  );
}
