# CueTimer Design System & Brand Guidelines

**Version:** 1.0 **Date:** October 23, 2024 **Status:** Approved for Development

---

## Executive Summary

CueTimer is a mobile-first Progressive Web App (PWA) for event professionals,
providing reliable stage timing with real-time sync and offline-first
capabilities. This document defines the complete brand strategy, visual
identity, and user experience design for the application.

### Target Market (Beachhead)

- **Primary:** Worship Service & Church Tech Directors
- **Secondary:** Corporate Event & Conference Organizers
- **Tertiary:** Professional Speakers & MCs

### Core Differentiation

- **Helpful + Minimalist Professional** approach
- **Mobile-first workflow** (vs. desktop-first competitors)
- **Offline-first reliability** (works when technology doesn't)
- **Frictionless QR Code Join** experience

---

## Brand Strategy

### Brand Positioning Statement

"The helpful, minimalist timer that works when technology doesn't - built by
event professionals who understand that timing is everything, but technology
shouldn't be."

### Brand Architecture

- **Primary Emotion:** Confidence/Calm (not stress)
- **Tone:** Helpful guide (not technical authority)
- **Personality:** Calmly competent, quietly professional
- **Core Values:** Reliability, Simplicity, Professionalism

### Competitive Positioning

- **ProPresenter:** Complex & Premium ($289/year) → Our contrast: Simple &
  Accessible
- **StageTimer.io:** Simple & Freemium (browser-based) → Our contrast:
  Professional & Mobile-first
- **CueTimer:** Helpful & Minimalist Professional (mobile-first PWA)

---

## Visual Identity System

### Color Palette

#### Primary Brand Colors

- **Spotlight Orange:** `#FF6B35` (energy, warmth, visibility, primary actions)
- **Timing Yellow:** `#FFD23F` (attention, optimism, clarity, warnings)
- **Professional Gray:** `#2D3748` (reliable, serious, text, borders)
- **Light Theme Background:** `#FFFFFF` (clean, minimal)
- **Dark Theme Background:** `#1A202C` (focus, professional)

#### Secondary Colors

- **Success Green:** `#48BB78` (timing on track, positive states)
- **Warning Red:** `#F56565` (time critical, negative states)
- **Info Blue:** `#4299E1` (system messages, informational)

#### Color Usage Guidelines

- **Primary Actions:** Spotlight Orange (`#FF6B35`)
- **Secondary Actions:** Professional Gray (`#2D3748`)
- **Warnings:** Timing Yellow (`#FFD23F`) → Warning Red (`#F56565`)
- **Success States:** Success Green (`#48BB78`)
- **Backgrounds:** White (light) / Dark Gray (`#1A202C`) (dark)

### Typography System

#### Font Stack

```css
/* Primary Font - Inter */
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;

/* Secondary Font - Space Grotesk (for timers) */
font-family: 'Space Grotesk', 'Inter', sans-serif;

/* Monospace Font - JetBrains Mono (for technical elements) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Typography Hierarchy

- **Headings (H1-H4):** Inter Bold, tracking -0.02em, line-height 1.2
- **Body Text:** Inter Regular, line-height 1.5, 16px base
- **Timer Display:** Space Grotesk Medium, line-height 1.0
- **UI Elements:** Inter Medium, 14px base
- **Small Text/Captions:** Inter Regular, 12px, line-height 1.4

#### Typography Usage

- **Timer Numbers:** Space Grotesk (clear, technical feel)
- **Interface Labels:** Inter (friendly, approachable)
- **Body Content:** Inter (highly readable)
- **Technical Elements:** JetBrains Mono (code, timestamps)

### Logo System

#### Primary Logo Construction

- **Concept:** Minimal Play + Timer Integration
- **Elements:** Subtle play button triangle with integrated clock hands
- **Lockup:** "CueTimer" in Inter Bold alongside icon
- **Colors:** Spotlight Orange primary, Professional Gray secondary

#### Logo Variations

1. **Horizontal Lockup:** Icon + text side by side (primary)
2. **Stacked Lockup:** Icon above text (mobile applications)
3. **Icon Only:** App icon, favicon usage
4. **Wordmark:** Text only (specific applications)

#### Logo Usage Rules

- **Minimum Size:** 24px height for digital applications
- **Clear Space:** Minimum 0.5x logo height on all sides
- **Background:** Ensure adequate contrast (use dark or light version
  accordingly)
- **Don't:** Stretch, rotate (except 90°), add effects, change colors

---

## User Interface Design

### Design Principles

1. **Mobile-First:** Design for phones first, scale up
2. **Touch-Friendly:** Large targets, clear feedback
3. **Accessibility First:** WCAG AA compliance minimum
4. **Offline-First:** Clear offline/online states
5. **Progressive Enhancement:** Core functionality works everywhere

### Responsive Breakpoints

```css
/* Mobile First Approach */
Mobile: 320px - 767px (primary focus)
Tablet: 768px - 1023px (enhanced experience)
Desktop: 1024px+ (optional expanded features)
```

### Component Library

#### 🚨 **MANDATORY: Use shadcn/ui Components Only**

**NO CUSTOM COMPONENTS SHOULD BE BUILT FROM SCRATCH**

All UI components must use the installed shadcn/ui component library located in
`components/ui/`. This ensures:

- **Consistent Design Language** across the entire application
- **Accessibility Compliance** (WCAG AA built-in)
- **Type Safety** with full TypeScript support
- **Maintainability** with proven component patterns
- **Development Speed** with ready-to-use components

#### Available shadcn/ui Components

The following components are installed and ready for use:

**Core Components:**

- `Button` - Primary, secondary, destructive, outline, ghost variants
- `Card` - Container components with header, content, footer
- `Input` - Form input fields with validation
- `Label` - Form labels with proper accessibility
- `Select` - Dropdown selection with search
- `Checkbox` - Boolean input controls
- `Switch` - Toggle switches
- `Tabs` - Tab navigation system
- `Dialog` - Modal dialogs and overlays
- `Dropdown Menu` - Context menus
- `Progress` - Progress indicators
- `Badge` - Status badges
- `Avatar` - User avatars
- `Separator` - Visual dividers
- `Form` - Form validation components

#### Customization Rules

**DO Customize:**

- **Colors**: Apply brand colors using Tailwind CSS classes
- **Spacing**: Use consistent spacing with Tailwind utilities
- **Typography**: Apply Inter font family using Tailwind classes
- **Sizing**: Adjust component sizes with Tailwind classes
- **Variants**: Create component variants for specific use cases

**DO NOT Create:**

- Custom button components (use `components/ui/button.tsx`)
- Custom card components (use `components/ui/card.tsx`)
- Custom form components (use installed shadcn forms)
- Custom dialog components (use `components/ui/dialog.tsx`)
- Any UI component that shadcn already provides

#### Brand Application Examples

```tsx
// ✅ CORRECT: Using shadcn components with brand colors
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

<Button
  className="bg-orange-500 hover:bg-orange-600 text-white"
  size="lg"
>
  Start Timer
</Button>

<Card className="border-gray-200 shadow-sm">
  <CardHeader>
    <CardTitle className="text-gray-900">Timer Settings</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

// ❌ INCORRECT: Building custom components
export const CustomButton = () => {
  return (
    <button className="bg-orange-500 text-white px-4 py-2">
      {/* This should use shadcn Button instead */}
    </button>
  )
}
```

#### Component Architecture Pattern

1. **Import from shadcn**: Always import from `@/components/ui/`
2. **Apply brand styling**: Use Tailwind classes for brand colors
3. **Extend with variants**: Create custom variants when needed
4. **Maintain accessibility**: Don't override shadcn accessibility features
5. **Consistent patterns**: Follow shadcn component patterns throughout

#### Timer Display

- **Size:** Minimum 60px font size for primary timer
- **Font:** Space Grotesk Medium
- **Color:** Professional Gray (light theme) / White (dark theme)
- **Format:** MM:SS or MM:SS.ss based on precision needed

#### Status Indicators

- **Success:** Success Green, solid background
- **Warning:** Timing Yellow, pulsing animation
- **Critical:** Warning Red, flashing animation
- **Offline:** Gray, dotted border

---

## Screen Designs

### Controller View (Phone/Tablet)

#### Layout Structure

```
┌─────────────────────────┐
│ [Logo]   [Theme Toggle] │ ← Header (56px)
│                         │
│      [Timer Display]    │ ← Timer Area (120px)
│       05:42.3          │
│                         │
│   [PLAY] [PAUSE] [STOP] │ ← Primary Controls (80px)
│   (Orange) (Yellow) (Gray)
│                         │
│   [+1min] [+5min] [-1min]│ ← Quick Adjustments (60px)
│                         │
│   [QR Code Join Here]   │ ← QR Section (140px)
│    cuetimer.io/join/xyz │
│                         │
│   [Messages] [Settings] │ ← Secondary Actions (60px)
└─────────────────────────┘
```

#### Controller Interaction Design

- **Large Touch Targets:** 60px minimum for primary actions
- **Haptic Feedback:** On timer controls (start/stop/pause)
- **Visual Feedback:** Color transitions, button states
- **Swipe Gestures:** Quick time adjustments (swipe up/down)

### Presenter View (Fullscreen Display)

#### Layout Structure (Light Theme)

```
┌─────────────────────────────────┐
│                                 │
│         [Timer Display]         │
│           05:42                 │
│       (120px, Centered)         │
│                                 │
│    [Warning Indicator]          │
│   (Yellow bar at 2min warning)  │
│                                 │
│  [CueTimer Logo - Subtle]       │
│         (bottom center)         │
└─────────────────────────────────┘
```

#### Progressive Warning System

- **5+ minutes:** Success Green background, solid
- **2 minutes remaining:** Timing Yellow background, gentle pulse
- **1 minute remaining:** Spotlight Orange background, moderate pulse
- **30 seconds remaining:** Warning Red background, fast pulse
- **Time expired:** Warning Red background, flashing

#### Presenter Display Features

- **Auto-hide UI elements** after 10 seconds of inactivity
- **Tap to show controls** temporarily
- **Theme detection** (based on device ambient light if available)
- **High contrast mode** for bright stage environments

---

## Accessibility Standards

### Color Contrast (WCAG AA)

- **Normal Text:** 4.5:1 minimum contrast ratio
- **Large Text (18px+):** 3:1 minimum contrast ratio
- **Interactive Elements:** 3:1 minimum contrast ratio
- **Verified Compliance:** All combinations tested and approved

### Screen Reader Support

- **Timer Announcements:** "5 minutes, 42 seconds remaining"
- **Control Labels:** "Start timer, double-tap to activate"
- **Status Updates:** Automatic announcements for state changes
- **Navigation:** Logical reading order, skip links available

### Motor Accessibility

- **Touch Targets:** 60px primary, 44px secondary minimum
- **Voice Control:** "Start timer," "Pause timer," "Add 1 minute"
- **Keyboard Navigation:** Tab order, enter/space activation
- **Switch Control:** Full navigation support

### Cognitive Accessibility

- **Clear Language:** Simple, direct instructions
- **Consistent Patterns:** Predictable interactions
- **Error Prevention:** Confirmations for destructive actions
- **Help Integration:** Contextual assistance available

---

## QR Code Integration

### Branded QR Code Design

- **Primary Colors:** Spotlight Orange and Professional Gray
- **Logo Integration:** Small CueTimer logo in center
- **Border:** Rounded corners with brand colors
- **Error Correction:** High (30%) for reliability

### QR Code Usage

- **Presenter Join:** Generated per session, expires after event
- **Team Access:** Persistent team member QR codes
- **Quick Share:** Custom branded QR for marketing

### QR Code Placement

- **Controller View:** Prominent display, accessible size (140×140px minimum)
- **Print Materials:** High-resolution version for event programs
- **Digital Display:** Animated version for presentation slides

---

## Animation & Micro-interactions

### Timing Transitions

- **Countdown:** Smooth second transitions, no jumping
- **Color Changes:** Gradual transitions between warning states
- **Button Press:** 0.2s ease-out animations
- **Status Updates:** 0.3s fade-in/fade-out

### Loading States

- **Initial Load:** Branded spinner with Spotlight Orange
- **Sync Status:** Rotating sync icon during data transfer
- **Offline Mode:** Clear offline indicator with animation
- **Reconnecting:** Pulsing connection status

### Success/Error Feedback

- **Success:** Green checkmark with brief flash
- **Error:** Red shake animation with clear message
- **Warning:** Yellow bounce with informative tooltip
- **Info:** Blue pulse with contextual help

---

## Technical Specifications

### Font Loading Strategy

```html
<!-- Critical Fonts (Preloaded) -->
<link
  rel="preload"
  href="/fonts/inter-v12-latin-regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/space-grotesk-v15-latin-medium.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- Font Display Strategy -->
font-display: swap; /* Prevents FOUT, improves performance */
```

### CSS Custom Properties

```css
:root {
  /* Brand Colors */
  --brand-orange: #ff6b35;
  --brand-yellow: #ffd23f;
  --brand-gray: #2d3748;
  --success-green: #48bb78;
  --warning-red: #f56565;
  --info-blue: #4299e1;

  /* Theme Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f7fafc;
  --text-primary: #2d3748;
  --text-secondary: #4a5568;

  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-timer: 'Space Grotesk', 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}

[data-theme='dark'] {
  --bg-primary: #1a202c;
  --bg-secondary: #2d3748;
  --text-primary: #ffffff;
  --text-secondary: #e2e8f0;
}
```

### Component Architecture

- **Atomic Design:** Atoms, molecules, organisms, templates
- **Component Naming:** BEM methodology (block\_\_element--modifier)
- **State Management:** CSS custom properties for theming
- **Responsive Design:** Mobile-first media queries

---

## Content Guidelines

### Voice & Tone

- **Helpful Guide:** Knowledgeable but approachable
- **Clear Instructions:** Simple, direct language
- **Encouraging:** Positive reinforcement for user actions
- **Professional:** Industry-appropriate terminology

### Copy Writing Rules

- **Active Voice:** "Start timer" vs. "Timer can be started"
- **Simple Language:** 8th-grade reading level maximum
- **Consistent Terms:** "Timer" not "countdown" or "clock"
- **Context Help:** Brief explanations for technical concepts

### Error Messages

- **Specific:** "Network connection lost" vs. "Error occurred"
- **Actionable:** "Check internet connection and try again"
- **Supportive:** "We'll save your timer and sync when connected"
- **Branded:** Maintain helpful, calm tone even in errors

---

## Implementation Checklist

### Pre-Launch Requirements

- [ ] **All color combinations pass WCAG AA testing**
- [ ] **Touch targets meet 44px minimum requirement**
- [ ] **Font loading optimization implemented**
- [ ] **Offline functionality tested and verified**
- [ ] **Cross-browser compatibility testing completed**
- [ ] **Mobile device testing on various screen sizes**
- [ ] **Accessibility audit with screen readers completed**
- [ ] **Performance optimization (under 3s load time)**
- [ ] **shadcn/ui components properly integrated throughout app**
- [ ] **No custom UI components built from scratch**
- [ ] **Brand colors properly applied to shadcn components**
- [ ] **Component consistency verified across all screens**

### Quality Assurance

- [ ] **Visual consistency across all screens**
- [ ] **Brand guidelines adherence verified**
- [ ] **User testing with target audience completed**
- [ ] **Error handling and edge cases covered**
- [ ] **Documentation for development team created**
- [ ] **shadcn/ui component usage compliance verified**
- [ ] **No custom components found during code review**
- [ ] **Accessibility testing with shadcn components passed**
- [ ] **Mobile responsiveness tested with shadcn components**

---

## Brand Extensions

### Marketing Materials

- **Social Media:** Consistent color palette and typography
- **Business Cards:** Logo lockup, brand colors, contact info
- **Presentations:** Template with brand elements
- **Video Content:** Animated logo, brand colors in graphics

### Partner Co-branding

- **Logo Placement:** Clear hierarchy with partner logos
- **Color Integration:** Maintain primary brand colors
- **Typography:** Consistent with brand guidelines
- **Usage Rights:** Clear guidelines for partner usage

---

## Maintenance & Evolution

### Design System Governance

- **Version Control:** Semantic versioning for updates
- **Documentation:** Living document with change logs
- **Testing:** Regular accessibility and performance audits
- **Feedback Loop:** User feedback integration process

### Evolution Strategy

- **User Feedback:** Regular collection and analysis
- **Market Trends:** Monitor design and accessibility trends
- **Technology Updates:** Regular assessment of new tools/techniques
- **Brand Refresh:** Timeline for potential brand evolution

---

## Appendices

### A. Font Resources

- **Inter:** https://rsms.me/inter/
- **Space Grotesk:** https://fonts.google.com/specimen/Space+Grotesk
- **JetBrains Mono:** https://www.jetbrains.com/lp/mono/

### B. Accessibility Testing Tools

- **Color Contrast:** https://webaim.org/resources/contrastchecker/
- **Screen Reader Testing:** NVDA, VoiceOver, TalkBack
- **Keyboard Navigation:** Full keyboard-only testing
- **Automated Testing:** axe DevTools, Lighthouse

### C. Competitor Analysis Summary

- **ProPresenter:** Enterprise-focused, complex, premium pricing
- **StageTimer.io:** Freemium model, browser-based, German engineering
- **CueTimer Position:** Mobile-first, professional reliability, helpful
  minimalist

### D. User Research Insights

- **Pain Points:** Technology complexity, unreliable connections, presenter
  onboarding
- **Success Factors:** Offline reliability, simple controls, instant sharing
- **User Motivations:** Professional appearance, stress reduction, event success

---

**Document Ownership:** Creative Team **Next Review Date:** 30 days post-launch
**Approval Status:** Approved for Development

---

_This design system serves as the single source of truth for all CueTimer brand
and user experience decisions. All development should reference this document to
ensure consistency and quality._
