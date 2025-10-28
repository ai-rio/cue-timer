# Chunk 69: pages_app

## Metadata

- **Files**: 3
- **Size**: 25,276 characters (~6,319 tokens)
- **Categories**: pages

## Files in this chunk

- `app/[locale]/account/dashboard/page.tsx`
- `app/[locale]/checkout/page.tsx`
- `app/[locale]/checkout/cancel/page.tsx`

---

## File: `app/[locale]/account/dashboard/page.tsx`

```tsx
'use client';

import {
  Clock,
  CreditCard,
  ExternalLink,
  LogOut,
  Settings,
  Shield,
  Timer,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/auth/supabase';
import { Subscription, User } from '@/types/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await supabase.auth.getUser();
      if (currentUser.data.user) {
        setUser({
          id: currentUser.data.user.id,
          email: currentUser.data.user.email!,
          name: currentUser.data.user.user_metadata?.name,
          avatar_url: currentUser.data.user.user_metadata?.avatar_url,
          created_at: currentUser.data.user.created_at,
          updated_at: currentUser.data.user.updated_at || '',
        });

        // Load subscription data
        // TODO: Implement subscription loading from Supabase
        // const { data: subscriptionData } = await supabase
        //   .from('subscriptions')
        //   .select('*')
        //   .eq('user_id', currentUser.data.user.id)
        //   .single();
        // setSubscription(subscriptionData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange'></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <Card className='w-96'>
          <CardHeader className='text-center'>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className='w-full bg-brand-orange hover:bg-brand-600'
            >
              <Link href='/login'>Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userInitials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user.email?.[0]?.toUpperCase() || 'U';

  const isProUser = subscription?.status === 'active';

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <Link href='/' className='flex items-center'>
              <div className='w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center mr-2'>
                <Timer className='h-4 w-4 text-white' />
              </div>
              <span className='font-bold text-xl'>CueTimer</span>
            </Link>

            <div className='flex items-center gap-4'>
              <Button variant='ghost' size='sm'>
                <ExternalLink className='h-4 w-4 mr-2' />
                Open Timer
              </Button>
              <Button variant='outline' size='sm' onClick={handleSignOut}>
                <LogOut className='h-4 w-4 mr-2' />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <div className='flex items-center gap-4 mb-4'>
            <Avatar className='h-12 w-12'>
              <AvatarFallback className='bg-brand-orange text-white'>
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Welcome back{user.name ? `, ${user.name}` : ''}!
              </h1>
              <p className='text-gray-600'>{user.email}</p>
            </div>
          </div>

          {subscription && (
            <Badge
              className={`${
                subscription.status === 'active'
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
              }`}
            >
              {subscription.status === 'active'
                ? 'Active'
                : subscription.status}{' '}
              Subscription
            </Badge>
          )}
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with your most common tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid sm:grid-cols-2 gap-4'>
                  <Button variant='outline' className='h-20 flex-col' asChild>
                    <Link href='/timer'>
                      <Timer className='h-6 w-6 mb-2' />
                      Create Timer
                    </Link>
                  </Button>
                  <Button variant='outline' className='h-20 flex-col' asChild>
                    <Link href='/account/team'>
                      <Users className='h-6 w-6 mb-2' />
                      Manage Team
                    </Link>
                  </Button>
                  <Button variant='outline' className='h-20 flex-col' asChild>
                    <Link href='/account/settings'>
                      <Settings className='h-6 w-6 mb-2' />
                      Settings
                    </Link>
                  </Button>
                  <Button variant='outline' className='h-20 flex-col' asChild>
                    <Link href='/account/billing'>
                      <CreditCard className='h-6 w-6 mb-2' />
                      Billing
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest timer sessions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <Clock className='h-5 w-5 text-brand-orange' />
                    <div className='flex-1'>
                      <p className='font-medium'>Morning Service Timer</p>
                      <p className='text-sm text-gray-600'>
                        Created 2 hours ago
                      </p>
                    </div>
                    <Badge variant='outline'>Active</Badge>
                  </div>
                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <Users className='h-5 w-5 text-brand-orange' />
                    <div className='flex-1'>
                      <p className='font-medium'>Team member joined</p>
                      <p className='text-sm text-gray-600'>
                        Yesterday at 3:45 PM
                      </p>
                    </div>
                    <Badge variant='outline'>Team</Badge>
                  </div>
                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <Zap className='h-5 w-5 text-brand-orange' />
                    <div className='flex-1'>
                      <p className='font-medium'>Conference Event</p>
                      <p className='text-sm text-gray-600'>
                        Completed 3 days ago
                      </p>
                    </div>
                    <Badge variant='outline'>Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-8'>
            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isProUser ? (
                  <div className='space-y-4'>
                    <div>
                      <p className='font-medium text-green-600'>
                        Pro Plan Active
                      </p>
                      <p className='text-sm text-gray-600'>
                        Unlimited timers and devices
                      </p>
                    </div>
                    <Separator />
                    <Button variant='outline' className='w-full' asChild>
                      <Link href='/account/billing'>Manage Subscription</Link>
                    </Button>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div>
                      <p className='font-medium'>Free Plan</p>
                      <p className='text-sm text-gray-600'>
                        3 timers, 2 devices
                      </p>
                    </div>
                    <Separator />
                    <Button
                      className='w-full bg-brand-orange hover:bg-brand-600'
                      asChild
                    >
                      <Link href='/pricing'>Upgrade to Pro</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Timers Created</span>
                    <span className='font-medium'>24</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Total Hours</span>
                    <span className='font-medium'>156</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Team Members</span>
                    <span className='font-medium'>3</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Events</span>
                    <span className='font-medium'>8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## File: `app/[locale]/checkout/page.tsx`

```tsx
'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AlertCircle, CheckCircle, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PlanDetails {
  name: string;
  price: number;
  period: string;
  features: string[];
}

const plans: Record<string, PlanDetails> = {
  pro: {
    name: 'CueTimer Pro',
    price: 12,
    period: 'month',
    features: [
      'Unlimited timers',
      'Unlimited devices',
      'Presenter messaging',
      'Custom branding',
      'Priority support',
      'Advanced analytics',
      'Export capabilities',
    ],
  },
  teams: {
    name: 'CueTimer Teams',
    price: 49,
    period: 'month',
    features: [
      'Everything in Pro',
      '5 team members',
      'Team collaboration',
      'Organization management',
      'Advanced analytics dashboard',
      'API access',
      'Dedicated support',
    ],
  },
};

export default function CheckoutPage() {
  const [plan, setPlan] = useState<string>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    if (planParam && plans[planParam]) {
      setPlan(planParam);
    }
  }, []);

  const createPaymentIntent = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          billingCycle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = plans[plan];
  if (!currentPlan) {
    return (
      <div className='min-h-screen bg-gray-50 py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center'>
              <h1 className='text-2xl font-bold text-gray-900 mb-4'>
                Plan Not Found
              </h1>
              <p className='text-gray-600 mb-8'>
                The selected plan is not available.
              </p>
              <Link href='/pricing' className='btn-primary'>
                Back to Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const yearlyPrice = currentPlan.price * 12 * 0.8; // 20% discount for yearly
  const displayPrice =
    billingCycle === 'yearly' ? yearlyPrice : currentPlan.price;

  if (!clientSecret) {
    return (
      <div className='min-h-screen bg-gray-50 py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-12'>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                Complete Your Purchase
              </h1>
              <p className='text-lg text-gray-600'>
                Get started with CueTimer and transform your event timing
              </p>
            </div>

            <div className='grid lg:grid-cols-2 gap-8'>
              {/* Plan Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your selected plan</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Plan Selection */}
                  <div className='space-y-4'>
                    <Label>Select Plan</Label>
                    <div className='space-y-2'>
                      {Object.entries(plans).map(([key, planDetails]) => (
                        <div
                          key={key}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            plan === key
                              ? 'border-brand-orange bg-brand-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setPlan(key)}
                        >
                          <div className='flex items-center justify-between'>
                            <div>
                              <h3 className='font-semibold'>
                                {planDetails.name}
                              </h3>
                              <p className='text-sm text-gray-600'>
                                ${planDetails.price}/month
                              </p>
                            </div>
                            {plan === key && (
                              <CheckCircle className='h-5 w-5 text-brand-orange' />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Billing Cycle */}
                  <div className='space-y-4'>
                    <Label>Billing Cycle</Label>
                    <div className='grid grid-cols-2 gap-2'>
                      <Button
                        variant={
                          billingCycle === 'monthly' ? 'default' : 'outline'
                        }
                        onClick={() => setBillingCycle('monthly')}
                        className={
                          billingCycle === 'monthly' ? 'bg-brand-orange' : ''
                        }
                      >
                        Monthly
                      </Button>
                      <Button
                        variant={
                          billingCycle === 'yearly' ? 'default' : 'outline'
                        }
                        onClick={() => setBillingCycle('yearly')}
                        className={
                          billingCycle === 'yearly' ? 'bg-brand-orange' : ''
                        }
                      >
                        Yearly
                        <Badge
                          variant='secondary'
                          className='ml-2 bg-green-100 text-green-800'
                        >
                          Save 20%
                        </Badge>
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span>{currentPlan.name}</span>
                      <span>${displayPrice}</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className='flex justify-between text-green-600'>
                        <span>Yearly discount (20%)</span>
                        <span>-${currentPlan.price * 12 * 0.2}</span>
                      </div>
                    )}
                    <Separator />
                    <div className='flex justify-between font-bold text-lg'>
                      <span>Total</span>
                      <span>
                        ${displayPrice}
                        <span className='text-sm font-normal text-gray-600'>
                          /{billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
                      <AlertCircle className='h-4 w-4 text-red-500' />
                      <span className='text-sm text-red-700'>{error}</span>
                    </div>
                  )}

                  <Button
                    onClick={createPaymentIntent}
                    disabled={loading}
                    className='w-full bg-brand-orange hover:bg-brand-600'
                    size='lg'
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </Button>

                  <div className='flex items-center justify-center text-sm text-gray-500'>
                    <Lock className='h-4 w-4 mr-1' />
                    Secure payment powered by Stripe
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                  <CardDescription>Your selected plan features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {currentPlan.features.map((feature) => (
                      <div key={feature} className='flex items-start'>
                        <CheckCircle className='h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0' />
                        <span className='text-gray-700'>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className='my-6' />

                  <div className='text-center'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-4'>
                      <CreditCard className='h-8 w-8 text-brand-orange' />
                    </div>
                    <h3 className='font-semibold mb-2'>
                      30-Day Money Back Guarantee
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Not satisfied? Get a full refund within 30 days, no
                      questions asked.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className='min-h-screen bg-gray-50 py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl mx-auto'>
            <div className='text-center mb-12'>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                Complete Your Purchase
              </h1>
              <p className='text-lg text-gray-600'>
                Enter your payment details to activate your subscription
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  Your {currentPlan.name} subscription - ${displayPrice}/
                  {billingCycle === 'yearly' ? 'year' : 'month'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CheckoutForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Elements>
  );
}
```

## File: `app/[locale]/checkout/cancel/page.tsx`

```tsx
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CheckoutCancelPage() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full'>
        <Card>
          <CardHeader className='text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <ArrowLeft className='h-8 w-8 text-gray-400' />
            </div>
            <CardTitle className='text-2xl'>Payment Cancelled</CardTitle>
            <CardDescription>
              Your payment was cancelled and you haven't been charged.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='text-center text-sm text-gray-600'>
              <p>
                No worries! You can try again anytime or contact our support
                team if you ran into any issues.
              </p>
            </div>

            <div className='space-y-3'>
              <Button
                className='w-full bg-brand-orange hover:bg-brand-600 text-white'
                asChild
              >
                <Link href='/pricing'>
                  <ArrowRight className='mr-2 h-4 w-4' />
                  Try Again
                </Link>
              </Button>

              <Button variant='outline' className='w-full' asChild>
                <Link href='/support'>
                  <RefreshCw className='mr-2 h-4 w-4' />
                  Contact Support
                </Link>
              </Button>

              <Button variant='ghost' className='w-full' asChild>
                <Link href='/'>Back to Home</Link>
              </Button>
            </div>

            <div className='text-center text-xs text-gray-500'>
              <p>
                Questions about pricing or features? Check out our{' '}
                <Link
                  href='/pricing'
                  className='text-brand-orange hover:underline'
                >
                  pricing page
                </Link>{' '}
                or{' '}
                <Link
                  href='/support'
                  className='text-brand-orange hover:underline'
                >
                  FAQ section
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```
