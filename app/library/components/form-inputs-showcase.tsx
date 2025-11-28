'use client';

import { useState } from 'react';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import * as Checkbox from '@/components/ui/checkbox';
import * as Radio from '@/components/ui/radio';
import * as Switch from '@/components/ui/switch';
import * as Textarea from '@/components/ui/textarea';
import * as Slider from '@/components/ui/slider';
import * as Label from '@/components/ui/label';
import { RiSearchLine } from '@remixicon/react';

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

export function FormInputsShowcase() {
  const [selectValue, setSelectValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchChecked, setSwitchChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <div>
      <h3 className='text-title-h4 mb-6 text-text-strong-950'>Form Inputs</h3>

      <div className='space-y-8'>
        {/* Input */}
        <ComponentShowcase title='Input'>
          <div className='w-full max-w-xs'>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input placeholder='Enter text...' />
              </Input.Wrapper>
            </Input.Root>
          </div>
          <div className='w-full max-w-xs'>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiSearchLine} />
                <Input.Input placeholder='Search...' />
              </Input.Wrapper>
            </Input.Root>
          </div>
          <div className='w-full max-w-xs'>
            <Input.Root hasError>
              <Input.Wrapper>
                <Input.Input placeholder='Error state' />
              </Input.Wrapper>
            </Input.Root>
          </div>
        </ComponentShowcase>

        {/* Input Sizes */}
        <ComponentShowcase title='Input Sizes'>
          <div className='w-full max-w-xs'>
            <Input.Root size='medium'>
              <Input.Wrapper>
                <Input.Input placeholder='Medium' />
              </Input.Wrapper>
            </Input.Root>
          </div>
          <div className='w-full max-w-xs'>
            <Input.Root size='small'>
              <Input.Wrapper>
                <Input.Input placeholder='Small' />
              </Input.Wrapper>
            </Input.Root>
          </div>
          <div className='w-full max-w-xs'>
            <Input.Root size='xsmall'>
              <Input.Wrapper>
                <Input.Input placeholder='XSmall' />
              </Input.Wrapper>
            </Input.Root>
          </div>
        </ComponentShowcase>

        {/* Select */}
        <ComponentShowcase title='Select'>
          <Select.Root value={selectValue} onValueChange={setSelectValue}>
            <Select.Trigger>
              <Select.Value placeholder='Select an option' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='option1'>Option 1</Select.Item>
              <Select.Item value='option2'>Option 2</Select.Item>
              <Select.Item value='option3'>Option 3</Select.Item>
            </Select.Content>
          </Select.Root>
        </ComponentShowcase>

        {/* Checkbox */}
        <ComponentShowcase title='Checkbox'>
          <div className='flex items-center gap-2'>
            <Checkbox.Root
              checked={checkboxChecked}
              onCheckedChange={(checked) =>
                setCheckboxChecked(checked === true)
              }
            />
            <Label.Root>Checkbox label</Label.Root>
          </div>
        </ComponentShowcase>

        {/* Radio */}
        <ComponentShowcase title='Radio'>
          <Radio.Group
            value={radioValue}
            onValueChange={setRadioValue}
            className='flex flex-col gap-3'
          >
            <div className='flex items-center gap-2'>
              <Radio.Item value='option1' id='radio-option1' />
              <Label.Root htmlFor='radio-option1'>Option 1</Label.Root>
            </div>
            <div className='flex items-center gap-2'>
              <Radio.Item value='option2' id='radio-option2' />
              <Label.Root htmlFor='radio-option2'>Option 2</Label.Root>
            </div>
          </Radio.Group>
        </ComponentShowcase>

        {/* Switch */}
        <ComponentShowcase title='Switch'>
          <div className='flex items-center gap-2'>
            <Switch.Root
              checked={switchChecked}
              onCheckedChange={setSwitchChecked}
            />
            <Label.Root>Toggle switch</Label.Root>
          </div>
        </ComponentShowcase>

        {/* Textarea */}
        <ComponentShowcase title='Textarea'>
          <div className='w-full max-w-xs'>
            <Textarea.Root
              placeholder='Enter multiline text...'
              className='min-h-[100px]'
            />
          </div>
        </ComponentShowcase>

        {/* Slider */}
        <ComponentShowcase title='Slider'>
          <div className='w-full max-w-xs'>
            <Slider.Root
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
            />
            <div className='mt-2 text-paragraph-xs text-text-sub-600'>
              Value: {sliderValue[0]}
            </div>
          </div>
        </ComponentShowcase>
      </div>
    </div>
  );
}
