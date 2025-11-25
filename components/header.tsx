'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import * as Button from '@/components/ui/button';
import * as Dropdown from '@/components/ui/dropdown';
import * as Drawer from '@/components/ui/drawer';
import * as CompactButton from '@/components/ui/compact-button';
import { RiArrowDownSLine, RiMenuLine } from '@remixicon/react';

const DynamicThemeSwitch = dynamic(() => import('./theme-switch'), {
  ssr: false,
});

const navigationItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Resources',
    items: [
      {
        label: 'Documentation',
        href: 'https://alignui.com',
      },
      {
        label: 'Discord Community',
        href: 'https://discord.gg/alignui',
      },
    ],
  },
];

export default function Header() {
  return (
    <div className='border-b border-stroke-soft-200 bg-bg-white-0'>
      <header className='mx-auto flex h-14 max-w-7xl items-center justify-between px-5'>
        {/* Logo/Brand */}
        <div className='flex items-center gap-8'>
          <Link
            href='/'
            className='flex items-center gap-2 text-label-md font-medium text-text-strong-950 transition-colors hover:text-text-sub-600'
          >
            AlignUI
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className='hidden items-center gap-1 md:flex' aria-label='Main navigation'>
            {navigationItems.map((item) => {
              if (item.items) {
                return (
                  <Dropdown.Root key={item.label}>
                    <Dropdown.Trigger asChild>
                      <Button.Root
                        variant='neutral'
                        mode='ghost'
                        size='small'
                        className='text-text-sub-600 hover:text-text-strong-950'
                      >
                        {item.label}
                        <Button.Icon as={RiArrowDownSLine} />
                      </Button.Root>
                    </Dropdown.Trigger>
                    <Dropdown.Content align='start' className='min-w-[200px]'>
                      <Dropdown.Group>
                        {item.items.map((subItem) => (
                          <Dropdown.Item key={subItem.label} asChild>
                            <Link href={subItem.href}>{subItem.label}</Link>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Group>
                    </Dropdown.Content>
                  </Dropdown.Root>
                );
              }

              return (
                <Button.Root
                  key={item.label}
                  variant='neutral'
                  mode='ghost'
                  size='small'
                  asChild
                  className='text-text-sub-600 hover:text-text-strong-950'
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button.Root>
              );
            })}
          </nav>
        </div>

        {/* Right side actions */}
        <div className='flex items-center gap-4'>
          <DynamicThemeSwitch />

          {/* Mobile Menu */}
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <CompactButton.Root
                variant='ghost'
                size='large'
                className='md:hidden'
                aria-label='Open menu'
              >
                <CompactButton.Icon as={RiMenuLine} />
              </CompactButton.Root>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Menu</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <nav className='flex flex-col gap-1 p-5' aria-label='Mobile navigation'>
                  {navigationItems.map((item) => {
                    if (item.items) {
                      return (
                        <div key={item.label} className='flex flex-col gap-1'>
                          <div className='px-2 py-1 text-subheading-xs uppercase text-text-soft-400'>
                            {item.label}
                          </div>
                          {item.items.map((subItem) => (
                            <Button.Root
                              key={subItem.label}
                              variant='neutral'
                              mode='ghost'
                              size='small'
                              asChild
                              className='justify-start text-text-sub-600 hover:text-text-strong-950'
                            >
                              <Link href={subItem.href}>{subItem.label}</Link>
                            </Button.Root>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <Button.Root
                        key={item.label}
                        variant='neutral'
                        mode='ghost'
                        size='small'
                        asChild
                        className='justify-start text-text-sub-600 hover:text-text-strong-950'
                      >
                        <Link href={item.href}>{item.label}</Link>
                      </Button.Root>
                    );
                  })}
                </nav>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        </div>
      </header>
    </div>
  );
}
