export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  user: User | null;
  expires: string | null;
}

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkResponse {
  success: boolean;
  message: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  timezone?: string;
  language?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  name?: string;
  timezone?: string;
  language?: string;
}

export interface DeleteAccountRequest {
  confirmation: string;
  reason?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  stripe_price_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan_type?: string;
  billing_cycle?: string;
  created_at: string;
  updated_at?: string;
}
