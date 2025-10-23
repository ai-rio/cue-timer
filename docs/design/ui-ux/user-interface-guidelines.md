# CueTimer User Interface Guidelines

**Version:** 1.0
**Date:** October 23, 2024
**Category:** Design → UI/UX
**Status:** Approved for Development

---

## Overview

This document defines the user interface guidelines for CueTimer, ensuring consistent, accessible, and mobile-first experiences across all touchpoints.

---

## Design Philosophy

### Core Principles
1. **Mobile-First**: Design for phones first, scale up
2. **Touch-Friendly**: Large targets, clear feedback
3. **Accessibility First**: WCAG AA compliance minimum
4. **Offline-First**: Clear offline/online states
5. **Progressive Enhancement**: Core functionality works everywhere

### User Goals
- **Event Managers**: Control timing confidently, manage presenters
- **Presenters**: Stay on time, clear visual feedback, minimal distraction
- **Team Members**: Real-time sync, reliable updates, simple sharing

---

## Screen Architecture

### Controller View (Primary Interface)

#### Layout Structure
```
┌─────────────────────────┐
│ [Logo]   [Theme Toggle] │ ← Header (56px height)
│                         │
│      [Timer Display]    │ ← Timer Area (120px min)
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

#### Controller Components

**Header (56px)**
- Logo left-aligned (32px height)
- Theme toggle right-aligned (touch-friendly)
- Background: Current theme primary color
- Border: Bottom border with secondary color

**Timer Display (120px minimum)**
- Large timer display centered
- Font: Space Grotesk Medium
- Color: Text primary based on theme
- Background: Theme primary background
- Size: Responsive based on screen (60px-120px)

**Primary Controls (80px height)**
- Three main action buttons
- Minimum 60px width each
- 12px spacing between buttons
- Colors: Orange (Play), Yellow (Pause), Gray (Stop)

**Quick Adjustments (60px height)**
- Preset time adjustment buttons
- [+1min] [+5min] [-1min] layout
- Secondary button styling
- Clear labels with icons

**QR Code Section (140px height)**
- Branded QR code (140×140px minimum)
- Session URL displayed below QR
- "Tap to copy" functionality
- Session status indicator

**Secondary Actions (60px height)**
- Messages button (notification badge)
- Settings button (gear icon)
- Bottom of screen, easy thumb access

### Presenter View (Fullscreen Display)

#### Layout Structure
```
┌─────────────────────────────────┐
│                                 │
│         [Timer Display]         │
│           05:42                 │
│       (120px, Centered)         │
│                                 │
│    [Warning Indicator]          │
│   (Color bar at warning times)  │
│                                 │
│  [CueTimer Logo - Subtle]       │
│         (20px, bottom center)   │
└─────────────────────────────────┘
```

#### Presenter Features

**Timer Display**
- Large, centered timer display
- Responsive sizing (up to 25% screen height)
- High contrast for visibility
- Current time display option

**Warning System**
- Color-coded background transitions
- Progressive warning states
- Subtle pulse animations for warnings
- Non-intrusive positioning

**Auto-Hide Controls**
- Controls hide after 10 seconds
- Tap anywhere to show temporarily
- Settings accessible via long-press
- Gesture-based interaction

---

## Component Library

### Buttons

#### Primary Buttons
```css
.ct-btn-primary {
  background-color: var(--brand-orange);
  color: white;
  height: 48px;
  min-width: 120px;
  border-radius: 8px;
  font-family: var(--font-primary);
  font-weight: 500;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.ct-btn-primary:hover {
  background-color: #E55A2B;
  transform: translateY(-1px);
}

.ct-btn-primary:active {
  transform: translateY(0);
}
```

#### Secondary Buttons
```css
.ct-btn-secondary {
  background-color: transparent;
  color: var(--brand-gray);
  height: 44px;
  min-width: 100px;
  border: 2px solid var(--brand-gray);
  border-radius: 8px;
  font-family: var(--font-primary);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-out;
}
```

#### Icon Buttons
```css
.ct-btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-out;
}
```

### Timer Display

#### Primary Timer
```css
.ct-timer-display {
  font-family: var(--font-timer);
  font-weight: 500;
  font-size: clamp(60px, 10vw, 120px);
  line-height: 1.0;
  color: var(--text-primary);
  text-align: center;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
```

#### Timer States
```css
.ct-timer--warning {
  color: var(--brand-yellow);
  animation: pulse-warning 2s infinite;
}

.ct-timer--critical {
  color: var(--warning-red);
  animation: pulse-critical 1s infinite;
}

.ct-timer--expired {
  color: var(--warning-red);
  animation: flash-expired 0.5s infinite;
}
```

### Status Indicators

#### Connection Status
```css
.ct-status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

.ct-status--online {
  background-color: var(--success-green);
}

.ct-status--offline {
  background-color: var(--brand-gray);
  border: 2px dotted currentColor;
}

.ct-status--syncing {
  background-color: var(--brand-yellow);
  animation: spin 1s linear infinite;
}
```

---

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
.ct-container {
  padding: 0 16px;
  max-width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .ct-container {
    padding: 0 24px;
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .ct-container {
    padding: 0 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Mobile Optimizations

#### Touch Targets
- **Primary Actions:** 60px minimum
- **Secondary Actions:** 44px minimum
- **Icon Buttons:** 44px × 44px minimum
- **Spacing:** 8px minimum between touch targets

#### Safe Areas
```css
.ct-safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

#### Viewport Meta
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

---

## Animation & Transitions

### Timing Transitions
```css
.ct-countdown-transition {
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.ct-state-change {
  transition: background-color 0.5s ease-out, color 0.3s ease-out;
}
```

### Warning Animations
```css
@keyframes pulse-warning {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes pulse-critical {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
}

@keyframes flash-expired {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
```

### Loading States
```css
.ct-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--bg-secondary);
  border-top: 3px solid var(--brand-orange);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## Accessibility Guidelines

### Color Contrast
- **Normal Text:** 4.5:1 minimum contrast ratio
- **Large Text (18px+):** 3:1 minimum contrast ratio
- **Interactive Elements:** 3:1 minimum contrast ratio
- **Verified:** All combinations tested and approved

### Screen Reader Support
```html
<!-- Timer Display -->
<div class="ct-timer-display" role="timer" aria-live="polite">
  <span aria-label="5 minutes, 42 seconds remaining">05:42</span>
</div>

<!-- Control Buttons -->
<button class="ct-btn-primary" aria-label="Start timer">
  <span aria-hidden="true">▶</span>
  <span class="sr-only">Start</span>
</button>
```

### Focus Management
```css
.ct-focusable:focus {
  outline: 3px solid var(--brand-orange);
  outline-offset: 2px;
}

.ct-focusable:focus:not(:focus-visible) {
  outline: none;
}
```

### Keyboard Navigation
- **Tab Order:** Logical left-to-right, top-to-bottom
- **Enter/Space:** Activate buttons and controls
- **Arrow Keys:** Navigate between options
- **Escape:** Close modals, return to previous state

---

## Error States & Validation

### Connection Issues
```css
.ct-offline-indicator {
  background-color: var(--brand-gray);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slide-down 0.3s ease-out;
}
```

### Form Validation
```css
.ct-input-error {
  border-color: var(--warning-red);
  background-color: rgba(245, 101, 101, 0.1);
}

.ct-error-message {
  color: var(--warning-red);
  font-size: 14px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
```

### Empty States
```css
.ct-empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
}

.ct-empty-state-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}
```

---

## Performance Considerations

### Critical CSS
- Inline critical above-the-fold styles
- Load non-critical CSS asynchronously
- Optimize for first contentful paint

### Image Optimization
- Use WebP format with fallbacks
- Implement lazy loading for non-critical images
- Compress images to appropriate sizes

### Animation Performance
- Use transform and opacity for animations
- Avoid animating layout properties
- Implement will-change property judiciously

---

## Testing Guidelines

### Cross-Browser Testing
- **Mobile Browsers:** Safari (iOS), Chrome (Android)
- **Desktop Browsers:** Chrome, Firefox, Safari, Edge
- **Progressive Enhancement:** Core functionality works everywhere

### Device Testing
- **Small Phones:** iPhone SE, Android Mini
- **Standard Phones:** iPhone, standard Android
- **Tablets:** iPad, Android tablets
- **Large Screens:** Desktop displays

### Accessibility Testing
- **Screen Readers:** VoiceOver, TalkBack, NVDA
- **Keyboard Navigation:** Full keyboard-only testing
- **Color Contrast:** Automated tools + visual verification
- **Voice Control:** Siri, Google Assistant integration

---

## Implementation Checklist

### Pre-Launch Requirements
- [ ] All touch targets meet minimum size requirements
- [ ] Color contrast passes WCAG AA testing
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announcements are accurate and helpful
- [ ] Responsive design works across all breakpoints
- [ ] Loading states are clear and branded
- [ ] Error states provide actionable guidance
- [ ] Performance optimization under 3 seconds load time

### Quality Assurance
- [ ] Cross-browser compatibility verified
- [ ] Device testing on target platforms
- [ ] Accessibility audit completed
- [ ] User flow testing with target audience
- [ ] Offline functionality verified
- [ ] Animation performance tested
- [ ] Error handling and edge cases covered

---

**Related Documents:**
- [Design System](../branding/design-system.md)
- [Technical Specifications](../technical-specs/system-architecture.md)
- [Accessibility Guidelines](../technical-specs/accessibility-requirements.md)

---

**Document Ownership:** UI/UX Design Team
**Next Review:** Before each major release
**Approval Status:** Approved for Development