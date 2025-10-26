import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
                No worries! You can try again anytime or contact our support team if you ran into
                any issues.
              </p>
            </div>

            <div className='space-y-3'>
              <Button className='w-full bg-brand-orange hover:bg-brand-600 text-white' asChild>
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
                <Link href='/pricing' className='text-brand-orange hover:underline'>
                  pricing page
                </Link>{' '}
                or{' '}
                <Link href='/support' className='text-brand-orange hover:underline'>
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
