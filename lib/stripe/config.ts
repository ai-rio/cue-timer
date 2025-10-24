import { Stripe } from 'stripe';

// Get Stripe credentials from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Validate required environment variables
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

// Initialize Stripe with the latest API version
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

// Export webhook secret for verification
export { stripeWebhookSecret };

// Stripe product configuration for CueTimer pricing tiers
export const STRIPE_PRODUCTS = {
  FREE: {
    name: 'CueTimer Free',
    description: 'Perfect for trying out CueTimer',
    price: 0,
    currency: 'usd',
    interval: 'month' as const,
    features: ['3 timers maximum', '2 devices', 'Basic timer functionality', 'Community support'],
    limitations: {
      maxTimers: 3,
      maxDevices: 2,
      messagingEnabled: false,
      customBranding: false,
      prioritySupport: false,
    },
  },
  PRO: {
    name: 'CueTimer Pro',
    description: 'Professional event management',
    price: 1200, // $12.00 in cents
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Unlimited timers',
      'Unlimited devices',
      'Presenter messaging',
      'Custom branding',
      'Priority support',
      'Advanced analytics',
      'Export capabilities',
    ],
    limitations: {
      maxTimers: 'unlimited',
      maxDevices: 'unlimited',
      messagingEnabled: true,
      customBranding: true,
      prioritySupport: true,
    },
  },
  TEAMS: {
    name: 'CueTimer Teams',
    description: 'For organizations and venues',
    price: 4900, // $49.00 in cents
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Everything in Pro',
      '5 team members',
      'Team collaboration',
      'Organization management',
      'Advanced analytics dashboard',
      'API access',
      'Dedicated support',
    ],
    limitations: {
      maxTimers: 'unlimited',
      maxDevices: 'unlimited',
      messagingEnabled: true,
      customBranding: true,
      prioritySupport: true,
      teamMembers: 5,
      analyticsDashboard: true,
    },
  },
} as const;

// Price IDs (these would be created in Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  FREE: 'price_cuetimer_free_monthly',
  PRO_MONTHLY: 'price_cuetimer_pro_monthly',
  PRO_YEARLY: 'price_cuetimer_pro_yearly',
  TEAMS_MONTHLY: 'price_cuetimer_teams_monthly',
  TEAMS_YEARLY: 'price_cuetimer_teams_yearly',
} as const;

// Helper function to create a checkout session
export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  priceId: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_creation: customerId ? undefined : 'always',
      metadata: {
        ...metadata,
        source: 'cuetimer_website',
      },
      subscription_data: {
        metadata: {
          ...metadata,
          source: 'cuetimer_website',
        },
      },
    });

    return { success: true, session };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to create a customer portal session
export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { success: true, url: session.url };
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to retrieve subscription details
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['customer', 'items.data.price.product'],
    });

    return { success: true, subscription };
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to cancel subscription
export async function cancelSubscription(subscriptionId: string, immediate = false) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: !immediate,
      ...(immediate && { canceled_at: 'now' }),
    });

    return { success: true, subscription };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to update subscription
export async function updateSubscription(subscriptionId: string, priceId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0]?.id,
          price: priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });

    return { success: true, subscription: updatedSubscription };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default stripe;
