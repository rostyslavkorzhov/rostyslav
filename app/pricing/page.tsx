'use client';

import { PricingCard } from '@/components/pricing/pricing-card';
import { pricingPlans } from '@/data/pricing-plans';

export default function PricingPage() {
  return (
    <div className='container mx-auto flex-1 px-5 py-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Page Header */}
        <div className='mb-12 text-center'>
          <h1 className='text-title-h1 text-text-strong-950 mb-4'>Pricing Plans</h1>
          <p className='text-paragraph-lg text-text-sub-600 max-w-2xl mx-auto'>
            Choose the plan that fits your business needs. All plans include setup
            and monthly subscription options for both HardPOS and SoftPOS solutions.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'>
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}

