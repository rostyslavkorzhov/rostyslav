'use client';

import * as Avatar from '@/components/ui/avatar';
import * as Accordion from '@/components/ui/accordion';
import * as Table from '@/components/ui/table';

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

export function DataDisplayShowcase() {
  return (
    <div>
      <h3 className='text-title-h4 mb-6 text-text-strong-950'>Data Display</h3>

      <div className='space-y-8'>
        {/* Avatar */}
        <ComponentShowcase title='Avatar'>
          <Avatar.Root size='48'>
            <Avatar.Image
              src='https://api.dicebear.com/7.x/avataaars/svg?seed=John'
              alt='User'
            />
          </Avatar.Root>
          <Avatar.Root size='48'>JD</Avatar.Root>
          <Avatar.Root size='64'>
            <Avatar.Image
              src='https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
              alt='User'
            />
          </Avatar.Root>
          <Avatar.Root size='64'>JD</Avatar.Root>
        </ComponentShowcase>

        {/* Accordion */}
        <ComponentShowcase title='Accordion'>
          <div className='w-full max-w-md'>
            <Accordion.Root type='single' collapsible>
              <Accordion.Item value='item-1'>
                <Accordion.Trigger>Section 1</Accordion.Trigger>
                <Accordion.Content>
                  This is the content for section 1. It can contain any text or
                  components.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value='item-2'>
                <Accordion.Trigger>Section 2</Accordion.Trigger>
                <Accordion.Content>
                  This is the content for section 2. It can contain any text or
                  components.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value='item-3'>
                <Accordion.Trigger>Section 3</Accordion.Trigger>
                <Accordion.Content>
                  This is the content for section 3. It can contain any text or
                  components.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
        </ComponentShowcase>

        {/* Table */}
        <ComponentShowcase title='Table'>
          <div className='w-full overflow-x-auto'>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Name</Table.Head>
                  <Table.Head>Email</Table.Head>
                  <Table.Head>Role</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>John Doe</Table.Cell>
                  <Table.Cell>john@example.com</Table.Cell>
                  <Table.Cell>Admin</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Jane Smith</Table.Cell>
                  <Table.Cell>jane@example.com</Table.Cell>
                  <Table.Cell>User</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Bob Johnson</Table.Cell>
                  <Table.Cell>bob@example.com</Table.Cell>
                  <Table.Cell>User</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </div>
        </ComponentShowcase>
      </div>
    </div>
  );
}
