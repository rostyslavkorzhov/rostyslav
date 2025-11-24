'use client';

import { useTheme } from 'next-themes';
import * as SegmentedControl from '@/components/ui/segmented-control';
import { RiMoonLine, RiSunLine } from '@remixicon/react';

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <SegmentedControl.Root
      value={theme}
      onValueChange={setTheme}
      defaultValue={theme}
    >
      <SegmentedControl.List>
        <SegmentedControl.Trigger value='light' className='aspect-square'>
          <RiSunLine className='size-4' />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value='dark' className='aspect-square'>
          <RiMoonLine className='size-4' />
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
}
