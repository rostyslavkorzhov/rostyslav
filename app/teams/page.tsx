'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import * as Table from '@/components/ui/table';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import { Input as InputEl } from '@/components/ui/input';
import * as Avatar from '@/components/ui/avatar';
import * as StatusBadge from '@/components/ui/status-badge';
import * as Checkbox from '@/components/ui/checkbox';
import * as Pagination from '@/components/ui/pagination';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import * as Select from '@/components/ui/select';
import * as Dropdown from '@/components/ui/dropdown';
import * as CompactButton from '@/components/ui/compact-button';
import {
  RiSearchLine,
  RiNotificationLine,
  RiExportLine,
  RiFilterLine,
  RiArrowUpDownLine,
  RiMoreLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiSkipLeftLine,
  RiSkipRightLine,
} from '@remixicon/react';

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: 'James Brown',
    email: 'james@alignui.com',
    title: 'Marketing Manager',
    startDate: 'Aug, 2021',
    project: {
      name: 'Monday.com',
      description: 'Campaign Strategy Brainstorming',
      logo: 'https://logo.clearbit.com/monday.com',
    },
    document: {
      name: 'brown-james.pdf',
      size: '2.4 MB',
    },
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 2,
    name: 'Sophia Williams',
    email: 'sophia@alignui.com',
    title: 'HR Assistant',
    startDate: 'Aug, 2021',
    project: {
      name: 'Notion',
      description: 'Employee Engagement Survey',
      logo: 'https://logo.clearbit.com/notion.so',
    },
    document: {
      name: 'williams-sophia.pdf',
      size: '2.4 MB',
    },
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=68',
  },
  {
    id: 3,
    name: 'Arthur Taylor',
    email: 'arthur@alignui.com',
    title: 'Entrepreneur / CEO',
    startDate: 'May, 2022',
    project: {
      name: 'Spotify',
      description: 'Vision and Goal Setting Session',
      logo: 'https://logo.clearbit.com/spotify.com',
    },
    document: {
      name: 'taylor-arthur.pdf',
      size: '2.4 MB',
    },
    status: 'absent',
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: 4,
    name: 'Emma Wright',
    email: 'emma@alignui.com',
    title: 'Front-end Developer',
    startDate: 'Sep, 2022',
    project: {
      name: 'Formcarry',
      description: 'User Feedback Analysis',
      logo: 'https://logo.clearbit.com/formcarry.com',
    },
    document: {
      name: 'wright-emma.pdf',
      size: '1.9 MB',
    },
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 5,
    name: 'Matthew Johnson',
    email: 'matthew@alignui.com',
    title: 'Data Software Engineer',
    startDate: 'Feb, 2022',
    project: {
      name: 'Loom',
      description: 'Data Analysis Methodology',
      logo: 'https://logo.clearbit.com/loom.com',
    },
    document: {
      name: 'johnson-matthew.pdf',
      size: '2.9 MB',
    },
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: 6,
    name: 'Laura Perez',
    email: 'laura@alignui.com',
    title: 'Fashion Designer',
    startDate: 'Mar, 2022',
    project: {
      name: 'Tidal',
      description: 'Design Trends and Inspirations',
      logo: 'https://logo.clearbit.com/tidal.com',
    },
    document: {
      name: 'perez-laura.pdf',
      size: '2.5 MB',
    },
    status: 'absent',
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: 7,
    name: 'Wei Chen',
    email: 'wei@alignui.com',
    title: 'Operations Manager',
    startDate: 'July, 2021',
    project: {
      name: 'Dropbox',
      description: 'Process Optimization Brainstorming',
      logo: 'https://logo.clearbit.com/dropbox.com',
    },
    document: {
      name: 'chen-wei.pdf',
      size: '2.6 MB',
    },
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
];

export default function TeamsPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(new Set(teamMembers.map((m) => m.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleRowSelect = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === teamMembers.length);
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar />
      <main className='flex flex-1 flex-col overflow-hidden bg-bg-white-0'>
        {/* Header */}
        <div className='border-b border-stroke-soft-200 bg-bg-white-0 px-8 py-6'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <h1 className='text-title-h1 text-text-strong-950 mb-2'>Teams</h1>
              <p className='text-paragraph-lg text-text-sub-600 mb-6'>
                Manage and collaborate within your organization&apos;s teams.
              </p>
              <div>
                <h2 className='text-subheading-sm text-text-strong-950 mb-1'>Members</h2>
                <p className='text-paragraph-sm text-text-sub-600'>
                  Display all the team members and essential details.
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button.Root variant='neutral' mode='stroke' size='small'>
                <Button.Icon as={RiExportLine} />
                Export
              </Button.Root>
              <Button.Root variant='primary' mode='filled' size='small'>
                + Invite Member
              </Button.Root>
              <CompactButton.Root variant='ghost' size='large'>
                <CompactButton.Icon as={RiSearchLine} />
              </CompactButton.Root>
              <CompactButton.Root variant='ghost' size='large'>
                <CompactButton.Icon as={RiNotificationLine} />
              </CompactButton.Root>
            </div>
          </div>
        </div>

        {/* Filter/Action Bar */}
        <div className='border-b border-stroke-soft-200 bg-bg-white-0 px-8 py-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <TabMenuHorizontal.Root value={selectedTab} onValueChange={setSelectedTab}>
                <TabMenuHorizontal.List>
                  <TabMenuHorizontal.Trigger value='all'>All</TabMenuHorizontal.Trigger>
                  <TabMenuHorizontal.Trigger value='active'>Active</TabMenuHorizontal.Trigger>
                  <TabMenuHorizontal.Trigger value='absent'>Absent</TabMenuHorizontal.Trigger>
                </TabMenuHorizontal.List>
              </TabMenuHorizontal.Root>

              <Input.Root size='medium' className='w-[280px]'>
                <Input.Wrapper>
                  <Input.Icon as={RiSearchLine} />
                  <InputEl type='text' placeholder='Search...' />
                  <Input.Affix>
                    <span className='text-label-xs text-text-soft-400'>⌘1</span>
                  </Input.Affix>
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div className='flex items-center gap-2'>
              <Button.Root variant='neutral' mode='stroke' size='small'>
                <Button.Icon as={RiFilterLine} />
                Filter
              </Button.Root>
              <Select.Root variant='compact' size='small'>
                <Select.Trigger>
                  <Select.TriggerIcon as={RiArrowUpDownLine} />
                  <Select.Value placeholder='Sort by' />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value='name'>Name</Select.Item>
                  <Select.Item value='date'>Date</Select.Item>
                  <Select.Item value='status'>Status</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='flex-1 overflow-auto px-8 py-6'>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head className='w-12'>
                  <Checkbox.Root
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                </Table.Head>
                <Table.Head className='min-w-[240px]'>
                  <div className='flex items-center gap-1.5'>
                    <span>Member Name</span>
                    <RiArrowUpDownLine className='size-3.5 text-text-soft-400' />
                  </div>
                </Table.Head>
                <Table.Head className='min-w-[200px]'>
                  <div className='flex items-center gap-1.5'>
                    <span>Title</span>
                    <RiArrowUpDownLine className='size-3.5 text-text-soft-400' />
                  </div>
                </Table.Head>
                <Table.Head className='min-w-[280px]'>
                  <div className='flex items-center gap-1.5'>
                    <span>Projects</span>
                    <RiArrowUpDownLine className='size-3.5 text-text-soft-400' />
                  </div>
                </Table.Head>
                <Table.Head className='min-w-[200px]'>
                  <div className='flex items-center gap-1.5'>
                    <span>Member Documents</span>
                    <RiArrowUpDownLine className='size-3.5 text-text-soft-400' />
                  </div>
                </Table.Head>
                <Table.Head className='min-w-[120px]'>
                  <div className='flex items-center gap-1.5'>
                    <span>Status</span>
                    <RiArrowUpDownLine className='size-3.5 text-text-soft-400' />
                  </div>
                </Table.Head>
                <Table.Head className='w-12'></Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {teamMembers.map((member) => (
                <Table.Row key={member.id}>
                  <Table.Cell>
                    <Checkbox.Root
                      checked={selectedRows.has(member.id)}
                      onCheckedChange={(checked) =>
                        handleRowSelect(member.id, checked as boolean)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <div className='flex items-center gap-3'>
                      <Avatar.Root size='40' color='purple' className='shrink-0'>
                        <Avatar.Image src={member.avatar} alt={member.name} />
                      </Avatar.Root>
                      <div className='flex min-w-0 flex-col'>
                        <span className='text-label-sm font-medium text-text-strong-950 truncate'>
                          {member.name}
                        </span>
                        <span className='text-label-xs text-text-sub-600 truncate'>
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className='flex min-w-0 flex-col'>
                      <span className='text-label-sm text-text-strong-950 truncate'>
                        {member.title}
                      </span>
                      <span className='text-label-xs text-text-sub-600'>
                        Since {member.startDate}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className='flex items-center gap-2'>
                      <div className='flex size-6 shrink-0 items-center justify-center rounded bg-bg-weak-50'>
                        <img
                          src={member.project.logo}
                          alt={member.project.name}
                          className='size-5 rounded object-cover'
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = member.project.name.charAt(0).toUpperCase();
                              parent.className = 'flex size-6 shrink-0 items-center justify-center rounded bg-primary-alpha-10 text-label-xs font-medium text-primary-base';
                            }
                          }}
                        />
                      </div>
                      <div className='flex min-w-0 flex-col'>
                        <span className='text-label-sm text-text-strong-950 truncate'>
                          {member.project.name}
                        </span>
                        <span className='text-label-xs text-text-sub-600 truncate'>
                          {member.project.description}
                        </span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className='flex items-center gap-2'>
                      <div className='flex size-8 shrink-0 items-center justify-center rounded bg-error-base'>
                        <span className='text-[10px] font-semibold leading-none text-static-white'>
                          PDF
                        </span>
                      </div>
                      <div className='flex min-w-0 flex-col'>
                        <span className='text-label-sm text-text-strong-950 truncate'>
                          {member.document.name}
                        </span>
                        <span className='text-label-xs text-text-sub-600'>
                          {member.document.size}
                        </span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge.Root
                      variant='light'
                      status={member.status === 'active' ? 'completed' : 'disabled'}
                    >
                      <StatusBadge.Dot />
                      <span className='capitalize'>{member.status}</span>
                    </StatusBadge.Root>
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown.Root>
                      <Dropdown.Trigger asChild>
                        <CompactButton.Root variant='ghost' size='medium'>
                          <CompactButton.Icon as={RiMoreLine} />
                        </CompactButton.Root>
                      </Dropdown.Trigger>
                      <Dropdown.Content align='end'>
                        <Dropdown.Item>Edit</Dropdown.Item>
                        <Dropdown.Item>Delete</Dropdown.Item>
                      </Dropdown.Content>
                    </Dropdown.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>

        {/* Pagination */}
        <div className='border-t border-stroke-soft-200 bg-bg-white-0 px-8 py-4'>
          <div className='flex items-center justify-between'>
            <span className='text-paragraph-sm text-text-sub-600'>Page 2 of 16</span>
            <div className='flex items-center gap-4'>
              <Pagination.Root variant='basic'>
                <Pagination.NavButton aria-label='First page'>
                  <Pagination.NavIcon as={RiSkipLeftLine} />
                </Pagination.NavButton>
                <Pagination.NavButton aria-label='Previous page'>
                  <Pagination.NavIcon as={RiArrowLeftSLine} />
                </Pagination.NavButton>
                <Pagination.Item current={false}>1</Pagination.Item>
                <Pagination.Item current={true}>2</Pagination.Item>
                <Pagination.Item current={false}>3</Pagination.Item>
                <Pagination.Item current={false}>4</Pagination.Item>
                <Pagination.Item current={false}>5</Pagination.Item>
                <span className='px-1 text-label-sm text-text-sub-600'>...</span>
                <Pagination.Item current={false}>16</Pagination.Item>
                <Pagination.NavButton aria-label='Next page'>
                  <Pagination.NavIcon as={RiArrowRightSLine} />
                </Pagination.NavButton>
                <Pagination.NavButton aria-label='Last page'>
                  <Pagination.NavIcon as={RiSkipRightLine} />
                </Pagination.NavButton>
              </Pagination.Root>
              <Select.Root defaultValue='7' variant='compact' size='small'>
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value='7'>7 / page</Select.Item>
                  <Select.Item value='10'>10 / page</Select.Item>
                  <Select.Item value='20'>20 / page</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

