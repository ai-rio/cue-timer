import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying out CueTimer',
    price: 0,
    period: 'forever',
    features: [
      '3 timers maximum',
      '2 devices',
      'Basic timer functionality',
      'Community support',
      'QR code presenter join',
    ],
    limitations: [
      'No presenter messaging',
      'No custom branding',
      'No analytics',
      'No priority support',
    ],
    cta: 'Get Started Free',
    href: '/signup?plan=free',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'Professional event management',
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
      'Offline-first reliability',
    ],
    limitations: [],
    cta: 'Start Pro Trial',
    href: '/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Teams',
    description: 'For organizations and venues',
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
      'Custom contracts available',
    ],
    limitations: [],
    cta: 'Contact Sales',
    href: '/contact?plan=teams',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 py-20'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
            Simple, Transparent
            <span className='text-brand-orange'> Pricing</span>
          </h1>
          <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
            Choose the perfect plan for your needs. All plans include our core timing features with
            mobile-first design and offline reliability.
          </p>
          <div className='mt-8 flex items-center justify-center gap-x-6 text-sm text-gray-600'>
            <div className='flex items-center'>
              <CheckCircle className='h-4 w-4 text-green-500 mr-1' />
              No hidden fees
            </div>
            <div className='flex items-center'>
              <CheckCircle className='h-4 w-4 text-green-500 mr-1' />
              Cancel anytime
            </div>
            <div className='flex items-center'>
              <CheckCircle className='h-4 w-4 text-green-500 mr-1' />
              14-day free trial
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20'>
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-brand-orange shadow-brand-lg ring-2 ring-brand-orange/20'
                  : 'border-gray-200 shadow-sm'
              } hover:shadow-lg transition-shadow`}
            >
              {plan.popular && (
                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                  <Badge className='bg-brand-orange text-white px-3 py-1 text-sm font-medium'>
                    <Star className='h-3 w-3 mr-1' />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className='text-center pb-8'>
                <CardTitle className='text-2xl font-bold'>{plan.name}</CardTitle>
                <CardDescription className='text-gray-600'>{plan.description}</CardDescription>
                <div className='mt-4'>
                  <span className='text-4xl font-bold text-gray-900'>${plan.price}</span>
                  {plan.period && <span className='text-gray-600 ml-2'>/{plan.period}</span>}
                </div>
              </CardHeader>

              <CardContent className='space-y-6'>
                {/* Features */}
                <div className='space-y-3'>
                  {plan.features.map((feature) => (
                    <div key={feature} className='flex items-start'>
                      <CheckCircle className='h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0' />
                      <span className='text-gray-700'>{feature}</span>
                    </div>
                  ))}

                  {plan.limitations.map((limitation) => (
                    <div key={limitation} className='flex items-start opacity-60'>
                      <div className='h-5 w-5 border-2 border-gray-300 rounded-full mr-3 mt-0.5 flex-shrink-0' />
                      <span className='text-gray-500 line-through'>{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  size='lg'
                  className={`w-full ${
                    plan.popular
                      ? 'bg-brand-orange hover:bg-brand-600 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  asChild
                >
                  <Link href={plan.href}>
                    {plan.cta}
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-2xl font-bold text-gray-900 text-center mb-12'>
            Frequently Asked Questions
          </h2>

          <div className='space-y-8'>
            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect
                  immediately, and we'll prorate any differences.
                </p>
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>What happens if I exceed my plan limits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  We'll notify you before you hit any limits. For Free plan users, you can upgrade
                  to Pro anytime. Pro and Teams plans have unlimited timers and devices.
                </p>
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>Do you offer discounts for non-profits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Yes! We offer 50% discounts for qualified non-profit organizations and educational
                  institutions. Contact our sales team for more information.
                </p>
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Absolutely. We use industry-standard encryption and security practices. Your timer
                  data is also stored locally for offline reliability, with secure cloud sync.
                </p>
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>What if I need help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Free plan users get community support through our forums. Pro and Teams users
                  receive priority email support with response times under 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className='mt-20 text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>Ready to get started?</h2>
          <p className='text-lg text-gray-600 mb-8'>
            Join thousands of event professionals who trust CueTimer
          </p>
          <Button
            size='lg'
            className='bg-brand-orange hover:bg-brand-600 text-white px-8 py-3'
            asChild
          >
            <Link href='/signup'>
              Start Free Trial
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
          <p className='mt-4 text-sm text-gray-500'>No credit card required • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}
