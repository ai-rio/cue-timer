'use client';

import {
  AlertCircle,
  Check,
  CheckCircle,
  ChevronRight,
  Heart,
  Info,
  Moon,
  Star,
  Sun,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ThemeDemoPage() {
  const { theme, setTheme } = useTheme();

  const themeColors = [
    { name: 'Primary', class: 'bg-primary', textClass: 'text-primary-foreground' },
    { name: 'Secondary', class: 'bg-secondary', textClass: 'text-secondary-foreground' },
    { name: 'Accent', class: 'bg-accent', textClass: 'text-accent-foreground' },
    { name: 'Muted', class: 'bg-muted', textClass: 'text-muted-foreground' },
    { name: 'Destructive', class: 'bg-destructive', textClass: 'text-destructive-foreground' },
    { name: 'Brand Orange', class: 'bg-primary', textClass: 'text-primary-foreground' },
  ];

  const brandColors = [
    { name: 'Spotlight Orange', class: 'bg-spotlight-orange-500', textClass: 'text-white' },
    {
      name: 'Timing Yellow',
      class: 'bg-timing-yellow-500',
      textClass: 'text-professional-gray-900',
    },
    { name: 'Success Green', class: 'bg-success-500', textClass: 'text-white' },
    { name: 'Warning Red', class: 'bg-warning-500', textClass: 'text-white' },
    { name: 'Info Blue', class: 'bg-info-500', textClass: 'text-white' },
    { name: 'Professional Gray', class: 'bg-professional-gray-700', textClass: 'text-white' },
  ];

  const buttonVariants = [
    'default',
    'destructive',
    'outline',
    'secondary',
    'ghost',
    'link',
  ] as const;

  return (
    <div className='min-h-screen bg-background transition-colors duration-300'>
      <div className='container mx-auto px-4 py-8 space-y-12'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <div className='flex items-center justify-center gap-4 mb-6'>
            <ThemeToggle />
            <h1 className='text-3xl font-bold text-foreground'>CueTimer Theme System Demo</h1>
          </div>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Comprehensive testing of the light/dark theme system with smooth transitions and proper
            contrast ratios.
          </p>
          <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            <span>Current theme:</span>
            <Badge variant='outline' className='font-mono'>
              {theme || 'system'}
            </Badge>
          </div>
        </div>

        {/* Theme Toggle Section */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground flex items-center gap-2'>
              <Sun className='h-5 w-5' />
              Theme Toggle Controls
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              Test different theme switching methods and transitions
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-wrap gap-4'>
              <Button
                onClick={() => setTheme('light')}
                variant={theme === 'light' ? 'default' : 'outline'}
              >
                <Sun className='h-4 w-4 mr-2' />
                Light Mode
              </Button>
              <Button
                onClick={() => setTheme('dark')}
                variant={theme === 'dark' ? 'default' : 'outline'}
              >
                <Moon className='h-4 w-4 mr-2' />
                Dark Mode
              </Button>
              <Button
                onClick={() => setTheme('system')}
                variant={theme === 'system' ? 'default' : 'outline'}
              >
                System
              </Button>
            </div>
            <div className='p-4 bg-muted rounded-lg'>
              <p className='text-sm text-muted-foreground'>
                <strong>Note:</strong> Theme changes are persisted to localStorage and survive page
                refreshes. Smooth transitions are applied to all theme changes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Colors */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>System Theme Colors</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Semantic color tokens that adapt to light/dark themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
              {themeColors.map((color) => (
                <div key={color.name} className='text-center space-y-2'>
                  <div
                    className={`h-20 rounded-lg ${color.class} flex items-center justify-center transition-colors duration-300`}
                  >
                    <Check className={`h-6 w-6 ${color.textClass}`} />
                  </div>
                  <p className='text-sm font-medium text-foreground'>{color.name}</p>
                  <p className='text-xs text-muted-foreground font-mono'>{color.class}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brand Colors */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>CueTimer Brand Colors</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Consistent brand colors that work across both themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {brandColors.map((color) => (
                <div key={color.name} className='text-center space-y-2'>
                  <div
                    className={`h-20 rounded-lg ${color.class} flex items-center justify-center transition-colors duration-300`}
                  >
                    <Zap className={`h-6 w-6 ${color.textClass}`} />
                  </div>
                  <p className='text-sm font-medium text-foreground'>{color.name}</p>
                  <p className='text-xs text-muted-foreground font-mono'>{color.class}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>Button Variants</CardTitle>
            <CardDescription className='text-muted-foreground'>
              All button variants with proper theme support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {buttonVariants.map((variant) => (
                <div key={variant} className='space-y-2'>
                  <p className='text-sm font-medium text-foreground capitalize'>{variant}</p>
                  <div className='flex flex-wrap gap-2'>
                    <Button variant={variant} size='sm'>
                      Small
                    </Button>
                    <Button variant={variant} size='default'>
                      Default
                    </Button>
                    <Button variant={variant} size='lg'>
                      Large
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>Typography & Text Colors</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Text hierarchy with proper contrast in both themes
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-4'>
              <h1 className='text-4xl font-bold text-foreground'>Heading 1 - Primary Text</h1>
              <h2 className='text-3xl font-semibold text-foreground'>Heading 2 - Primary Text</h2>
              <h3 className='text-2xl font-medium text-foreground'>Heading 3 - Primary Text</h3>
              <p className='text-lg text-muted-foreground'>Large paragraph text in muted color</p>
              <p className='text-base text-foreground'>
                Regular paragraph text in foreground color
              </p>
              <p className='text-sm text-muted-foreground'>Small text in muted color</p>
              <p className='text-xs text-muted-foreground'>Extra small text in muted color</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg'>
              <div>
                <h4 className='font-semibold text-foreground mb-2'>Text States</h4>
                <p className='text-primary mb-1'>Primary text color</p>
                <p className='text-secondary mb-1'>Secondary text color</p>
                <p className='text-muted-foreground mb-1'>Muted text color</p>
                <p className='text-destructive mb-1'>Destructive text color</p>
              </div>
              <div>
                <h4 className='font-semibold text-foreground mb-2'>Special Typography</h4>
                <p className='font-timer text-2xl'>Timer Font Display</p>
                <p className='font-mono text-sm'>Monospace code text</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>Interactive Elements</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Test hover, focus, and active states across themes
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex flex-wrap gap-4'>
              <Button>
                <CheckCircle className='h-4 w-4 mr-2' />
                Success Button
              </Button>
              <Button variant='outline'>
                <Info className='h-4 w-4 mr-2' />
                Info Button
              </Button>
              <Button variant='destructive'>
                <X className='h-4 w-4 mr-2' />
                Cancel Button
              </Button>
              <Button variant='secondary'>
                <Heart className='h-4 w-4 mr-2' />
                Like Button
              </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <Badge variant='default' className='w-fit'>
                <Star className='h-3 w-3 mr-1' />
                Default Badge
              </Badge>
              <Badge variant='secondary' className='w-fit'>
                <ChevronRight className='h-3 w-3 mr-1' />
                Secondary Badge
              </Badge>
              <Badge variant='outline' className='w-fit'>
                <AlertCircle className='h-3 w-3 mr-1' />
                Outline Badge
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cards & Surfaces */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>Cards & Surfaces</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Different surface levels with proper shadows and borders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <Card className='hover:shadow-lg transition-all duration-300 hover:scale-105'>
                <CardHeader>
                  <CardTitle className='text-card-foreground flex items-center gap-2'>
                    <Zap className='h-5 w-5 text-primary' />
                    Interactive Card
                  </CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    Hover over this card to see interactive effects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    This card demonstrates hover states and transitions in both themes.
                  </p>
                </CardContent>
              </Card>

              <Card className='border-primary/20 bg-primary/5'>
                <CardHeader>
                  <CardTitle className='text-card-foreground'>Primary Accent Card</CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    Card with primary color accents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Uses primary color for border and subtle background.
                  </p>
                </CardContent>
              </Card>

              <Card className='bg-muted'>
                <CardHeader>
                  <CardTitle className='text-card-foreground'>Muted Background Card</CardTitle>
                  <CardDescription className='text-muted-foreground'>
                    Card with muted background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    Uses muted background for subtle differentiation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>Navigation Elements</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Navigation components with proper theme support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <nav className='border-b border-border pb-4 mb-4'>
              <div className='flex space-x-6'>
                <Link href='#' className='text-primary hover:text-primary/80 transition-colors'>
                  Home
                </Link>
                <Link href='#' className='text-foreground hover:text-primary transition-colors'>
                  About
                </Link>
                <Link
                  href='#'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Features
                </Link>
                <Link href='#' className='text-foreground hover:text-primary transition-colors'>
                  Pricing
                </Link>
              </div>
            </nav>
            <div className='flex items-center justify-between p-4 bg-muted rounded-lg'>
              <span className='text-sm text-muted-foreground'>Navigation test area</span>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Theme Information */}
        <Card className='border-border'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>Theme System Information</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Technical details about the implemented theme system
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h4 className='font-semibold text-foreground mb-2'>Features Implemented</h4>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Smooth theme transitions (300ms)
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    System preference detection
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    localStorage persistence
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    SSR/hydration safe
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Accessible theme toggle
                  </li>
                </ul>
              </div>
              <div>
                <h4 className='font-semibold text-foreground mb-2'>Brand Consistency</h4>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    CueTimer brand colors
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Proper contrast ratios
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Consistent visual hierarchy
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Responsive design support
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-success-500' />
                    Interactive hover states
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className='text-center py-8 border-t border-border'>
          <p className='text-muted-foreground'>
            Theme system demo • Current theme:{' '}
            <span className='font-mono text-primary'>{theme || 'system'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
