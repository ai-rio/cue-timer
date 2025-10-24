export interface StripePrice {
  id: string;
  nickname: string | null;
  currency: string;
  unit_amount: number | null;
  recurring: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
  } | null;
  product: {
    id: string;
    name: string;
    description: string | null;
    images: string[];
  };
}

export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  default_price: StripePrice | null;
  prices: StripePrice[];
  metadata: Record<string, string>;
}

export interface CheckoutSession {
  id: string;
  customer_email?: string;
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  amount_total: number;
  currency: string;
  customer: string;
  subscription?: string;
  metadata: Record<string, string>;
  success_url: string;
  cancel_url: string;
}

export interface Subscription {
  id: string;
  customer: string;
  status:
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'trialing'
    | 'unpaid';
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: {
    data: Array<{
      id: string;
      price: StripePrice;
      quantity: number | null;
    }>;
  };
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

export interface Invoice {
  id: string;
  customer: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  amount_due: number;
  amount_paid: number;
  currency: string;
  created: number;
  due_date?: number;
  hosted_invoice_url?: string;
  invoice_pdf?: string;
  metadata?: Record<string, string>;
}
