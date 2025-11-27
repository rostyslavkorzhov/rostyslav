'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import { BRAND_CATEGORIES, COUNTRIES } from '@/types/brand';

export default function NewBrandPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    country: 'Global',
    website_url: '',
    logo_url: '',
    tier: 'A' as const,
    is_published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create brand');
      }

      router.push('/admin/brands');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className='text-title-h1 text-text-strong-950 mb-6'>Create Brand</h1>

      <form onSubmit={handleSubmit} className='space-y-4 max-w-2xl'>
        <div>
          <Label htmlFor='name'>Name *</Label>
          <Input
            id='name'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor='slug'>Slug *</Label>
          <Input
            id='slug'
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            pattern='[a-z0-9-]+'
          />
          <p className='text-sm text-text-sub-600 mt-1'>
            URL-friendly identifier (lowercase, numbers, hyphens only)
          </p>
        </div>

        <div>
          <Label htmlFor='category'>Category *</Label>
          <Select.Root
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            required
          >
            <Select.Trigger id='category'>
              <Select.Value placeholder='Select category' />
            </Select.Trigger>
            <Select.Content>
              {BRAND_CATEGORIES.map((cat) => (
                <Select.Item key={cat} value={cat}>
                  {cat}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <div>
          <Label htmlFor='country'>Country</Label>
          <Select.Root
            value={formData.country}
            onValueChange={(value) => setFormData({ ...formData, country: value })}
          >
            <Select.Trigger id='country'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {COUNTRIES.map((country) => (
                <Select.Item key={country} value={country}>
                  {country}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <div>
          <Label htmlFor='website_url'>Website URL *</Label>
          <Input
            id='website_url'
            type='url'
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor='logo_url'>Logo URL</Label>
          <Input
            id='logo_url'
            type='url'
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
          />
        </div>

        <div className='flex gap-4'>
          <Button type='submit' disabled={loading}>
            {loading ? 'Creating...' : 'Create Brand'}
          </Button>
          <Button
            type='button'
            variant='neutral'
            mode='stroke'
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

