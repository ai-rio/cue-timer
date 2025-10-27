# Chunk 72: pages_app

## Metadata

- **Files**: 7
- **Size**: 29,508 characters (~7,377 tokens)
- **Categories**: pages

## Files in this chunk

- `app/[locale]/test/page.tsx`
- `app/[locale]/theme-demo/page.tsx`
- `app/api/auth/magic-link/route.ts`
- `app/api/stripe/create-payment-intent/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/test-route/layout.tsx`
- `app/test-route/page.tsx`

---

## File: `app/[locale]/test/page.tsx`

```tsx
import TailwindTest from '@/components/TailwindTest';

export default function TestPage() {
  return <TailwindTest />;
}
```

## File: `app/[locale]/theme-demo/page.tsx`

```tsx
'use client';

import {
  AlertCircle,
  Check,
  CheckCircle,
  ChevronRight,
  Heart,
  Info,
  Moon,
  Star,
  Sun,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ThemeDemoPage() {
  const { theme, setTheme } = useTheme();

  const themeColors = [
    {
      name: 'Primary',
      class: 'bg-primary',
      textClass: 'text-primary-foreground',
    },
    {
      name: 'Secondary',
      class: 'bg-secondary',
      textClass: 'text-secondary-foreground',
    },
    { name: 'Accent', class: 'bg-accent', textClass: 'text-accent-foreground' },
    { name: 'Muted', class: 'bg-muted', textClass: 'text-muted-foreground' },
    {
      name: 'Destructive',
      class: 'bg-destructive',
      textClass: 'text-destructive-foreground',
    },
    {
      name: 'Brand Orange',
      class: 'bg-primary',
      textClass: 'text-primary-foreground',
    },
  ];

  const brandColors = [
    {
      name: 'Spotlight Orange',
      class: 'bg-spotlight-orange-500',
      textClass: 'text-white',
    },
    {
      name: 'Timing Yellow',
      class: 'bg-timing-yellow-500',
      textClass: 'text-professional-gray-900',
    },
    { name: 'Success Green', class: 'bg-success-500', textClass: 'text-white' },
    { name: 'Warning Red', class: 'bg-warning-500', textClass: 'text-white' },
    { name: 'Info Blue', class: 'bg-info-500', textClass: 'text-white' },
    {
      name: 'Professional Gray',
      class: 'bg-professional-gray-700',
      textClass: 'text-white',
    },
  ];

  const buttonVariants = [
    'default',
    'destructive',
    'outline',
    'secondary',
    'ghost',
    'link',
  ] as const;

  return (
    <div className='min-h-screen bg-background transition-colors duration-300'>
      <div className='container mx-auto px-4 py-8 space-y-12'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <div className='flex items-center justify-center gap-4 mb-6'>
            <ThemeToggle />
            <h1 className='text-3xl font-bold text-foreground'>
              CueTimer Theme System Demo
            </h1>
          </div>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Comprehensive testing of the light/dark theme system with smooth
            transitions and proper contrast ratios.
          </p>
          <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            <span>Current theme:</span>
            <Badge variant='outline' className='font-mono'>
              {theme || 'system'}
            </Badge>
          </div>
        </div>

        {/* Theme Toggle Section */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground flex items-center gap-2'>
              <Sun className='h-5 w-5' />
              Theme Toggle Controls
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              Test different theme switching methods and transitions
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-wrap gap-4'>
              <Button
                onClick={() => setTheme('light')}
                variant={theme === 'light' ? 'default' : 'outline'}
              >
                <Sun className='h-4 w-4 mr-2' />
                Light Mode
              </Button>
              <Button
                onClick={() => setTheme('dark')}
                variant={theme === 'dark' ? 'default' : 'outline'}
              >
                <Moon className='h-4 w-4 mr-2' />
                Dark Mode
              </Button>
              <Button
                onClick={() => setTheme('system')}
                variant={theme === 'system' ? 'default' : 'outline'}
              >
                System
              </Button>
            </div>
            <div className='p-4 bg-muted rounded-lg'>
              <p className='text-sm text-muted-foreground'>
                <strong>Note:</strong> Theme changes are persisted to
                localStorage and survive page refreshes. Smooth transitions are
                applied to all theme changes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Colors */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              System Theme Colors
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              Semantic color tokens that adapt to light/dark themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
              {themeColors.map((color) => (
                <div key={color.name} className='text-center space-y-2'>
                  <div
                    className={`h-20 rounded-lg ${color.class} flex items-center justify-center transition-colors duration-300`}
                  >
                    <Check className={`h-6 w-6 ${color.textClass}`} />
                  </div>
                  <p className='text-sm font-medium text-foreground'>
                    {color.name}
                  </p>
                  <p className='text-xs text-muted-foreground font-mono'>
                    {color.class}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brand Colors */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              CueTimer Brand Colors
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              Consistent brand colors that work across both themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {brandColors.map((color) => (
                <div key={color.name} className='text-center space-y-2'>
                  <div
                    className={`h-20 rounded-lg ${color.class} flex items-center justify-center transition-colors duration-300`}
                  >
                    <Zap className={`h-6 w-6 ${color.textClass}`} />
                  </div>
                  <p className='text-sm font-medium text-foreground'>
                    {color.name}
                  </p>
                  <p className='text-xs text-muted-foreground font-mono'>
                    {color.class}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              Button Variants
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              All button variants with proper theme support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {buttonVariants.map((variant) => (
                <div key={variant} className='space-y-2'>
                  <p className='text-sm font-medium text-foreground capitalize'>
                    {variant}
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    <Button variant={variant} size='sm'>
                      Small
                    </Button>
                    <Button variant={variant} size='default'>
                      Default
                    </Button>
                    <Button variant={variant} size='lg'>
                      Large
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              Typography & Text Colors
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              Text hierarchy with proper contrast in both themes
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-4'>
              <h1 className='text-4xl font-bold text-foreground'>
                Heading 1 - Primary Text
              </h1>
              <h2 className='text-3xl font-semibold text-foreground'>
                Heading 2 - Primary Text
              </h2>
              <h3 className='text-2xl font-medium text-foreground'>
                Heading 3 - Primary Text
              </h3>
              <p className='text-lg text-muted-foreground'>
                Large paragraph text in muted color
              </p>
              <p className='text-base text-foreground'>
                Regular paragraph text in foreground color
              </p>
              <p className='text-sm text-muted-foreground'>
                Small text in muted color
              </p>
              <p className='text-xs text-muted-foreground'>
                Extra small text in muted color
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg'>
              <div>
                <h4 className='font-semibold text-foreground mb-2'>
                  Text States
                </h4>
                <p className='text-primary mb-1'>Primary text color</p>
                <p className='text-secondary mb-1'>Secondary text color</p>
                <p className='text-muted-foreground mb-1'>Muted text color</p>
                <p className='text-destructive mb-1'>Destructive text color</p>
              </div>
              <div>
                <h4 className='font-semibold text-foreground mb-2'>
                  Special Typography
                </h4>
                <p className='font-timer text-2xl'>Timer Font Display</p>
                <p className='font-mono text-sm'>Monospace code text</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              Interactive Elements
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              Test hover, focus, and active states across themes
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex flex-wrap gap-4'>
              <Button>
                <CheckCircle className='h-4 w-4 mr-2' />
                Success Button
              </Button>
              <Button variant='outline'>
                <Info className='h-4 w-4 mr-2' />
                Info Button
              </Button>
              <Button variant='destructive'>
                <X className='h-4 w-4 mr-2' />
                Cancel Button
              </Button>
              <Button variant='secondary'>
                <Heart className='h-4 w-4 mr-2' />
                Like Button
              </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <Badge variant='default' className='w-fit'>
                <Star className='h-3 w-3 mr-1' />
                Default Badge
              </Badge>
              <Badge variant='secondary' className='w-fit'>
                <ChevronRight className='h-3 w-3 mr-1' />
                Secondary Badge
              </Badge>
              <Badge variant='outline' className='w-fit'>
                <AlertCircle className='h-3 w-3 mr-1' />
                Outline Badge
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cards & Surfaces */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              Cards & Surfaces
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              Different surface levels with proper shadows and borders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <Card className='hover:shadow-lg transition-all duration-300 hover:scale-105'>
                <CardHeader>
                  <CardTitle className='text-card-foreground flex items-center gap-2'>
                    <Zap className='h-5 w-5 text-primary' />
                    Interactive Card
                  </CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    Hover over this card to see interactive effects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    This card demonstrates hover states and transitions in both
                    themes.
                  </p>
                </CardContent>
              </Card>

              <Card className='border-primary/20 bg-primary/5'>
                <CardHeader>
                  <CardTitle className='text-card-foreground'>
                    Primary Accent Card
                  </CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    Card with primary color accents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Uses primary color for border and subtle background.
                  </p>
                </CardContent>
              </Card>

              <Card className='bg-muted'>
                <CardHeader>
                  <CardTitle className='text-card-foreground'>
                    Muted Background Card
                  </CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    Card with muted background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Uses muted background for subtle differentiation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              Navigation Elements
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              Navigation components with proper theme support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <nav className='border-b border-border pb-4 mb-4'>
              <div className='flex space-x-6'>
                <Link
                  href='#'
                  className='text-primary hover:text-primary/80 transition-colors'
                >
                  Home
                </Link>
                <Link
                  href='#'
                  className='text-foreground hover:text-primary transition-colors'
                >
                  About
                </Link>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Features
                </Link>
                <Link
                  href='#'
                  className='text-foreground hover:text-primary transition-colors'
                >
                  Pricing
                </Link>
              </div>
            </nav>
            <div className='flex items-center justify-between p-4 bg-muted rounded-lg'>
              <span className='text-sm text-muted-foreground'>
                Navigation test area
              </span>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Theme Information */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              Theme System Information
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              Technical details about the implemented theme system
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h4 className='font-semibold text-foreground mb-2'>
                  Features Implemented
                </h4>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Smooth theme transitions (300ms)
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    System preference detection
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    localStorage persistence
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    SSR/hydration safe
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Accessible theme toggle
                  </li>
                </ul>
              </div>
              <div>
                <h4 className='font-semibold text-foreground mb-2'>
                  Brand Consistency
                </h4>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    CueTimer brand colors
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Proper contrast ratios
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Consistent visual hierarchy
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Responsive design support
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Interactive hover states
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className='text-center py-8 border-t border-border'>
          <p className='text-muted-foreground'>
            Theme system demo • Current theme:{' '}
            <span className='font-mono text-primary'>{theme || 'system'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
```

## File: `app/api/auth/magic-link/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/auth/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, locale = 'en' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${locale}/auth/callback`,
      },
    });

    if (error) {
      console.error('Magic link error:', error);
      return NextResponse.json(
        { error: 'Failed to send magic link. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Magic link sent successfully',
    });
  } catch (error) {
    console.error('Magic link route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## File: `app/api/stripe/create-payment-intent/route.ts`

```typescript
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
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const priceId =
      PLANS[plan as keyof typeof PLANS][billingCycle as keyof typeof PLANS.pro];

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
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
```

## File: `app/api/stripe/webhook/route.ts`

```typescript
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
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Invalid signature';
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
    const errorMessage =
      error instanceof Error ? error.message : 'Webhook handler error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
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
        current_period_end: new Date(
          (subscription.current_period_end || 0) * 1000
        ).toISOString(),
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
    typeof invoice.subscription === 'string'
      ? invoice.subscription
      : invoice.subscription?.id;

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
    console.warn(
      'Payment confirmation email sent for subscription:',
      subscriptionId
    );
  }
}

async function handleInvoicePaymentFailed(invoice: ExtendedInvoice) {
  const subscriptionId =
    typeof invoice.subscription === 'string'
      ? invoice.subscription
      : invoice.subscription?.id;

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
      current_period_start: new Date(
        (subscription.current_period_start || 0) * 1000
      ).toISOString(),
      current_period_end: new Date(
        (subscription.current_period_end || 0) * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);
}
```

## File: `app/test-route/layout.tsx`

```tsx
export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
```

## File: `app/test-route/page.tsx`

```tsx
export default function TestPage() {
  return (
    <div className='min-h-screen bg-white flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Test Page</h1>
        <p className='text-xl text-gray-600'>
          This is a minimal test page to verify Next.js is working.
        </p>
      </div>
    </div>
  );
}
```
