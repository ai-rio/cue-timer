'use client';

// @ts-expect-error TODO: Install Stripe dependencies when implementing payment features
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AlertCircle, CheckCircle, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
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
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
              <h1 className='text-2xl font-bold text-gray-900 mb-4'>Plan Not Found</h1>
              <p className='text-gray-600 mb-8'>The selected plan is not available.</p>
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
  const displayPrice = billingCycle === 'yearly' ? yearlyPrice : currentPlan.price;

  if (!clientSecret) {
    return (
      <div className='min-h-screen bg-gray-50 py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-12'>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>Complete Your Purchase</h1>
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
                              <h3 className='font-semibold'>{planDetails.name}</h3>
                              <p className='text-sm text-gray-600'>${planDetails.price}/month</p>
                            </div>
                            {plan === key && <CheckCircle className='h-5 w-5 text-brand-orange' />}
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
                        variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                        onClick={() => setBillingCycle('monthly')}
                        className={billingCycle === 'monthly' ? 'bg-brand-orange' : ''}
                      >
                        Monthly
                      </Button>
                      <Button
                        variant={billingCycle === 'yearly' ? 'default' : 'outline'}
                        onClick={() => setBillingCycle('yearly')}
                        className={billingCycle === 'yearly' ? 'bg-brand-orange' : ''}
                      >
                        Yearly
                        <Badge variant='secondary' className='ml-2 bg-green-100 text-green-800'>
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
                    <h3 className='font-semibold mb-2'>30-Day Money Back Guarantee</h3>
                    <p className='text-sm text-gray-600'>
                      Not satisfied? Get a full refund within 30 days, no questions asked.
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
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>Complete Your Purchase</h1>
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
