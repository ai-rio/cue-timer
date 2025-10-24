import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Stripe } from 'stripe';

import { stripe, stripeWebhookSecret } from './config';

// Webhook event types we handle
const _WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'invoice.paid',
  'invoice.payment_failed',
  'invoice.upcoming',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.trial_will_end',
] as const;

// Webhook event handlers
const webhookHandlers = {
  'checkout.session.completed': async (event: Stripe.Event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Checkout session completed:', session.id);

    // Handle successful checkout
    if (session.mode === 'subscription') {
      // Create or update user subscription
      await handleNewSubscription(session);
    }

    // Send confirmation email
    await sendOrderConfirmationEmail(session);
  },

  'checkout.session.async_payment_succeeded': async (event: Stripe.Event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Async payment succeeded:', session.id);

    // Handle successful async payment
    if (session.mode === 'subscription') {
      await handleNewSubscription(session);
    }

    await sendOrderConfirmationEmail(session);
  },

  'checkout.session.async_payment_failed': async (event: Stripe.Event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Async payment failed:', session.id);

    // Handle failed payment
    await sendPaymentFailedEmail(session);
  },

  'invoice.paid': async (event: Stripe.Event) => {
    const invoice = event.data.object as Stripe.Invoice;
    console.log('Invoice paid:', invoice.id);

    // Handle successful invoice payment
    await handleSuccessfulPayment(invoice);
  },

  'invoice.payment_failed': async (event: Stripe.Event) => {
    const invoice = event.data.object as Stripe.Invoice;
    console.log('Invoice payment failed:', invoice.id);

    // Handle failed invoice payment
    await handleFailedPayment(invoice);
  },

  'invoice.upcoming': async (event: Stripe.Event) => {
    const invoice = event.data.object as Stripe.Invoice;
    console.log('Invoice upcoming:', invoice.id);

    // Send upcoming payment reminder
    await sendUpcomingPaymentEmail(invoice);
  },

  'customer.subscription.created': async (event: Stripe.Event) => {
    const subscription = event.data.object as Stripe.Subscription;
    console.log('Subscription created:', subscription.id);

    // Handle new subscription
    await handleSubscriptionCreated(subscription);
  },

  'customer.subscription.updated': async (event: Stripe.Event) => {
    const subscription = event.data.object as Stripe.Subscription;
    console.log('Subscription updated:', subscription.id);

    // Handle subscription update
    await handleSubscriptionUpdated(subscription);
  },

  'customer.subscription.deleted': async (event: Stripe.Event) => {
    const subscription = event.data.object as Stripe.Subscription;
    console.log('Subscription deleted:', subscription.id);

    // Handle subscription cancellation
    await handleSubscriptionDeleted(subscription);
  },

  'customer.subscription.trial_will_end': async (event: Stripe.Event) => {
    const subscription = event.data.object as Stripe.Subscription;
    console.log('Trial ending:', subscription.id);

    // Send trial ending reminder
    await sendTrialEndingEmail(subscription);
  },
};

// Helper functions for handling webhook events
async function handleNewSubscription(session: Stripe.Checkout.Session) {
  // This would typically update your database
  // Example: Create user record, subscription record, etc.
  console.log('Processing new subscription for customer:', session.customer);

  // TODO: Implement database operations
  // - Create/update user in Supabase
  // - Store subscription details
  // - Set up user permissions based on plan
}

async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  console.log('Processing successful payment for invoice:', invoice.id);

  // TODO: Implement database operations
  // - Update subscription status
  // - Extend access period
  // - Send receipt
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  console.log('Processing failed payment for invoice:', invoice.id);

  // TODO: Implement database operations
  // - Update payment status
  // - Send payment failure notification
  // - Handle dunning process
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing new subscription:', subscription.id);

  // TODO: Implement database operations
  // - Create subscription record
  // - Set up user permissions
  // - Send welcome email
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription update:', subscription.id);

  // TODO: Implement database operations
  // - Update subscription record
  // - Adjust user permissions
  // - Handle plan changes
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deletion:', subscription.id);

  // TODO: Implement database operations
  // - Mark subscription as cancelled
  // - Revoke premium permissions
  // - Send cancellation confirmation
}

// Email notification functions (placeholder implementations)
async function sendOrderConfirmationEmail(session: Stripe.Checkout.Session) {
  console.log('Sending order confirmation for session:', session.id);
  // TODO: Implement email sending with Resend
}

async function sendPaymentFailedEmail(session: Stripe.Checkout.Session) {
  console.log('Sending payment failure notification for session:', session.id);
  // TODO: Implement email sending with Resend
}

async function sendUpcomingPaymentEmail(invoice: Stripe.Invoice) {
  console.log('Sending upcoming payment reminder for invoice:', invoice.id);
  // TODO: Implement email sending with Resend
}

async function sendTrialEndingEmail(subscription: Stripe.Subscription) {
  console.log('Sending trial ending reminder for subscription:', subscription.id);
  // TODO: Implement email sending with Resend
}

// Main webhook handler function
export async function handleStripeWebhook(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    if (!stripeWebhookSecret) {
      console.error('Stripe webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Log the event for debugging
    console.log(`Processing webhook event: ${event.type}`);

    // Get the appropriate handler for this event type
    const handler = webhookHandlers[event.type as keyof typeof webhookHandlers];

    if (handler) {
      try {
        await handler(event);
        console.log(`Successfully handled ${event.type}`);
      } catch (error) {
        console.error(`Error handling ${event.type}:`, error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
      }
    } else {
      console.log(`No handler for event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export default handleStripeWebhook;
