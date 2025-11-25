export interface PricingPlan {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  isDefault: boolean;
  products: {
    hardPOS?: ProductPricing; // Optional because some plans might not have both
    softPOS?: ProductPricing;
  };
}

export interface ProductPricing {
  setupFee: FixedFee;
  subscriptionFee: FixedFee;
  transactionFees: TransactionFee[];
}

export interface FixedFee {
  amount: number;
  frequency: 'OneTime' | 'Monthly' | 'Yearly';
  isDisabled?: boolean; // From 'IsDisabled' column
}

export interface TransactionFee {
  scheme: 'Mada' | 'CC' | 'GCC';
  percent: number; // From 'Amount' where FeeType is Percent
  fixedAmount: number; // From 'ConstantFees'
  cap: number; // From 'Cap'
  threshold?: {
    amount: number; // From 'ThresholdAmount'
    feeBelowThreshold: number; // From 'ConstantFeesLessThanThreshold'
    percentBelowThreshold?: number; // From 'PercentageFeesLessThanThreshold'
  };
}

