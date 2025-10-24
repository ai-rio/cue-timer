'use client';

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'An unexpected error occurred.');
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs' as const,
  };

  return (
    <form id='payment-form' onSubmit={handleSubmit}>
      <div className='space-y-6'>
        <PaymentElement id='payment-element' options={paymentElementOptions} />

        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              message.includes('success')
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.includes('success') ? (
              <CheckCircle className='h-4 w-4 text-green-500' />
            ) : (
              <AlertCircle className='h-4 w-4 text-red-500' />
            )}
            <span
              className={`text-sm ${
                message.includes('success') ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {message}
            </span>
          </div>
        )}

        <Button
          disabled={isLoading || !stripe || !elements}
          id='submit'
          className='w-full bg-brand-orange hover:bg-brand-600 text-white'
          size='lg'
        >
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </Button>

        <div className='text-center text-sm text-gray-500'>
          By completing this purchase, you agree to our{' '}
          <a href='/terms' className='text-brand-orange hover:underline'>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href='/privacy' className='text-brand-orange hover:underline'>
            Privacy Policy
          </a>
        </div>
      </div>
    </form>
  );
}
