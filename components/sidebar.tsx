'use client';

import * as Button from '@/components/ui/button';
import * as Avatar from '@/components/ui/avatar';
import {
  RiDashboardLine,
  RiCalendarLine,
  RiTimeLine,
  RiFolderLine,
  RiTeamLine,
  RiFilterLine,
  RiStarLine,
  RiFileTextLine,
  RiSettingsLine,
  RiCustomerServiceLine,
  RiArrowRightSLine,
  RiCheckLine,
} from '@remixicon/react';
import { cn } from '@/utils/cn';

const mainNavItems = [
  { label: 'Dashboard', icon: RiDashboardLine, href: '#' },
  { label: 'Calendar', icon: RiCalendarLine, href: '#' },
  { label: 'Time Off', icon: RiTimeLine, href: '#' },
  { label: 'Projects', icon: RiFolderLine, href: '#' },
  { label: 'Teams', icon: RiTeamLine, href: '/teams', active: true },
  { label: 'Integrations', icon: RiFilterLine, href: '#' },
  { label: 'Benefits', icon: RiStarLine, href: '#' },
  { label: 'Documents', icon: RiFileTextLine, href: '#' },
];

const favorites = [
  { label: 'Loom Mobile App', color: 'purple', shortcut: '⌘1' },
  { label: 'Monday Redesign', color: 'red', shortcut: '⌘2' },
  { label: 'Udemy Courses', color: 'purple', shortcut: '⌘3' },
];

export default function Sidebar() {
  return (
    <aside className='flex h-screen w-[280px] flex-col border-r border-stroke-soft-200 bg-bg-white-0'>
      {/* Logo Section */}
      <div className='flex items-center justify-between border-b border-stroke-soft-200 px-4 py-4'>
        <div className='flex items-center gap-2'>
          <div className='flex size-8 items-center justify-center rounded-lg bg-primary-base'>
            <svg
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='8' cy='8' r='7' fill='white' />
              <circle cx='8' cy='8' r='3.5' fill='#9333EA' />
            </svg>
          </div>
          <div className='flex flex-col'>
            <span className='text-label-sm font-medium text-text-strong-950'>Synergy</span>
            <span className='text-label-xs text-text-sub-600'>HR Management</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className='flex-1 overflow-y-auto px-2 py-4'>
        <div className='mb-6'>
          <div className='mb-2 px-2 text-subheading-xs uppercase text-text-soft-400'>
            MAIN
          </div>
          <div className='space-y-1'>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active;
              return (
                <Button.Root
                  key={item.label}
                  variant={isActive ? 'primary' : 'neutral'}
                  mode={isActive ? 'lighter' : 'ghost'}
                  size='small'
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-primary-alpha-10 text-primary-base',
                  )}
                  asChild
                >
                  <a href={item.href} className='flex w-full items-center justify-between'>
                    <div className='flex items-center gap-2.5'>
                      <Icon className='size-5' />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <RiArrowRightSLine className='size-5 shrink-0 text-primary-base' />
                    )}
                  </a>
                </Button.Root>
              );
            })}
          </div>
        </div>

        {/* Favorites */}
        <div>
          <div className='mb-2 px-2 text-subheading-xs uppercase text-text-soft-400'>
            FAVS
          </div>
          <div className='space-y-1'>
            {favorites.map((fav) => (
              <Button.Root
                key={fav.label}
                variant='neutral'
                mode='ghost'
                size='small'
                className='w-full justify-start text-text-sub-600'
              >
                <div className='flex w-full items-center gap-2.5'>
                  <div
                    className={cn('size-2 shrink-0 rounded-full', {
                      'bg-primary-base': fav.color === 'purple',
                      'bg-error-base': fav.color === 'red',
                    })}
                  />
                  <span className='flex-1'>{fav.label}</span>
                  <span className='text-label-xs text-text-soft-400'>{fav.shortcut}</span>
                </div>
              </Button.Root>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className='border-t border-stroke-soft-200 px-2 py-4'>
        <div className='space-y-1'>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='small'
            className='w-full justify-start text-text-sub-600'
          >
            <RiSettingsLine className='size-5' />
            <span>Settings</span>
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='small'
            className='w-full justify-start text-text-sub-600'
          >
            <RiCustomerServiceLine className='size-5' />
            <span>Support</span>
          </Button.Root>
        </div>

        {/* User Profile */}
        <div className='mt-4'>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='small'
            className='w-full justify-between px-2 py-2 text-text-sub-600'
          >
            <div className='flex items-center gap-2.5'>
              <Avatar.Root size='32' color='purple' className='shrink-0'>
                <Avatar.Image
                  src='https://i.pravatar.cc/150?img=68'
                  alt='Sophia Williams'
                />
              </Avatar.Root>
              <div className='flex min-w-0 flex-col items-start'>
                <span className='text-label-sm font-medium text-text-strong-950 truncate'>
                  Sophia Williams
                </span>
                <span className='text-label-xs text-text-sub-600 truncate'>
                  sophia@alignui.com
                </span>
              </div>
            </div>
            <div className='flex shrink-0 items-center gap-1'>
              <RiCheckLine className='size-4 text-success-base' />
              <RiArrowRightSLine className='size-5' />
            </div>
          </Button.Root>
        </div>
      </div>
    </aside>
  );
}

