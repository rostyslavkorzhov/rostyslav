'use client';

import { useState, useMemo } from 'react';
import * as Accordion from '@/components/ui/accordion';
import * as Input from '@/components/ui/input';
import * as TabMenu from '@/components/ui/tab-menu-horizontal';
import { RiSearchLine } from '@remixicon/react';
import faqData from '../faq-data';

type FAQItem = {
  TITLE: string;
  HEADER?: string;
  CONTENT?: string[];
  FOOTER?: string;
};

type FAQCategory = {
  [key: string]: FAQItem[];
};

type FAQData = {
  TITLE: string;
  SEARCH_PLACEHOLDER: string;
  NO_RESULTS: string;
  TABS: {
    ABOUT_HALA: string;
    IBAN_ACCOUNT: string;
    USER_ACCOUNT: string;
    HALA_PAYMENTS: string;
  };
  FAQS: {
    [key: string]: FAQItem[] | FAQCategory;
  };
};

// Flatten nested FAQ structure (for FAQ "4" which has categories)
function flattenFAQs(faqs: FAQItem[] | FAQCategory): FAQItem[] {
  if (Array.isArray(faqs)) {
    return faqs;
  }
  // If it's an object with categories, flatten all categories
  return Object.values(faqs).flat();
}

// Check if FAQs have nested categories
function hasNestedCategories(faqs: FAQItem[] | FAQCategory): faqs is FAQCategory {
  return !Array.isArray(faqs);
}

// Get category names for nested structure
function getCategoryNames(faqs: FAQItem[] | FAQCategory): string[] {
  if (Array.isArray(faqs)) {
    return [];
  }
  return Object.keys(faqs);
}

// Search function
function searchFAQs(faqs: FAQItem[], query: string): FAQItem[] {
  if (!query.trim()) {
    return faqs;
  }
  const lowerQuery = query.toLowerCase();
  return faqs.filter(
    (faq) =>
      faq.TITLE.toLowerCase().includes(lowerQuery) ||
      faq.HEADER?.toLowerCase().includes(lowerQuery) ||
      faq.FOOTER?.toLowerCase().includes(lowerQuery) ||
      faq.CONTENT?.some((item) => item.toLowerCase().includes(lowerQuery))
  );
}

export default function FAQPage() {
  const data = faqData as FAQData;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('1');

  // Get FAQs for current tab
  const currentFAQsData = useMemo(() => {
    return data.FAQS[activeTab];
  }, [activeTab, data.FAQS]);

  const hasCategories = useMemo(() => {
    return currentFAQsData ? hasNestedCategories(currentFAQsData) : false;
  }, [currentFAQsData]);

  const categoryNames = useMemo(() => {
    return currentFAQsData ? getCategoryNames(currentFAQsData) : [];
  }, [currentFAQsData]);

  const currentFAQs = useMemo(() => {
    if (!currentFAQsData) return [];
    const flattened = flattenFAQs(currentFAQsData);
    return searchFAQs(flattened, searchQuery);
  }, [currentFAQsData, searchQuery]);

  // Tab configuration
  const tabs = [
    { value: '1', label: data.TABS.ABOUT_HALA },
    { value: '2', label: data.TABS.IBAN_ACCOUNT },
    { value: '3', label: data.TABS.USER_ACCOUNT },
    { value: '4', label: data.TABS.HALA_PAYMENTS },
  ];

  return (
    <div className='container mx-auto flex-1 px-5 py-8'>
      <div className='mx-auto max-w-4xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-title-h1 text-text-strong-950 mb-4'>
              {data.TITLE}
            </h1>
          
          {/* Search Input */}
          <Input.Root size='medium'>
            <Input.Wrapper>
              <Input.Icon as={RiSearchLine} />
              <Input.Input
                type='text'
                placeholder={data.SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        {/* Tabs */}
        <TabMenu.Root value={activeTab} onValueChange={setActiveTab}>
          <TabMenu.List>
            {tabs.map((tab) => (
              <TabMenu.Trigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabMenu.Trigger>
            ))}
          </TabMenu.List>

          {/* FAQ Content */}
          <div className='mt-8'>
            {currentFAQs.length === 0 ? (
              <div className='rounded-10 bg-bg-weak-50 p-8 text-center'>
                <p className='text-paragraph-md text-text-sub-600'>
                  {data.NO_RESULTS}
                </p>
              </div>
            ) : hasCategories && !searchQuery ? (
              // Show nested categories when not searching
              <div className='space-y-8'>
                {categoryNames.map((categoryName) => {
                  const categoryFAQs = (currentFAQsData as FAQCategory)[categoryName];
                  const filtered = searchFAQs(categoryFAQs, searchQuery);
                  if (filtered.length === 0) return null;
                  
                  return (
                    <div key={categoryName}>
                      <h2 className='text-title-h2 text-text-strong-950 mb-4'>
                        {categoryName.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
                      </h2>
                      <Accordion.Root type='single' collapsible className='space-y-3'>
                        {filtered.map((faq, index) => (
                          <Accordion.Item
                            key={`${categoryName}-${index}`}
                            value={`faq-${categoryName}-${index}`}
                          >
                            <Accordion.Header>
                              <Accordion.Trigger>
                                <Accordion.Arrow />
                                <span className='font-semibold'>{faq.TITLE}</span>
                              </Accordion.Trigger>
                            </Accordion.Header>
                            <Accordion.Content>
                              <FAQContent faq={faq} />
                            </Accordion.Content>
                          </Accordion.Item>
                        ))}
                      </Accordion.Root>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Show flat list (for search results or non-nested tabs)
              <Accordion.Root type='single' collapsible className='space-y-3'>
                {currentFAQs.map((faq, index) => (
                  <Accordion.Item
                    key={`${activeTab}-${index}`}
                    value={`faq-${activeTab}-${index}`}
                  >
                    <Accordion.Header>
                      <Accordion.Trigger>
                        <Accordion.Arrow />
                        <span className='font-semibold'>{faq.TITLE}</span>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content>
                      <FAQContent faq={faq} />
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            )}
          </div>
        </TabMenu.Root>
      </div>
    </div>
  );
}

// Component to render FAQ content with HTML support
function FAQContent({ faq }: { faq: FAQItem }) {
  return (
    <div className='space-y-3'>
      {faq.HEADER && (
        <div
          className='text-paragraph-sm text-text-sub-600'
          dangerouslySetInnerHTML={{ __html: faq.HEADER }}
        />
      )}
      {faq.CONTENT && faq.CONTENT.length > 0 && (
        <div className='space-y-2'>
          {faq.CONTENT.map((item, idx) => (
            <div
              key={idx}
              className='text-paragraph-sm text-text-sub-600'
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </div>
      )}
      {faq.FOOTER && (
        <div
          className='text-paragraph-sm text-text-sub-600 font-medium'
          dangerouslySetInnerHTML={{ __html: faq.FOOTER }}
        />
      )}
    </div>
  );
}

