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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/auth/supabase';
import { Subscription, User } from '@/types/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, _setSubscription] = useState<Subscription | null>(null);
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
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className='w-full bg-brand-orange hover:bg-brand-600'>
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
              <AvatarFallback className='bg-brand-orange text-white'>{userInitials}</AvatarFallback>
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
              {subscription.status === 'active' ? 'Active' : subscription.status} Subscription
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
                <CardDescription>Get started with your most common tasks</CardDescription>
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
                <CardDescription>Your latest timer sessions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <Clock className='h-5 w-5 text-brand-orange' />
                    <div className='flex-1'>
                      <p className='font-medium'>Morning Service Timer</p>
                      <p className='text-sm text-gray-600'>Created 2 hours ago</p>
                    </div>
                    <Badge variant='outline'>Active</Badge>
                  </div>
                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <Users className='h-5 w-5 text-brand-orange' />
                    <div className='flex-1'>
                      <p className='font-medium'>Team member joined</p>
                      <p className='text-sm text-gray-600'>Yesterday at 3:45 PM</p>
                    </div>
                    <Badge variant='outline'>Team</Badge>
                  </div>
                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <Zap className='h-5 w-5 text-brand-orange' />
                    <div className='flex-1'>
                      <p className='font-medium'>Conference Event</p>
                      <p className='text-sm text-gray-600'>Completed 3 days ago</p>
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
                      <p className='font-medium text-green-600'>Pro Plan Active</p>
                      <p className='text-sm text-gray-600'>Unlimited timers and devices</p>
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
                      <p className='text-sm text-gray-600'>3 timers, 2 devices</p>
                    </div>
                    <Separator />
                    <Button className='w-full bg-brand-orange hover:bg-brand-600' asChild>
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
