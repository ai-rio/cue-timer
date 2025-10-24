# Project Architecture

## Overview

CueTimer follows a modern, scalable architecture built on Next.js 15 with
TypeScript, designed for both web and mobile deployment. This document outlines
the current architecture, design decisions, and future scalability
considerations.

## High-Level Architecture

### Technology Stack Decisions

#### Frontend Framework: Next.js 15 with App Router

**Decision**: Next.js 15 with App Router was chosen for:

- Server-side rendering (SSR) capabilities
- Built-in optimizations for performance
- Seamless API routes integration
- Excellent TypeScript support
- Progressive Web App (PWA) capabilities

#### Mobile Strategy: Ionic React + Capacitor

**Decision**: Ionic React with Capacitor provides:

- Single codebase for web and mobile
- Native performance and capabilities
- Access to device features (camera, notifications, etc.)
- App store deployment ready

#### Styling: Tailwind CSS v4

**Decision**: Tailwind CSS v4 offers:

- Utility-first approach for rapid development
- Consistent design system
- Excellent performance with PostCSS
- Easy customization and theming

#### State Management: React State + Context API

**Current Approach**: Using React's built-in state management

- useState for local component state
- useContext for global state
- Custom hooks for complex state logic
- Planned: Zustand or Redux Toolkit for complex state

#### Database: Supabase (Planned)

**Decision**: Supabase will provide:

- PostgreSQL database
- Real-time subscriptions
- Authentication system
- File storage
- Edge functions

## Current Architecture

### File Structure

```
cue-timer/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Landing page
│   │   └── test/                # Test and demo pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── api/                     # API routes (future)
├── components/                   # Reusable React components
│   ├── ui/                      # Base UI components
│   ├── timer/                   # Timer-specific components
│   └── layout/                  # Layout components
├── lib/                         # Utility functions
│   ├── utils.ts                 # General utilities
│   ├── timer.ts                 # Timer logic
│   └── validation.ts            # Form validation
├── hooks/                       # Custom React hooks
│   ├── use-timer.ts             # Timer functionality
│   ├── use-local-storage.ts     # Local storage management
│   └── use-keyboard.ts          # Keyboard shortcuts
├── types/                       # TypeScript type definitions
│   ├── timer.ts                 # Timer-related types
│   ├── api.ts                   # API response types
│   └── user.ts                  # User-related types
├── i18n.ts                      # Internationalization config
├── middleware.ts                # Next.js middleware for locale
├── messages/                    # Translation files
│   ├── en.json                  # English
│   ├── pt-br.json               # Portuguese (Brazil)
│   ├── es.json                  # Spanish
│   ├── fr.json                  # French
│   └── de.json                  # German
└── public/                      # Static assets
    ├── icons/                   # Favicon and app icons
    └── images/                  # Static images
```

### Component Architecture

#### Component Hierarchy

```
app/
├── layout.tsx                   # Root layout with providers
│   ├── LocaleProvider          # Internationalization
│   ├── ThemeProvider           # Dark/light mode
│   └── AuthProvider            # Authentication (future)
└── [locale]/
    ├── layout.tsx              # Locale-specific layout
    │   ├── Header              # Navigation header
    │   ├── Footer              # Footer component
    │   └── Main                # Main content area
    └── page.tsx                # Landing page
        ├── Hero                # Hero section
        ├── Features            # Feature highlights
        ├── Demo                # Timer demonstration
        └── CTA                 # Call-to-action
```

#### Component Design Patterns

**1. Compound Components**

```typescript
// Timer component with compound pattern
const Timer = ({ children, ...props }) => {
  const [time, setTime] = useState(0);

  return (
    <TimerContext.Provider value={{ time, setTime }}>
      <div {...props}>{children}</div>
    </TimerContext.Provider>
  );
};

Timer.Display = TimerDisplay;
Timer.Controls = TimerControls;
Timer.Settings = TimerSettings;

// Usage
<Timer>
  <Timer.Display />
  <Timer.Controls />
  <Timer.Settings />
</Timer>
```

**2. Custom Hooks for Logic**

```typescript
// useTimer hook
export const useTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  // Timer logic implementation

  return { time, isRunning, start, stop, reset };
};
```

**3. Render Props Pattern**

```typescript
// Flexible timer component
const FlexibleTimer = ({ children }) => {
  const timerState = useTimer();

  return <>{children(timerState)}</>;
};

// Usage
<FlexibleTimer>
  {({ time, isRunning, start, stop }) => (
    <div>
      <div>{formatTime(time)}</div>
      <button onClick={isRunning ? stop : start}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  )}
</FlexibleTimer>
```

### State Management Architecture

#### Current State Management

```typescript
// Local state with custom hooks
const TimerComponent = () => {
  const { time, isRunning, start, stop, reset } = useTimer(300);
  const { theme, toggleTheme } = useTheme();
  const { t, locale } = useTranslation();

  return (
    // Component JSX
  );
};

// Context for global state
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <AppContext.Provider value={{ user, settings, setUser, setSettings }}>
      {children}
    </AppContext.Provider>
  );
};
```

#### Planned State Management Enhancements

- **Zustand** for complex global state
- **React Query** for server state management
- **Form state** with React Hook Form

### API Architecture

#### Current API Structure

```typescript
// API routes structure (planned)
app/api/
├── auth/
│   ├── login/
│   ├── logout/
│   └── register/
├── timers/
│   ├── route.ts               # GET /api/timers
│   ├── [id]/
│   │   ├── route.ts           # GET/PUT/DELETE /api/timers/[id]
│   │   └── start/
│   │       └── route.ts       # POST /api/timers/[id]/start
└── users/
    ├── profile/
    └── settings/
```

#### API Design Principles

- RESTful endpoints with conventional HTTP methods
- Consistent response format
- Proper error handling with status codes
- Request validation with Zod schemas
- OpenAPI documentation with Swagger

### Data Flow Architecture

#### Client-Side Data Flow

```
User Action → Component Event → Custom Hook → State Update → UI Re-render
```

#### Server-Side Data Flow (Planned)

```
User Action → API Route → Validation → Business Logic → Database → Response
```

#### Real-Time Updates (Planned)

```
Database Change → Supabase Real-time → Client Subscription → UI Update
```

## Security Architecture

### Current Security Measures

1. **Content Security Policy**: Configured in Next.js headers
2. **XSS Protection**: Built-in React protections
3. **HTTPS Enforcement**: Production deployment requirement
4. **Input Validation**: Client-side validation with Zod

### Planned Security Enhancements

1. **Authentication**: Supabase Auth with JWT tokens
2. **Authorization**: Role-based access control (RBAC)
3. **API Security**: Rate limiting and request validation
4. **Data Encryption**: Encrypted sensitive data at rest

## Performance Architecture

### Current Optimizations

1. **Next.js Optimizations**:
   - Automatic code splitting
   - Image optimization
   - Font optimization
   - Bundle analysis

2. **React Optimizations**:
   - React.memo for expensive components
   - useMemo for expensive calculations
   - useCallback for stable function references

3. **CSS Optimizations**:
   - Tailwind CSS purging
   - Critical CSS inlining
   - CSS minification

### Performance Monitoring

- **Web Vitals**: Core Web Vitals tracking
- **Bundle Analysis**: Built-in Next.js bundle analyzer
- **Performance Budgets**: Set up for bundle sizes
- **Lighthouse CI**: Automated performance testing

## Internationalization Architecture

### Current i18n Implementation

```typescript
// i18n configuration
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
}));

// Middleware for locale detection
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'pt-br', 'es', 'fr', 'de'],
  defaultLocale: 'en',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### Translation Structure

```json
// messages/en.json
{
  "common": {
    "start": "Start",
    "stop": "Stop",
    "reset": "Reset"
  },
  "timer": {
    "title": "Presentation Timer",
    "description": "Professional timer for presentations"
  },
  "navigation": {
    "home": "Home",
    "features": "Features",
    "pricing": "Pricing"
  }
}
```

## Mobile Architecture

### Capacitor Configuration

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cuetimer.app',
  appName: 'CueTimer',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
    },
  },
};

export default config;
```

### Mobile-Specific Features

- **Offline Support**: Service worker for PWA capabilities
- **Native Features**: Camera, notifications, haptic feedback
- **App Store Deployment**: Ready for iOS and Android stores

## Testing Architecture

### Current Testing Setup

```typescript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

### Testing Strategy

1. **Unit Tests**: Component and utility function testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: Full user journey testing (planned)
4. **Visual Testing**: Screenshot testing with Percy (planned)

## Deployment Architecture

### Current Deployment

- **Development**: Local development with Next.js dev server
- **Staging**: Vercel preview deployments (planned)
- **Production**: Vercel hosting (planned)

### Deployment Pipeline (Planned)

1. **Code Push**: GitHub repository
2. **CI/CD**: GitHub Actions
3. **Testing**: Automated test suite
4. **Build**: Next.js production build
5. **Deploy**: Vercel automatic deployment
6. **Monitoring**: Performance and error tracking

## Future Architecture Enhancements

### Short-term (Next 3 months)

1. **Supabase Integration**: Complete database and auth setup
2. **Real-time Features**: WebSocket connections for live sync
3. **Advanced Timer Features**: Multiple timers, presets, sharing
4. **User Accounts**: Registration, profiles, settings

### Medium-term (3-6 months)

1. **Mobile App**: Full Capacitor deployment
2. **Offline Support**: Advanced PWA features
3. **Analytics**: User behavior tracking
4. **API v2**: Expanded API capabilities

### Long-term (6+ months)

1. **Microservices**: Split into specialized services
2. **Advanced Features**: AI-powered suggestions, team collaboration
3. **Enterprise Features**: Team management, advanced reporting
4. **Global Deployment**: Multi-region deployment

## Architecture Decision Records (ADRs)

### ADR-001: Next.js App Router

**Decision**: Use Next.js 15 with App Router **Status**: Accepted
**Consequences**: Modern React patterns, improved performance, learning curve

### ADR-002: Tailwind CSS v4

**Decision**: Adopt Tailwind CSS v4 over v3 **Status**: Accepted
**Consequences**: Latest features, improved performance, migration required

### ADR-003: TypeScript Strict Mode

**Decision**: Enable TypeScript strict mode **Status**: Accepted
**Consequences**: Better type safety, initial development overhead

### ADR-004: Bun Package Manager

**Decision**: Use Bun over npm/yarn **Status**: Accepted **Consequences**:
Faster installs, new ecosystem, compatibility considerations

## Architecture Metrics

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Code Quality Metrics

- **TypeScript Coverage**: > 95%
- **Test Coverage**: > 80%
- **ESLint Rules**: Zero warnings
- **Bundle Size**: < 500KB (initial)

### Accessibility Targets

- **WCAG 2.1 AA**: Full compliance
- **Keyboard Navigation**: 100% accessible
- **Screen Reader**: Full support
- **Color Contrast**: AA compliant

---

**Last Updated:** 2025-10-23 **Maintained by:** Architecture Team **Review
Frequency:** Quarterly **Next Review:** 2025-01-23
