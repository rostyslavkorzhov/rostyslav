import type { PricingPlan } from '@/types/pricing';

export const pricingPlans: PricingPlan[] = [
  {
    id: '1',
    title: {
      en: 'Plan 1',
      ar: 'Plan 1',
    },
    isDefault: false,
    products: {
      hardPOS: {
        setupFee: {
          amount: 99,
          frequency: 'OneTime',
        },
        subscriptionFee: {
          amount: 130,
          frequency: 'Monthly',
          isDisabled: true, // Note: The CSV shows IsDisabled=True for some subscription rows
        },
        transactionFees: [
          {
            scheme: 'Mada',
            percent: 0.6,
            fixedAmount: 0,
            cap: 160,
            threshold: {
              amount: 0.12,
              feeBelowThreshold: 0.008,
            },
          },
          {
            scheme: 'CC',
            percent: 2.25,
            fixedAmount: 1, // ConstantFees field
            cap: 0,
            threshold: {
              amount: 250,
              feeBelowThreshold: 0,
            },
          },
          {
            scheme: 'GCC',
            percent: 2.0,
            fixedAmount: 0,
            cap: 37.5,
          },
        ],
      },
      softPOS: {
        setupFee: {
          amount: 0,
          frequency: 'OneTime',
        },
        subscriptionFee: {
          amount: 52,
          frequency: 'Monthly',
        },
        transactionFees: [
          {
            scheme: 'Mada',
            percent: 0.6,
            fixedAmount: 0,
            cap: 160,
          },
          {
            scheme: 'CC',
            percent: 2.25,
            fixedAmount: 1,
            cap: 0,
          },
        ],
      },
    },
  },
  {
    id: '2',
    title: {
      en: 'Plan 2',
      ar: 'Plan 2',
    },
    isDefault: true,
    products: {
      hardPOS: {
        setupFee: {
          amount: 149,
          frequency: 'OneTime',
        },
        subscriptionFee: {
          amount: 180,
          frequency: 'Monthly',
        },
        transactionFees: [
          {
            scheme: 'Mada',
            percent: 0.5,
            fixedAmount: 0,
            cap: 150,
            threshold: {
              amount: 0.12,
              feeBelowThreshold: 0.008,
            },
          },
          {
            scheme: 'CC',
            percent: 2.0,
            fixedAmount: 0.5,
            cap: 0,
            threshold: {
              amount: 300,
              feeBelowThreshold: 0,
            },
          },
          {
            scheme: 'GCC',
            percent: 1.8,
            fixedAmount: 0,
            cap: 35,
          },
        ],
      },
      softPOS: {
        setupFee: {
          amount: 0,
          frequency: 'OneTime',
        },
        subscriptionFee: {
          amount: 65,
          frequency: 'Monthly',
        },
        transactionFees: [
          {
            scheme: 'Mada',
            percent: 0.5,
            fixedAmount: 0,
            cap: 150,
          },
          {
            scheme: 'CC',
            percent: 2.0,
            fixedAmount: 0.5,
            cap: 0,
          },
          {
            scheme: 'GCC',
            percent: 1.8,
            fixedAmount: 0,
            cap: 35,
          },
        ],
      },
    },
  },
];

