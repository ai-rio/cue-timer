# CueTimer Design System Test Page

This directory contains a comprehensive design system test page that validates
and demonstrates all documented design resources for CueTimer, strictly using
shadcn/ui components as required by the design system.

## Purpose

- **Validate**: Ensure all shadcn/ui components work correctly with CueTimer
  brand colors
- **Demonstrate**: Show proper component usage patterns and variants
- **Test**: Verify responsive behavior across all breakpoints
- **Document**: Provide clear examples of component implementation

## Features

### 🎨 Brand Identity

- **Color Palette**: All brand colors (Spotlight Orange, Timing Yellow,
  Professional Gray, Success Green, Warning Red)
- **Typography**: Inter (primary), Space Grotesk (timers), JetBrains Mono
  (technical)
- **Animations**: Timer status states with appropriate pulsing/flashing
  animations

### 🧩 shadcn/ui Components Used

All components are sourced from `@/components/ui/` - **NO custom components**:

- **Button** - Primary, secondary, outline, ghost variants with brand colors
- **Card** - Container components with proper header/content/footer structure
- **Input** - Form inputs with proper labels and validation states
- **Label** - Accessible form labels
- **Select** - Dropdown selection with search functionality
- **Checkbox** - Boolean input controls
- **Switch** - Toggle switches for settings
- **Tabs** - Tab navigation for organizing content sections
- **Dialog** - Modal dialogs for settings and confirmations
- **Dropdown Menu** - Context menus and quick actions
- **Progress** - Progress indicators for timer and sync status
- **Badge** - Status badges for connection and timer states
- **Avatar** - User avatars with fallbacks
- **Separator** - Visual dividers for content organization

### 📱 Mobile-First Responsive Design

- **320px - 767px**: Mobile layout (primary focus)
- **768px - 1023px**: Tablet layout (enhanced experience)
- **1024px+**: Desktop layout (optional expanded features)

### ♿ Accessibility Features

- **WCAG AA Compliance**: All color combinations tested and approved
- **Touch Targets**: 60px minimum for primary actions, 44px for secondary
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard-only navigation support
- **Color Contrast**: 4.5:1 minimum for normal text, 3:1 for large text

## Page Structure

The test page is organized into 8 main sections:

### 1. Typography

- Headings (H1-H4) with Inter font
- Timer display with Space Grotesk
- Technical elements with JetBrains Mono
- Body text examples

### 2. Buttons

- Primary actions (Spotlight Orange)
- Secondary actions (Professional Gray)
- Icon buttons with proper sizing
- All variants (outline, ghost, etc.)

### 3. Forms

- Input fields with labels
- Select dropdowns
- Checkboxes and switches
- Form validation patterns

### 4. Timer UI

- Mobile controller view simulation
- Timer display with Space Grotesk
- Primary controls (Play/Pause/Stop)
- Quick adjustments (+1min, +5min, -1min)
- QR code integration area

### 5. Status Indicators

- Connection status (Online/Offline)
- Timer warning states (Success/Warning/Critical/Expired)
- Progress indicators
- Status badges

### 6. Layout Components

- User cards with avatars
- Device preview layouts
- Accessibility compliance indicators
- Responsive grid examples

### 7. Overlay Components

- Dialog modals for settings
- Dropdown menus for quick actions
- Tooltip examples
- Loading states

### 8. Responsive Design

- Mobile-first grid layouts
- Responsive control arrangements
- Breakpoint testing
- Touch-friendly interfaces

## Implementation Guidelines

### ✅ What We Do

- Use only shadcn/ui components from `@/components/ui/`
- Apply brand colors using Tailwind classes
- Create component variants with proper styling
- Maintain accessibility compliance
- Follow mobile-first responsive design
- Use semantic HTML elements
- Include proper ARIA labels and roles

### ❌ What We Don't Do

- Create custom components from scratch
- Override shadcn accessibility features
- Use inline styles (use Tailwind classes)
- Break mobile-first design principles
- Ignore accessibility requirements

## Color Usage Rules

### Primary Actions

```tsx
<Button className='bg-spotlight-orange hover:bg-spotlight-orange-600 text-white'>
  Start Timer
</Button>
```

### Secondary Actions

```tsx
<Button
  variant='outline'
  className='border-professional-gray text-professional-gray'
>
  Settings
</Button>
```

### Warning States

```tsx
<Badge className='bg-timing-yellow text-professional-gray'>
  2 min remaining
</Badge>
```

### Success States

```tsx
<Badge className='bg-success-green text-white'>Connected</Badge>
```

## Typography Implementation

### Timer Display

```tsx
<div className='text-6xl font-timer timer-display'>05:42.3</div>
```

### Technical Elements

```tsx
<code className='font-mono-tech bg-muted px-2 py-1 rounded'>
  cuetimer.io/join/ABC123
</code>
```

### Headings

```tsx
<h1 className='text-4xl font-bold tracking-tight'>Timer Title</h1>
```

## Responsive Patterns

### Mobile-First Grid

```tsx
<div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
  {/* Cards stack on mobile, 2x2 on tablet, 4x1 on desktop */}
</div>
```

### Responsive Controls

```tsx
<div className='flex flex-col sm:flex-row gap-2'>
  <Button className='flex-1 sm:flex-none'>Start</Button>
  <Button variant='outline' className='flex-1 sm:flex-none'>
    Pause
  </Button>
</div>
```

## Testing Checklist

### ✅ Visual Validation

- [ ] All brand colors display correctly
- [ ] Typography follows design system specifications
- [ ] Component variants work as expected
- [ ] Animations are smooth and appropriate

### ✅ Responsive Testing

- [ ] Mobile layout (320px-767px) works correctly
- [ ] Tablet layout (768px-1023px) enhances experience
- [ ] Desktop layout (1024px+) provides optional features
- [ ] Touch targets meet minimum size requirements

### ✅ Accessibility Testing

- [ ] Color contrast ratios meet WCAG AA standards
- [ ] Screen reader announces timer states correctly
- [ ] Keyboard navigation works throughout
- [ ] ARIA labels are descriptive and accurate

### ✅ Component Testing

- [ ] All shadcn/ui components render correctly
- [ ] Component states (hover, focus, disabled) work properly
- [ ] Form validation provides clear feedback
- [ ] Modal dialogs trap focus appropriately

## Usage

Access the design system test page at:

```
/design-system
```

This page provides:

- Live examples of all component implementations
- Interactive testing of responsive behavior
- Validation of brand color application
- Documentation of usage patterns
- Accessibility compliance verification

## Maintenance

This design system test page should be updated whenever:

- New shadcn/ui components are added
- Brand colors or typography change
- Responsive breakpoints are modified
- Accessibility requirements are updated
- Component usage patterns evolve

---

**Note**: This page strictly follows the CueTimer design system requirement to
use only shadcn/ui components. No custom components should be created from
scratch.
