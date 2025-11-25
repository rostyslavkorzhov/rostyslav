'use client';

import { useState } from 'react';
import {
  Root as InputRoot,
  Wrapper as InputWrapper,
  Input,
} from '@/components/ui/input';
import {
  Root as ButtonRoot,
} from '@/components/ui/button';
import {
  Root as SelectRoot,
  Trigger,
  Value,
  Content,
  Item,
} from '@/components/ui/select';
import { Root as LabelRoot } from '@/components/ui/label';
import { saveScreenshot } from '@/utils/storage';
import { useNotification } from '@/hooks/use-notification';

const PAGE_TYPES = [
  'Homepage',
  'Product',
  'Category',
  'About',
  'Contact',
  'Other',
] as const;

export default function ScreenshotForm() {
  const [url, setUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [pageType, setPageType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notification } = useNotification();

  const validateForm = (): boolean => {
    if (!url.trim()) {
      setError('URL is required');
      return false;
    }

    try {
      new URL(url.trim());
    } catch {
      setError('Please enter a valid URL');
      return false;
    }

    if (!brandName.trim()) {
      setError('Brand Name is required');
      return false;
    }

    if (!pageType) {
      setError('Page Type is required');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call our API route
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          brandName: brandName.trim(),
          pageType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to capture screenshot');
      }

      if (!data.success || !data.imageData) {
        throw new Error('Invalid response from server');
      }

      // Save to localStorage
      saveScreenshot({
        url: url.trim(),
        brandName: brandName.trim(),
        pageType,
        imageData: data.imageData,
      });

      // Show success notification
      notification({
        title: 'Screenshot captured!',
        description: `Screenshot saved for ${brandName.trim()}`,
        status: 'success',
      });

      // Reset form
      setUrl('');
      setBrandName('');
      setPageType('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      notification({
        title: 'Error',
        description: errorMessage,
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* URL Input */}
        <div className="space-y-2">
          <LabelRoot htmlFor="url">
            URL <span className="text-error-base">*</span>
          </LabelRoot>
          <InputRoot>
            <InputWrapper>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                hasError={error?.toLowerCase().includes('url') || false}
                required
              />
            </InputWrapper>
          </InputRoot>
        </div>

        {/* Brand Name Input */}
        <div className="space-y-2">
          <LabelRoot htmlFor="brandName">
            Brand Name <span className="text-error-base">*</span>
          </LabelRoot>
          <InputRoot>
            <InputWrapper>
              <Input
                id="brandName"
                type="text"
                placeholder="Enter brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                disabled={isLoading}
                hasError={error?.toLowerCase().includes('brand') || false}
                required
              />
            </InputWrapper>
          </InputRoot>
        </div>

        {/* Page Type Select */}
        <div className="space-y-2">
          <LabelRoot htmlFor="pageType">
            Page Type <span className="text-error-base">*</span>
          </LabelRoot>
          <SelectRoot
            value={pageType}
            onValueChange={setPageType}
            disabled={isLoading}
          >
            <Trigger id="pageType" aria-label="Select page type">
              <Value placeholder="Select a page type" />
            </Trigger>
            <Content>
              {PAGE_TYPES.map((type) => (
                <Item key={type} value={type}>
                  {type}
                </Item>
              ))}
            </Content>
          </SelectRoot>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-alpha-10 p-3 text-paragraph-sm text-error-base">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <ButtonRoot
        type="submit"
        variant="primary"
        mode="filled"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Capturing Screenshot...' : 'Submit'}
      </ButtonRoot>
    </form>
  );
}

