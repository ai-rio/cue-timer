import { ArrowRight, CheckCircle, Clock, Shield, Users, Zap } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
              <span className='text-primary'> Works When Technology Doesn't</span>
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground transition-colors duration-300'>
              CueTimer is the mobile-first stage timer built for event professionals. Real-time
              sync, offline reliability, and frictionless presenter collaboration.
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
                <CardTitle className='text-xl text-card-foreground'>Real-Time Sync</CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Instant synchronization across all devices. No more counting delays or sync
                  issues.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/20'>
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300'>
                  <Shield className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl text-card-foreground'>Offline First</CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Keep timing even when internet fails. Professional reliability when it matters
                  most.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/20'>
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300'>
                  <Users className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl text-card-foreground'>Presenter Messaging</CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Discreet communication between timing team and presenters. Keep events on track
                  smoothly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/20'>
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300'>
                  <Zap className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl text-card-foreground'>QR Code Join</CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Presenters join with a single scan. No app downloads, no complex setup, just
                  reliable timing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/20'>
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300'>
                  <CheckCircle className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl text-card-foreground'>Mobile First</CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Designed for phones and tablets, not desktops. Control your timing from anywhere
                  in the venue.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/20'>
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300'>
                  <Users className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl text-card-foreground'>Team Collaboration</CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Multiple team members can coordinate timing together. Perfect for complex events.
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
                Perfect for church tech directors managing service timing, sermon lengths, and
                transition coordination.
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
                Professional conference management with keynote timing, breakout sessions, and
                speaker coordination.
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
                Individual speakers and MCs who need reliable timing for presentations, keynotes,
                and performances.
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
            Join thousands of event professionals who trust CueTimer for reliable, professional
            timing.
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
