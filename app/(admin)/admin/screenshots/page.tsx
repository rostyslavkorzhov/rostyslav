'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import { Root as Checkbox } from '@/components/ui/checkbox';

export default function ScreenshotsPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand_id: '',
    page_type: 'home' as 'home' | 'pdp' | 'about',
    page_url: '',
    capture_desktop: true,
    capture_mobile: true,
  });

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/screenshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to capture screenshot');
      }

      const data = await response.json();
      alert(`Screenshot capture started! Render ID: ${data.renderId}`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className='text-title-h1 text-text-strong-950 mb-6'>Capture Screenshot</h1>

      <form onSubmit={handleCapture} className='space-y-4 max-w-2xl'>
        <div>
          <Label htmlFor='brand_id'>Brand ID *</Label>
          <Input
            id='brand_id'
            value={formData.brand_id}
            onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
            required
            placeholder='UUID of the brand'
          />
        </div>

        <div>
          <Label htmlFor='page_type'>Page Type *</Label>
          <Select.Root
            value={formData.page_type}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                page_type: value as 'home' | 'pdp' | 'about',
              })
            }
            required
          >
            <Select.Trigger id='page_type'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='home'>Home</Select.Item>
              <Select.Item value='pdp'>Product Detail Page</Select.Item>
              <Select.Item value='about'>About</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <div>
          <Label htmlFor='page_url'>Page URL *</Label>
          <Input
            id='page_url'
            type='url'
            value={formData.page_url}
            onChange={(e) => setFormData({ ...formData, page_url: e.target.value })}
            required
            placeholder='https://example.com/page'
          />
        </div>

        <div className='flex gap-4'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <Checkbox
              checked={formData.capture_desktop}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, capture_desktop: checked === true })
              }
            />
            <span>Capture Desktop</span>
          </label>
          <label className='flex items-center gap-2 cursor-pointer'>
            <Checkbox
              checked={formData.capture_mobile}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, capture_mobile: checked === true })
              }
            />
            <span>Capture Mobile</span>
          </label>
        </div>

        <Button type='submit' disabled={loading}>
          {loading ? 'Capturing...' : 'Capture Screenshot'}
        </Button>
      </form>
    </div>
  );
}

