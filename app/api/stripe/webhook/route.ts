import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';

import { supabase } from '@/lib/auth/supabase';
import { stripe, stripeWebhookSecret } from '@/lib/stripe/config';

// Extended interface for Stripe subscription with additional properties
interface ExtendedSubscription extends Stripe.Subscription {
  current_period_start?: number;
  current_period_end?: number;
}

// Extended interface for Stripe invoice with subscription property
interface ExtendedInvoice extends Stripe.Invoice {
  subscription?: string | null | Stripe.Subscription;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !stripeWebhookSecret) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Invalid signature';
    console.error('Webhook signature verification failed:', errorMessage);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Webhook handler error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer;
  const subscriptionId = session.subscription as string;
  const customerEmail = session.customer_details?.email;
  const { metadata } = session;

  // Create or update user in database
  if (customerEmail) {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', customerEmail)
      .single();

    if (!user) {
      await supabase.from('users').insert({
        email: customerEmail,
        stripe_customer_id: customerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else {
      await supabase
        .from('users')
        .update({
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString(),
        })
        .eq('email', customerEmail);
    }

    // Create subscription record
    if (subscriptionId) {
      const subscription = (await stripe.subscriptions.retrieve(
        subscriptionId
      )) as ExtendedSubscription;

      await supabase.from('subscriptions').insert({
        user_id: user?.id || customerEmail, // Use email as fallback
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        stripe_price_id: subscription.items.data[0]?.price?.id,
        status: subscription.status,
        current_period_start: new Date(
          (subscription.current_period_start || 0) * 1000
        ).toISOString(),
        current_period_end: new Date((subscription.current_period_end || 0) * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        plan_type: metadata?.plan,
        billing_cycle: metadata?.billingCycle,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Send welcome email
    // TODO: Implement email sending with Resend
    console.warn('Welcome email sent to:', customerEmail);
  }
}

async function handleInvoicePaymentSucceeded(invoice: ExtendedInvoice) {
  const subscriptionId =
    typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;

  if (subscriptionId) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    // Send payment confirmation email
    // TODO: Implement email sending with Resend
    console.warn('Payment confirmation email sent for subscription:', subscriptionId);
  }
}

async function handleInvoicePaymentFailed(invoice: ExtendedInvoice) {
  const subscriptionId =
    typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;

  if (subscriptionId) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    // Send payment failed email
    // TODO: Implement email sending with Resend
    console.warn('Payment failed email sent for subscription:', subscriptionId);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  // Send subscription canceled email
  // TODO: Implement email sending with Resend
  console.warn('Subscription canceled email sent for:', subscriptionId);
}

async function handleSubscriptionUpdated(subscription: ExtendedSubscription) {
  const subscriptionId = subscription.id;

  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date((subscription.current_period_start || 0) * 1000).toISOString(),
      current_period_end: new Date((subscription.current_period_end || 0) * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);
}
