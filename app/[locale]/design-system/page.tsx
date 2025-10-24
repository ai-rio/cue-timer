'use client';

// Import Lucide icons
import {
  CheckCircle,
  ChevronDown,
  MessageCircle,
  Minus,
  Monitor,
  Moon,
  Pause,
  Play,
  Plus,
  QrCode,
  Settings,
  Smartphone,
  Square,
  Sun,
  Tablet,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useState } from 'react';

// Import all shadcn/ui components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DesignSystemPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTime = '05:42';
  const progress = 65;

  // Mock timer states for demonstration
  const timerStates = [
    {
      label: 'Success (5+ min)',
      value: 'success',
      color: 'bg-success-green',
      textColor: 'text-success-green',
    },
    {
      label: 'Warning (2 min)',
      value: 'warning',
      color: 'bg-timing-yellow',
      textColor: 'text-timing-yellow',
    },
    {
      label: 'Critical (1 min)',
      value: 'critical',
      color: 'bg-warning-red',
      textColor: 'text-warning-red',
    },
    { label: 'Expired', value: 'expired', color: 'bg-warning-red', textColor: 'text-warning-red' },
  ];

  return (
    <div className='min-h-screen bg-background text-foreground p-4 md:p-8'>
      {/* Header */}
      <div className='max-w-7xl mx-auto mb-8'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-4xl font-bold tracking-tight mb-2'>CueTimer Design System</h1>
            <p className='text-lg text-muted-foreground'>
              Comprehensive component showcase using shadcn/ui with CueTimer brand styling
            </p>
          </div>

          {/* Theme Toggle */}
          <div className='flex items-center space-x-2'>
            <Sun className='h-4 w-4' />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              aria-label='Toggle dark mode'
            />
            <Moon className='h-4 w-4' />
          </div>
        </div>

        {/* Color Palette */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Brand Color Palette</CardTitle>
            <CardDescription>
              Primary and secondary brand colors following CueTimer design system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {/* Spotlight Orange */}
              <div className='space-y-2'>
                <div className='h-20 bg-spotlight-orange rounded-lg shadow-sm'></div>
                <div>
                  <p className='font-medium'>Spotlight Orange</p>
                  <p className='text-sm text-muted-foreground'>#FF6B35</p>
                </div>
              </div>

              {/* Timing Yellow */}
              <div className='space-y-2'>
                <div className='h-20 bg-timing-yellow rounded-lg shadow-sm'></div>
                <div>
                  <p className='font-medium'>Timing Yellow</p>
                  <p className='text-sm text-muted-foreground'>#FFD23F</p>
                </div>
              </div>

              {/* Professional Gray */}
              <div className='space-y-2'>
                <div className='h-20 bg-professional-gray rounded-lg shadow-sm'></div>
                <div>
                  <p className='font-medium'>Professional Gray</p>
                  <p className='text-sm text-muted-foreground'>#2D3748</p>
                </div>
              </div>

              {/* Success Green */}
              <div className='space-y-2'>
                <div className='h-20 bg-success-green rounded-lg shadow-sm'></div>
                <div>
                  <p className='font-medium'>Success Green</p>
                  <p className='text-sm text-muted-foreground'>#48BB78</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue='typography' className='space-y-8'>
          <TabsList className='grid w-full grid-cols-4 lg:grid-cols-8'>
            <TabsTrigger value='typography'>Typography</TabsTrigger>
            <TabsTrigger value='buttons'>Buttons</TabsTrigger>
            <TabsTrigger value='forms'>Forms</TabsTrigger>
            <TabsTrigger value='timer'>Timer UI</TabsTrigger>
            <TabsTrigger value='status'>Status</TabsTrigger>
            <TabsTrigger value='layout'>Layout</TabsTrigger>
            <TabsTrigger value='overlay'>Overlays</TabsTrigger>
            <TabsTrigger value='responsive'>Responsive</TabsTrigger>
          </TabsList>

          {/* Typography Tab */}
          <TabsContent value='typography' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Typography System</CardTitle>
                <CardDescription>
                  Font hierarchy and usage following design system specifications
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Headings */}
                <div className='space-y-4'>
                  <h1 className='text-4xl font-bold tracking-tight'>Heading 1 - Inter Bold</h1>
                  <h2 className='text-3xl font-semibold tracking-tight'>
                    Heading 2 - Inter Semibold
                  </h2>
                  <h3 className='text-2xl font-semibold tracking-tight'>
                    Heading 3 - Inter Semibold
                  </h3>
                  <h4 className='text-xl font-medium tracking-tight'>Heading 4 - Inter Medium</h4>
                </div>

                <Separator />

                {/* Specialized Typography */}
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-muted-foreground mb-2'>
                      Timer Display (Space Grotesk)
                    </p>
                    <div className='text-6xl font-timer timer-display'>05:42.3</div>
                  </div>

                  <div>
                    <p className='text-sm text-muted-foreground mb-2'>
                      Technical Elements (JetBrains Mono)
                    </p>
                    <code className='text-sm font-mono-tech bg-muted px-2 py-1 rounded'>
                      cuetimer.io/join/ABC123
                    </code>
                  </div>

                  <div>
                    <p className='text-sm text-muted-foreground mb-2'>Body Text</p>
                    <p className='text-base leading-relaxed'>
                      This is body text using Inter Regular. It's optimized for readability and
                      follows the mobile-first approach with excellent contrast ratios.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buttons Tab */}
          <TabsContent value='buttons' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Button Components</CardTitle>
                <CardDescription>
                  Primary, secondary, and action buttons with brand colors
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Primary Actions */}
                <div>
                  <h3 className='text-lg font-medium mb-4'>Primary Actions (Spotlight Orange)</h3>
                  <div className='flex flex-wrap gap-4'>
                    <Button className='bg-spotlight-orange hover:bg-spotlight-orange-600 text-white'>
                      Start Timer
                    </Button>
                    <Button
                      size='lg'
                      className='bg-spotlight-orange hover:bg-spotlight-orange-600 text-white'
                    >
                      Large Button
                    </Button>
                    <Button
                      size='sm'
                      className='bg-spotlight-orange hover:bg-spotlight-orange-600 text-white'
                    >
                      Small
                    </Button>
                    <Button
                      variant='outline'
                      className='border-spotlight-orange text-spotlight-orange hover:bg-spotlight-orange hover:text-white'
                    >
                      Outline
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Secondary Actions */}
                <div>
                  <h3 className='text-lg font-medium mb-4'>
                    Secondary Actions (Professional Gray)
                  </h3>
                  <div className='flex flex-wrap gap-4'>
                    <Button
                      variant='secondary'
                      className='bg-professional-gray hover:bg-professional-gray-800 text-white'
                    >
                      Settings
                    </Button>
                    <Button
                      variant='outline'
                      className='border-professional-gray text-professional-gray'
                    >
                      Secondary Outline
                    </Button>
                    <Button variant='ghost' className='text-professional-gray'>
                      Ghost
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Icon Buttons */}
                <div>
                  <h3 className='text-lg font-medium mb-4'>Icon Buttons</h3>
                  <div className='flex gap-4'>
                    <Button
                      size='icon'
                      className='bg-spotlight-orange hover:bg-spotlight-orange-600 text-white'
                    >
                      <Play className='h-4 w-4' />
                    </Button>
                    <Button size='icon' variant='outline'>
                      <Pause className='h-4 w-4' />
                    </Button>
                    <Button size='icon' variant='outline'>
                      <Square className='h-4 w-4' />
                    </Button>
                    <Button size='icon' variant='outline'>
                      <Settings className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value='forms' className='space-y-6'>
            <div className='grid gap-6 lg:grid-cols-2'>
              {/* Form Elements */}
              <Card>
                <CardHeader>
                  <CardTitle>Form Components</CardTitle>
                  <CardDescription>Input fields, labels, and form controls</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='timer-name'>Timer Name</Label>
                    <Input id='timer-name' placeholder='Main Presentation Timer' />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='duration'>Duration (minutes)</Label>
                    <Input id='duration' type='number' placeholder='30' />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='presenter'>Presenter</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder='Select presenter' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='john'>John Doe</SelectItem>
                        <SelectItem value='jane'>Jane Smith</SelectItem>
                        <SelectItem value='bob'>Bob Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox id='auto-start' />
                    <Label htmlFor='auto-start'>Auto-start when ready</Label>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Switch id='notifications' />
                    <Label htmlFor='notifications'>Enable notifications</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Dropdown Menu */}
              <Card>
                <CardHeader>
                  <CardTitle>Dropdown Menu</CardTitle>
                  <CardDescription>Context menus and navigation</CardDescription>
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' className='w-full'>
                        Quick Actions <ChevronDown className='ml-2 h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Timer Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Play className='mr-2 h-4 w-4' />
                        Start Timer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pause className='mr-2 h-4 w-4' />
                        Pause Timer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Square className='mr-2 h-4 w-4' />
                        Stop Timer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className='mr-2 h-4 w-4' />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timer UI Tab */}
          <TabsContent value='timer' className='space-y-6'>
            {/* Controller View Simulation */}
            <Card>
              <CardHeader>
                <CardTitle>Controller View (Mobile Layout)</CardTitle>
                <CardDescription>Mobile-first timer interface simulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='max-w-sm mx-auto space-y-6'>
                  {/* Timer Display */}
                  <div className='text-center py-8'>
                    <div className='text-6xl font-timer timer-display text-professional-gray dark:text-white'>
                      {currentTime}
                    </div>
                  </div>

                  {/* Primary Controls */}
                  <div className='flex justify-center gap-4'>
                    <Button
                      size='lg'
                      className='bg-spotlight-orange hover:bg-spotlight-orange-600 text-white h-16 w-16 rounded-full'
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className='h-6 w-6' /> : <Play className='h-6 w-6' />}
                    </Button>
                    <Button
                      size='lg'
                      variant='outline'
                      className='h-16 w-16 rounded-full border-timing-yellow text-timing-yellow'
                    >
                      <Square className='h-6 w-6' />
                    </Button>
                  </div>

                  {/* Quick Adjustments */}
                  <div className='flex justify-center gap-2'>
                    <Button variant='outline' size='sm'>
                      <Plus className='h-4 w-4 mr-1' /> 1min
                    </Button>
                    <Button variant='outline' size='sm'>
                      <Plus className='h-4 w-4 mr-1' /> 5min
                    </Button>
                    <Button variant='outline' size='sm'>
                      <Minus className='h-4 w-4 mr-1' /> 1min
                    </Button>
                  </div>

                  {/* QR Code Section */}
                  <Card className='bg-muted/50'>
                    <CardContent className='p-6 text-center'>
                      <QrCode className='h-16 w-16 mx-auto mb-2 text-muted-foreground' />
                      <p className='text-sm font-medium'>Join Timer</p>
                      <p className='text-xs text-muted-foreground font-mono-tech'>
                        cuetimer.io/join/ABC123
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value='status' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Status Indicators</CardTitle>
                <CardDescription>
                  Connection status, timer states, and system indicators
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Connection Status */}
                <div>
                  <h3 className='text-lg font-medium mb-4'>Connection Status</h3>
                  <div className='flex flex-wrap gap-4'>
                    <Badge variant='outline' className='text-success-green border-success-green'>
                      <Wifi className='h-3 w-3 mr-1' />
                      Online
                    </Badge>
                    <Badge variant='outline' className='text-warning-red border-warning-red'>
                      <WifiOff className='h-3 w-3 mr-1' />
                      Offline
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Timer States */}
                <div>
                  <h3 className='text-lg font-medium mb-4'>Timer Warning States</h3>
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    {timerStates.map((state) => (
                      <Card
                        key={state.value}
                        className={`${state.color} ${state.textColor} text-white`}
                      >
                        <CardContent className='p-4 text-center'>
                          <div className='text-2xl font-timer timer-display mb-2'>
                            {state.value === 'success'
                              ? '10:00'
                              : state.value === 'warning'
                                ? '02:00'
                                : state.value === 'critical'
                                  ? '00:45'
                                  : '00:00'}
                          </div>
                          <p className='text-sm font-medium'>{state.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Progress Indicators */}
                <div>
                  <h3 className='text-lg font-medium mb-4'>Progress Indicators</h3>
                  <div className='space-y-4'>
                    <div>
                      <div className='flex justify-between text-sm mb-2'>
                        <span>Timer Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className='h-2' />
                    </div>
                    <div>
                      <div className='flex justify-between text-sm mb-2'>
                        <span>Sync Status</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className='h-2' />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value='layout' className='space-y-6'>
            <div className='grid gap-6 lg:grid-cols-3'>
              {/* User Card */}
              <Card>
                <CardHeader>
                  <div className='flex items-center space-x-4'>
                    <Avatar>
                      <AvatarImage src='/avatars/01.png' alt='User' />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className='text-lg'>John Doe</CardTitle>
                      <CardDescription>Event Manager</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>Active Timers</span>
                      <span className='font-medium'>3</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>Status</span>
                      <Badge variant='outline' className='text-success-green border-success-green'>
                        Online
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    <MessageCircle className='h-4 w-4 mr-2' />
                    Message
                  </Button>
                </CardFooter>
              </Card>

              {/* Device Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Responsive Design</CardTitle>
                  <CardDescription>Device-specific layouts</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center space-x-2'>
                    <Smartphone className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm'>Mobile: 320px - 767px</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Tablet className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm'>Tablet: 768px - 1023px</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Monitor className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm'>Desktop: 1024px+</span>
                  </div>
                </CardContent>
              </Card>

              {/* Accessibility */}
              <Card>
                <CardHeader>
                  <CardTitle>Accessibility</CardTitle>
                  <CardDescription>WCAG AA Compliance</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center space-x-2'>
                    <CheckCircle className='h-4 w-4 text-success-green' />
                    <span className='text-sm'>Color Contrast: 4.5:1</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <CheckCircle className='h-4 w-4 text-success-green' />
                    <span className='text-sm'>Touch Targets: 60px+</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <CheckCircle className='h-4 w-4 text-success-green' />
                    <span className='text-sm'>Screen Reader Support</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Overlays Tab */}
          <TabsContent value='overlay' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Dialog & Overlay Components</CardTitle>
                <CardDescription>Modals, tooltips, and overlay interfaces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-4'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant='outline'>Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Timer Settings</DialogTitle>
                        <DialogDescription>
                          Configure your timer preferences and warning times.
                        </DialogDescription>
                      </DialogHeader>
                      <div className='space-y-4 py-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='name'>Timer Name</Label>
                          <Input id='name' defaultValue='Main Presentation' />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='duration'>Duration (minutes)</Label>
                          <Input id='duration' type='number' defaultValue='30' />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant='outline'>Cancel</Button>
                        <Button className='bg-spotlight-orange hover:bg-spotlight-orange-600 text-white'>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant='outline' disabled>
                    Disabled State
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Responsive Tab */}
          <TabsContent value='responsive' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Responsive Design Examples</CardTitle>
                <CardDescription>Mobile-first responsive layouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-8'>
                  {/* Responsive Grid */}
                  <div>
                    <h3 className='text-lg font-medium mb-4'>Responsive Grid Layout</h3>
                    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
                      {[1, 2, 3, 4].map((item) => (
                        <Card key={item} className='bg-muted/50'>
                          <CardContent className='p-4 text-center'>
                            <div className='text-2xl font-timer timer-display mb-2'>0{item}:00</div>
                            <p className='text-sm'>Timer {item}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Responsive Controls */}
                  <div>
                    <h3 className='text-lg font-medium mb-4'>Responsive Controls</h3>
                    <div className='flex flex-col sm:flex-row gap-2'>
                      <Button className='flex-1 sm:flex-none bg-spotlight-orange hover:bg-spotlight-orange-600 text-white'>
                        <Play className='h-4 w-4 mr-2' />
                        Start
                      </Button>
                      <Button variant='outline' className='flex-1 sm:flex-none'>
                        <Pause className='h-4 w-4 mr-2' />
                        Pause
                      </Button>
                      <Button variant='outline' className='flex-1 sm:flex-none'>
                        <Square className='h-4 w-4 mr-2' />
                        Stop
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
