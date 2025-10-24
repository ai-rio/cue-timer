'use client';

import { AlertCircle, ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const pathname = usePathname();

  // Extract locale from pathname
  const locale = pathname?.split('/')[1] || 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, locale }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Magic link sent! Check your email to continue.',
        });
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to send magic link. Please try again.',
        });
      }
    } catch (_error) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <Link
            href='/'
            className='inline-flex items-center text-gray-600 hover:text-gray-900 mb-8'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Home
          </Link>
          <h2 className='text-3xl font-bold text-gray-900'>Welcome back to CueTimer</h2>
          <p className='mt-2 text-gray-600'>Sign in with your email to access your account</p>
        </div>

        <Card>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl'>Sign In</CardTitle>
            <CardDescription>We'll send you a magic link to sign in instantly</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email address</Label>
                <Input
                  id='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@example.com'
                  className='w-full'
                />
              </div>

              {message && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className='h-4 w-4 text-green-500' />
                  ) : (
                    <AlertCircle className='h-4 w-4 text-red-500' />
                  )}
                  <span
                    className={`text-sm ${
                      message.type === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {message.text}
                  </span>
                </div>
              )}

              <Button
                type='submit'
                disabled={loading || !email}
                className='w-full bg-brand-orange hover:bg-brand-600 text-white'
                size='lg'
              >
                {loading ? (
                  <div className='flex items-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                    Sending...
                  </div>
                ) : (
                  <div className='flex items-center'>
                    <Mail className='h-4 w-4 mr-2' />
                    Send Magic Link
                  </div>
                )}
              </Button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600'>
                Don't have an account?{' '}
                <Link href='/signup' className='text-brand-orange hover:underline font-medium'>
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className='text-center text-sm text-gray-500'>
          By signing in, you agree to our{' '}
          <Link href='/terms' className='text-brand-orange hover:underline'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href='/privacy' className='text-brand-orange hover:underline'>
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
