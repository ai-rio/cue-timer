# Chunk 70: pages_app

## Metadata

- **Files**: 1
- **Size**: 7,628 characters (~1,907 tokens)
- **Categories**: pages

## Files in this chunk

- `app/[locale]/checkout/success/page.tsx`

---

## File: `app/[locale]/checkout/success/page.tsx`

```tsx
'use client';

import { ArrowRight, CheckCircle, Home, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SessionData {
  plan: string;
  amount: number;
  currency: string;
  customerEmail: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    if (sessionId) {
      // In a real implementation, you'd fetch session details from your API
      // For now, we'll simulate loading completion
      setTimeout(() => {
        setSessionData({
          plan: 'Pro',
          amount: 12,
          currency: 'USD',
          customerEmail: 'user@example.com',
        });
        setLoading(false);
      }, 1500);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto mb-4'></div>
          <p className='text-gray-600'>Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-50 to-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='max-w-2xl mx-auto text-center'>
          {/* Success Icon */}
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <CheckCircle className='h-10 w-10 text-green-600' />
          </div>

          {/* Success Message */}
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Welcome to CueTimer Pro!
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            Your subscription has been activated successfully. You're all set to
            take your event timing to the next level.
          </p>

          <Badge className='bg-green-100 text-green-800 border-green-200 mb-8'>
            Subscription Active
          </Badge>

          {/* Subscription Details */}
          {sessionData && (
            <Card className='mb-8'>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>Your subscription information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4 text-left'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Plan</span>
                    <span className='font-medium'>
                      CueTimer {sessionData.plan}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Amount</span>
                    <span className='font-medium'>
                      ${sessionData.amount} {sessionData.currency}/month
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Email</span>
                    <span className='font-medium'>
                      {sessionData.customerEmail}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Free Trial</span>
                    <span className='font-medium text-green-600'>14 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className='mb-8 text-left'>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold'>
                    1
                  </div>
                  <div>
                    <h3 className='font-semibold'>Check Your Email</h3>
                    <p className='text-gray-600 text-sm'>
                      We've sent a confirmation email with your receipt and
                      getting started guide.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold'>
                    2
                  </div>
                  <div>
                    <h3 className='font-semibold'>Create Your First Timer</h3>
                    <p className='text-gray-600 text-sm'>
                      Start using unlimited timers, presenter messaging, and all
                      Pro features.
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold'>
                    3
                  </div>
                  <div>
                    <h3 className='font-semibold'>Invite Your Team</h3>
                    <p className='text-gray-600 text-sm'>
                      Add team members to collaborate on timing and presenter
                      management.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              size='lg'
              className='bg-brand-orange hover:bg-brand-600 text-white'
              asChild
            >
              <Link href='/account/dashboard'>
                <Settings className='mr-2 h-4 w-4' />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant='outline' size='lg' asChild>
              <Link href='/timer'>
                <ArrowRight className='mr-2 h-4 w-4' />
                Create Timer
              </Link>
            </Button>
            <Button variant='ghost' size='lg' asChild>
              <Link href='/'>
                <Home className='mr-2 h-4 w-4' />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Support Info */}
          <div className='mt-12 p-6 bg-gray-50 rounded-lg'>
            <h3 className='font-semibold text-gray-900 mb-2'>Need Help?</h3>
            <p className='text-gray-600 mb-4'>
              Our support team is here to help you get the most out of CueTimer
              Pro.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button variant='outline' size='sm' asChild>
                <Link href='/support'>View Documentation</Link>
              </Button>
              <Button variant='outline' size='sm' asChild>
                <Link href='mailto:support@cuetimer.io'>Email Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```
