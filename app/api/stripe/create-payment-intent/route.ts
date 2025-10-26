import { NextRequest, NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe/config';

const PLANS = {
  pro: {
    monthly: 'price_cuetimer_pro_monthly',
    yearly: 'price_cuetimer_pro_yearly',
  },
  teams: {
    monthly: 'price_cuetimer_teams_monthly',
    yearly: 'price_cuetimer_teams_yearly',
  },
} as const;

export async function POST(request: NextRequest) {
  try {
    const { plan, billingCycle = 'monthly' } = await request.json();

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const priceId = PLANS[plan as keyof typeof PLANS][billingCycle as keyof typeof PLANS.pro];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid billing cycle for selected plan' },
        { status: 400 }
      );
    }

    // Create payment intent with subscription mode
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout/cancel`,
      customer_creation: 'always',
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      metadata: {
        plan,
        billingCycle,
      },
      subscription_data: {
        metadata: {
          plan,
          billingCycle,
        },
        trial_period_days: 14, // 14-day free trial
      },
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
    });
  } catch (error: unknown) {
    console.error('Error creating payment intent:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
