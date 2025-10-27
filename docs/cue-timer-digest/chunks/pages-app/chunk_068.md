# Chunk 68: pages_app

## Metadata

- **Files**: 4
- **Size**: 24,060 characters (~6,015 tokens)
- **Categories**: pages

## Files in this chunk

- `app/[locale]/(marketing)/page.tsx`
- `app/[locale]/(marketing)/about/page.tsx`
- `app/[locale]/(marketing)/pricing/page.tsx`
- `app/[locale]/account/layout.tsx`

---

## File: `app/[locale]/(marketing)/page.tsx`

```tsx
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-secondary/20 transition-colors duration-300'>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='container mx-auto px-4 py-20 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <Badge className='mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors'>
              Trusted by Event Professionals Worldwide
            </Badge>
            <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-6xl transition-colors duration-300'>
              The Professional Timer That
              <span className='text-primary'>
                {' '}
                Works When Technology Doesn't
              </span>
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground transition-colors duration-300'>
              CueTimer is the mobile-first stage timer built for event
              professionals. Real-time sync, offline reliability, and
              frictionless presenter collaboration.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Button
                size='lg'
                className='bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 transition-all duration-200 hover:scale-105'
                asChild
              >
                <Link href='/pricing'>
                  Get Started Free
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button
                variant='outline'
                size='lg'
                className='border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200'
                asChild
              >
                <Link href='#demo'>Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-card transition-colors duration-300'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-foreground sm:text-4xl transition-colors duration-300'>
              Built for the Modern Event Professional
            </h2>
            <p className='mt-4 text-lg text-muted-foreground transition-colors duration-300'>
              Every feature designed with reliability and simplicity in mind
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card className='border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/20'>
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300'>
                  <Clock className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl text-card-foreground'>
                  Real-Time Sync
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Instant synchronization across all devices. No more counting
                  delays or sync issues.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/20'>
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300'>
                  <Shield className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl text-card-foreground'>
                  Offline First
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Keep timing even when internet fails. Professional reliability
                  when it matters most.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/20'>
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300'>
                  <Users className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl text-card-foreground'>
                  Presenter Messaging
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Discreet communication between timing team and presenters.
                  Keep events on track smoothly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/20'>
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300'>
                  <Zap className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl text-card-foreground'>
                  QR Code Join
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Presenters join with a single scan. No app downloads, no
                  complex setup, just reliable timing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/20'>
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300'>
                  <CheckCircle className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl text-card-foreground'>
                  Mobile First
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Designed for phones and tablets, not desktops. Control your
                  timing from anywhere in the venue.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/20'>
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300'>
                  <Users className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl text-card-foreground'>
                  Team Collaboration
                </CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Multiple team members can coordinate timing together. Perfect
                  for complex events.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className='py-20 bg-secondary/10 transition-colors duration-300'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-foreground sm:text-4xl transition-colors duration-300'>
              Trusted by Event Professionals
            </h2>
            <p className='mt-4 text-lg text-muted-foreground transition-colors duration-300'>
              From worship services to corporate conferences, CueTimer delivers
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='text-center p-6 rounded-lg bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:scale-105'>
              <div className='bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold transition-colors duration-300'>
                ⛪
              </div>
              <h3 className='text-xl font-semibold text-card-foreground mb-2 transition-colors duration-300'>
                Worship Services
              </h3>
              <p className='text-muted-foreground transition-colors duration-300'>
                Perfect for church tech directors managing service timing,
                sermon lengths, and transition coordination.
              </p>
            </div>

            <div className='text-center p-6 rounded-lg bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:scale-105'>
              <div className='bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold transition-colors duration-300'>
                💼
              </div>
              <h3 className='text-xl font-semibold text-card-foreground mb-2 transition-colors duration-300'>
                Corporate Events
              </h3>
              <p className='text-muted-foreground transition-colors duration-300'>
                Professional conference management with keynote timing, breakout
                sessions, and speaker coordination.
              </p>
            </div>

            <div className='text-center p-6 rounded-lg bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:scale-105'>
              <div className='bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold transition-colors duration-300'>
                🎤
              </div>
              <h3 className='text-xl font-semibold text-card-foreground mb-2 transition-colors duration-300'>
                Professional Speakers
              </h3>
              <p className='text-muted-foreground transition-colors duration-300'>
                Individual speakers and MCs who need reliable timing for
                presentations, keynotes, and performances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-primary transition-colors duration-300'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold text-primary-foreground sm:text-4xl transition-colors duration-300'>
            Ready to Transform Your Event Timing?
          </h2>
          <p className='mt-4 text-xl text-primary-foreground/90 max-w-2xl mx-auto transition-colors duration-300'>
            Join thousands of event professionals who trust CueTimer for
            reliable, professional timing.
          </p>
          <div className='mt-10'>
            <Button
              size='lg'
              variant='secondary'
              className='bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-3 transition-all duration-200 hover:scale-105'
              asChild
            >
              <Link href='/pricing'>
                Start Free Trial
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
          <p className='mt-4 text-primary-foreground/80 transition-colors duration-300'>
            No credit card required • 3 timers free forever
          </p>
        </div>
      </section>
    </div>
  );
}
```

## File: `app/[locale]/(marketing)/about/page.tsx`

```tsx
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className='min-h-screen bg-background transition-colors duration-300'>
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold text-center mb-8 text-foreground transition-colors duration-300'>
            {t('title')}
          </h1>

          <div className='prose prose-lg mx-auto'>
            <p className='text-xl text-muted-foreground text-center mb-12 transition-colors duration-300'>
              {t('subtitle')}
            </p>

            <div className='grid md:grid-cols-2 gap-8 mt-16'>
              <div className='text-center p-8 rounded-lg bg-card border border-border hover:border-primary/20 transition-all duration-300'>
                <h2 className='text-2xl font-semibold mb-4 text-card-foreground transition-colors duration-300'>
                  {t('mission.title')}
                </h2>
                <p className='text-muted-foreground transition-colors duration-300'>
                  {t('mission.description')}
                </p>
              </div>

              <div className='text-center p-8 rounded-lg bg-card border border-border hover:border-primary/20 transition-all duration-300'>
                <h2 className='text-2xl font-semibold mb-4 text-card-foreground transition-colors duration-300'>
                  {t('vision.title')}
                </h2>
                <p className='text-muted-foreground transition-colors duration-300'>
                  {t('vision.description')}
                </p>
              </div>
            </div>

            <div className='mt-16 text-center p-12 rounded-lg bg-card border border-border'>
              <h2 className='text-3xl font-semibold mb-8 text-card-foreground transition-colors duration-300'>
                {t('team.title')}
              </h2>
              <p className='text-lg text-muted-foreground transition-colors duration-300'>
                {t('team.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## File: `app/[locale]/(marketing)/pricing/page.tsx`

```tsx
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
            Choose the perfect plan for your needs. All plans include our core
            timing features with mobile-first design and offline reliability.
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
                <CardTitle className='text-2xl font-bold'>
                  {plan.name}
                </CardTitle>
                <CardDescription className='text-gray-600'>
                  {plan.description}
                </CardDescription>
                <div className='mt-4'>
                  <span className='text-4xl font-bold text-gray-900'>
                    ${plan.price}
                  </span>
                  {plan.period && (
                    <span className='text-gray-600 ml-2'>/{plan.period}</span>
                  )}
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
                    <div
                      key={limitation}
                      className='flex items-start opacity-60'
                    >
                      <div className='h-5 w-5 border-2 border-gray-300 rounded-full mr-3 mt-0.5 flex-shrink-0' />
                      <span className='text-gray-500 line-through'>
                        {limitation}
                      </span>
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
                <CardTitle className='text-lg'>
                  Can I change plans anytime?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Yes! You can upgrade or downgrade your plan at any time.
                  Changes take effect immediately, and we'll prorate any
                  differences.
                </p>
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>
                  What happens if I exceed my plan limits?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  We'll notify you before you hit any limits. For Free plan
                  users, you can upgrade to Pro anytime. Pro and Teams plans
                  have unlimited timers and devices.
                </p>
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Do you offer discounts for non-profits?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Yes! We offer 50% discounts for qualified non-profit
                  organizations and educational institutions. Contact our sales
                  team for more information.
                </p>
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Absolutely. We use industry-standard encryption and security
                  practices. Your timer data is also stored locally for offline
                  reliability, with secure cloud sync.
                </p>
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>What if I need help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Free plan users get community support through our forums. Pro
                  and Teams users receive priority email support with response
                  times under 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className='mt-20 text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Ready to get started?
          </h2>
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
          <p className='mt-4 text-sm text-gray-500'>
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
```

## File: `app/[locale]/account/layout.tsx`

```tsx
import Navigation from '@/components/Navigation';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen'>
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
```
