import { ArrowRight, CheckCircle, Clock, Shield, Users, Zap } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50'>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='container mx-auto px-4 py-20 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <Badge className='mb-6 bg-spotlight-orange-100 text-spotlight-orange-800 border-spotlight-orange-200'>
              Trusted by Event Professionals Worldwide
            </Badge>
            <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
              The Professional Timer That
              <span className='text-spotlight-orange'> Works When Technology Doesn't</span>
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600'>
              CueTimer is the mobile-first stage timer built for event professionals. Real-time
              sync, offline reliability, and frictionless presenter collaboration.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Button
                size='lg'
                className='bg-spotlight-orange hover:bg-spotlight-orange-600 text-white px-8 py-3'
                asChild
              >
                <Link href='/pricing'>
                  Get Started Free
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button variant='outline' size='lg' className='border-gray-300'>
                <Link href='#demo'>Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
              Built for the Modern Event Professional
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              Every feature designed with reliability and simplicity in mind
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card className='border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='w-12 h-12 bg-spotlight-orange-100 rounded-lg flex items-center justify-center mb-4'>
                  <Clock className='h-6 w-6 text-spotlight-orange' />
                </div>
                <CardTitle className='text-xl'>Real-Time Sync</CardTitle>
                <CardDescription>
                  Instant synchronization across all devices. No more counting delays or sync
                  issues.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='w-12 h-12 bg-spotlight-orange-100 rounded-lg flex items-center justify-center mb-4'>
                  <Shield className='h-6 w-6 text-spotlight-orange' />
                </div>
                <CardTitle className='text-xl'>Offline First</CardTitle>
                <CardDescription>
                  Keep timing even when internet fails. Professional reliability when it matters
                  most.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='w-12 h-12 bg-spotlight-orange-100 rounded-lg flex items-center justify-center mb-4'>
                  <Users className='h-6 w-6 text-spotlight-orange' />
                </div>
                <CardTitle className='text-xl'>Presenter Messaging</CardTitle>
                <CardDescription>
                  Discreet communication between timing team and presenters. Keep events on track
                  smoothly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='w-12 h-12 bg-spotlight-orange-100 rounded-lg flex items-center justify-center mb-4'>
                  <Zap className='h-6 w-6 text-spotlight-orange' />
                </div>
                <CardTitle className='text-xl'>QR Code Join</CardTitle>
                <CardDescription>
                  Presenters join with a single scan. No app downloads, no complex setup, just
                  reliable timing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='w-12 h-12 bg-spotlight-orange-100 rounded-lg flex items-center justify-center mb-4'>
                  <CheckCircle className='h-6 w-6 text-spotlight-orange' />
                </div>
                <CardTitle className='text-xl'>Mobile First</CardTitle>
                <CardDescription>
                  Designed for phones and tablets, not desktops. Control your timing from anywhere
                  in the venue.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='w-12 h-12 bg-spotlight-orange-100 rounded-lg flex items-center justify-center mb-4'>
                  <Users className='h-6 w-6 text-spotlight-orange' />
                </div>
                <CardTitle className='text-xl'>Team Collaboration</CardTitle>
                <CardDescription>
                  Multiple team members can coordinate timing together. Perfect for complex events.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
              Trusted by Event Professionals
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              From worship services to corporate conferences, CueTimer delivers
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='bg-spotlight-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold'>
                ⛪
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>Worship Services</h3>
              <p className='text-gray-600'>
                Perfect for church tech directors managing service timing, sermon lengths, and
                transition coordination.
              </p>
            </div>

            <div className='text-center'>
              <div className='bg-spotlight-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold'>
                💼
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>Corporate Events</h3>
              <p className='text-gray-600'>
                Professional conference management with keynote timing, breakout sessions, and
                speaker coordination.
              </p>
            </div>

            <div className='text-center'>
              <div className='bg-spotlight-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold'>
                🎤
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>Professional Speakers</h3>
              <p className='text-gray-600'>
                Individual speakers and MCs who need reliable timing for presentations, keynotes,
                and performances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-spotlight-orange'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold text-white sm:text-4xl'>
            Ready to Transform Your Event Timing?
          </h2>
          <p className='mt-4 text-xl text-spotlight-orange-100 max-w-2xl mx-auto'>
            Join thousands of event professionals who trust CueTimer for reliable, professional
            timing.
          </p>
          <div className='mt-10'>
            <Button
              size='lg'
              variant='secondary'
              className='bg-white text-spotlight-orange hover:bg-gray-100 px-8 py-3'
              asChild
            >
              <Link href='/pricing'>
                Start Free Trial
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
          <p className='mt-4 text-spotlight-orange-100'>
            No credit card required • 3 timers free forever
          </p>
        </div>
      </section>
    </div>
  );
}
