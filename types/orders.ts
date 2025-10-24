import { StripePrice, Subscription } from './stripe';

export interface Order {
  id: string;
  user_id: string;
  stripe_checkout_session_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  metadata?: Record<string, string>;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'canceled'
  | 'refunded'
  | 'partially_refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price_id: string;
  price: StripePrice;
  quantity: number;
  created_at: string;
}

export interface CreateOrderRequest {
  price_id: string;
  quantity?: number;
  metadata?: Record<string, string>;
  success_url?: string;
  cancel_url?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order?: Order;
  checkout_url?: string;
  error?: string;
}

export interface OrderWithSubscription extends Order {
  subscription?: Subscription;
}

export interface RefundRequest {
  order_id: string;
  reason?: string;
  amount?: number;
}

export interface RefundResponse {
  success: boolean;
  refund_id?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  conversion_rate: number;
  orders_by_status: Record<OrderStatus, number>;
  monthly_revenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}
