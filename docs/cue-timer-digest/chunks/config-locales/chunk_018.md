# Chunk 18: config_locales

## Metadata

- **Files**: 26
- **Size**: 31,893 characters (~7,973 tokens)
- **Categories**: config

## Files in this chunk

- `locales/en/presentations.json`
- `locales/en/pricing.json`
- `locales/en/settings.json`
- `locales/en/support.json`
- `locales/en/timer.json`
- `locales/es/about.json`
- `locales/es/auth.json`
- `locales/es/billing.json`
- `locales/es/blog.json`
- `locales/es/common.json`
- `locales/es/dashboard.json`
- `locales/es/errors.json`
- `locales/es/events.json`
- `locales/es/hero.json`
- `locales/es/navigation.json`
- `locales/es/presentations.json`
- `locales/es/pricing.json`
- `locales/es/settings.json`
- `locales/es/support.json`
- `locales/es/timer.json`
- `locales/fr/about.json`
- `locales/fr/auth.json`
- `locales/fr/billing.json`
- `locales/fr/blog.json`
- `locales/fr/common.json`
- `locales/fr/dashboard.json`

---

## File: `locales/en/presentations.json`

```json
{
  "title": "Presentations",
  "description": "Manage presentation schedules and timing",
  "create": {
    "title": "Create Presentation",
    "name": "Presentation Title",
    "namePlaceholder": "Keynote: Future of Technology",
    "speaker": "Speaker",
    "speakerPlaceholder": "John Smith",
    "description": "Description",
    "descriptionPlaceholder": "An overview of emerging technology trends",
    "duration": "Duration",
    "startTime": "Start Time",
    "endTime": "End Time",
    "room": "Room/Stage",
    "roomPlaceholder": "Main Stage",
    "type": "Presentation Type",
    "types": {
      "keynote": "Keynote",
      "talk": "Talk",
      "workshop": "Workshop",
      "panel": "Panel Discussion",
      "lightning": "Lightning Talk",
      "tutorial": "Tutorial"
    }
  },
  "segments": {
    "title": "Presentation Segments",
    "add": "Add Segment",
    "remove": "Remove Segment",
    "name": "Segment Name",
    "duration": "Duration",
    "warnings": "Enable Warnings",
    "preset": "Use Preset",
    "presets": {
      "standard": "Standard Presentation",
      "withQA": "With Q&A",
      "workshop": "Workshop Format",
      "panel": "Panel Discussion",
      "lightning": "Lightning Talk"
    }
  },
  "details": {
    "title": "Presentation Details",
    "speaker": "Speaker",
    "duration": "Duration",
    "startTime": "Start Time",
    "endTime": "End Time",
    "room": "Location",
    "status": "Status",
    "segments": "Segments"
  },
  "actions": {
    "create": "Create Presentation",
    "edit": "Edit Presentation",
    "delete": "Delete Presentation",
    "duplicate": "Duplicate Presentation",
    "start": "Start Presentation",
    "joinAsPresenter": "Join as Presenter",
    "joinAsController": "Join as Timer Controller",
    "viewAsAudience": "View as Audience"
  },
  "status": {
    "scheduled": "Scheduled",
    "ready": "Ready",
    "running": "Running",
    "paused": "Paused",
    "completed": "Completed",
    "cancelled": "Cancelled"
  },
  "realtime": {
    "connected": "Connected to timer",
    "disconnected": "Disconnected from timer",
    "reconnecting": "Reconnecting...",
    "syncStatus": "Sync Status",
    "lastUpdate": "Last Update",
    "participants": "Participants"
  }
}
```

## File: `locales/en/pricing.json`

```json
{
  "title": "Pricing",
  "subtitle": "Choose the perfect plan for your needs",
  "monthly": "Monthly",
  "yearly": "Yearly",
  "save": "Save",
  "popular": "Popular",
  "current": "Current",
  "features": {
    "basicTimers": "Basic Timers",
    "unlimitedEvents": "Unlimited Events",
    "realTimeSync": "Real-time Sync",
    "advancedAnalytics": "Advanced Analytics",
    "prioritySupport": "Priority Support",
    "customBranding": "Custom Branding",
    "apiAccess": "API Access",
    "teamCollaboration": "Team Collaboration"
  },
  "plans": {
    "free": {
      "name": "Free",
      "price": "$0",
      "description": "Perfect for getting started"
    },
    "pro": {
      "name": "Pro",
      "price": "$9",
      "description": "For professional presenters"
    },
    "enterprise": {
      "name": "Enterprise",
      "price": "Custom",
      "description": "For large organizations"
    }
  }
}
```

## File: `locales/en/settings.json`

```json
{
  "title": "Settings",
  "profile": "Profile",
  "account": "Account",
  "preferences": "Preferences",
  "notifications": "Notifications",
  "security": "Security",
  "billing": "Billing",
  "language": "Language",
  "theme": "Theme",
  "timezone": "Timezone",
  "darkMode": "Dark Mode",
  "lightMode": "Light Mode",
  "systemMode": "System",
  "emailNotifications": "Email Notifications",
  "pushNotifications": "Push Notifications",
  "changePassword": "Change Password",
  "twoFactorAuth": "Two-Factor Authentication",
  "deleteAccount": "Delete Account",
  "saveChanges": "Save Changes"
}
```

## File: `locales/en/support.json`

```json
{
  "title": "Support",
  "helpCenter": "Help Center",
  "contactUs": "Contact Us",
  "documentation": "Documentation",
  "faq": "Frequently Asked Questions",
  "tutorials": "Tutorials",
  "community": "Community",
  "reportIssue": "Report an Issue",
  "featureRequest": "Request a Feature",
  "subject": "Subject",
  "message": "Message",
  "send": "Send Message",
  "searchHelp": "Search for help",
  "category": "Category",
  "priority": "Priority",
  "low": "Low",
  "medium": "Medium",
  "high": "High",
  "urgent": "Urgent"
}
```

## File: `locales/en/timer.json`

```json
{
  "title": "Timer",
  "description": "Professional timing controls",
  "controls": {
    "start": "Start",
    "pause": "Pause",
    "stop": "Stop",
    "reset": "Reset",
    "resume": "Resume",
    "addTime": "Add Time",
    "removeTime": "Remove Time"
  },
  "display": {
    "timeRemaining": "Time Remaining",
    "timeElapsed": "Time Elapsed",
    "totalTime": "Total Time",
    "currentSegment": "Current Segment",
    "nextSegment": "Next Segment"
  },
  "segments": {
    "presentation": "Presentation",
    "questions": "Q&A",
    "break": "Break",
    "setup": "Setup",
    "introduction": "Introduction",
    "conclusion": "Conclusion",
    "networking": "Networking"
  },
  "warnings": {
    "fiveMinutes": "5 minutes remaining",
    "twoMinutes": "2 minutes remaining",
    "oneMinute": "1 minute remaining",
    "thirtySeconds": "30 seconds remaining",
    "tenSeconds": "10 seconds remaining",
    "timeUp": "Time's up!",
    "overtime": "Overtime"
  },
  "presenterMessages": {
    "startNow": "Please begin your presentation",
    "wrapUp": "Please begin to wrap up",
    "finishNow": "Time is up, please finish",
    "questionsStart": "Time for questions",
    "questionsEnd": "Q&A time is over"
  },
  "states": {
    "ready": "Ready",
    "running": "Running",
    "paused": "Paused",
    "finished": "Finished",
    "overtime": "Overtime"
  },
  "settings": {
    "enableSounds": "Enable Sounds",
    "enableVibrations": "Enable Vibrations",
    "enableWarnings": "Enable Time Warnings",
    "presenterView": "Presenter View",
    "audienceView": "Audience View"
  }
}
```

## File: `locales/es/about.json`

```json
{
  "title": "Acerca de CueTimer",
  "subtitle": "Soluciones de cronometraje profesional para profesionales de eventos que demandan fiabilidad y simplicidad.",
  "mission": {
    "title": "Nuestra Misión",
    "description": "Proporcionar a los profesionales de eventos la solución de cronometraje más fiable e intuitiva que funciona impecablemente tanto en línea como sin conexión, garantizando que cada presentación se desarrolle sin problemas."
  },
  "vision": {
    "title": "Nuestra Visión",
    "description": "Convertirnos en el estándar de la industria para la tecnología de cronometraje de eventos, confiable por profesionales de todo el mundo por su simplicidad, fiabilidad y características innovadoras."
  },
  "team": {
    "title": "Desarrollado por Profesionales de Eventos",
    "description": "Entendemos los desafíos de los eventos en vivo porque hemos estado allí. Nuestro equipo combina décadas de experiencia en gestión de eventos con tecnología de vanguardia para ofrecer soluciones que realmente funcionan en el terreno."
  }
}
```

## File: `locales/es/auth.json`

```json
{
  "title": "Authentication",
  "login": "Login",
  "signup": "Sign Up",
  "logout": "Logout",
  "email": "Email",
  "password": "Password",
  "confirmPassword": "Confirm Password",
  "forgotPassword": "Forgot Password?",
  "rememberMe": "Remember me",
  "signInPrompt": "Sign in to your account",
  "createAccountPrompt": "Create your account",
  "noAccount": "Don't have an account?",
  "alreadyHaveAccount": "Already have an account?",
  "signIn": "Sign In",
  "signUp": "Sign Up",
  "resetPassword": "Reset Password",
  "createNewPassword": "Create New Password"
}
```

## File: `locales/es/billing.json`

```json
{
  "title": "Billing",
  "subscription": "Subscription",
  "paymentMethod": "Payment Method",
  "invoices": "Invoices",
  "usage": "Usage",
  "currentPlan": "Current Plan",
  "upgradePlan": "Upgrade Plan",
  "downgradePlan": "Downgrade Plan",
  "cancelSubscription": "Cancel Subscription",
  "reactivateSubscription": "Reactivate Subscription",
  "addPaymentMethod": "Add Payment Method",
  "removePaymentMethod": "Remove Payment Method",
  "billingHistory": "Billing History",
  "nextBillingDate": "Next Billing Date",
  "amount": "Amount",
  "status": "Status",
  "paid": "Paid",
  "pending": "Pending",
  "failed": "Failed"
}
```

## File: `locales/es/blog.json`

```json
{
  "meta": {
    "title": "Blog CueTimer - Consejos de Temporización de Eventos y Productividad",
    "description": "Lee los últimos artículos sobre gestión de eventos, optimización de temporizadores y consejos de presentación profesional de los expertos CueTimer."
  },
  "title": "Blog CueTimer",
  "subtitle": "Insights de expertos sobre temporización de eventos, productividad y habilidades de presentación profesional. Aprende de expertos del sector y lleva tus eventos al siguiente nivel.",
  "loading": "Cargando publicaciones del blog...",
  "error": "Error al cargar publicaciones del blog",
  "empty": "No se encontraron publicaciones del blog.",
  "featured": "Destacado",
  "minRead": "min de lectura",
  "readMore": "Leer Más",
  "backToBlog": "Volver al Blog",
  "relatedPosts": "Publicaciones Relacionadas",
  "navigation": {
    "previous": "Publicación Anterior",
    "next": "Siguiente Publicación"
  },
  "categories": {
    "timing": "Temporización",
    "productivity": "Productividad",
    "events": "Eventos",
    "features": "Características",
    "tutorials": "Tutoriales",
    "industry": "Sector"
  },
  "filter": {
    "searchPlaceholder": "Buscar publicaciones del blog...",
    "categoryLabel": "Categoría",
    "allCategories": "Todas las Categorías",
    "featuredOnly": "Solo Destacados",
    "clearFilters": "Limpiar Filtros",
    "activeFilters": "Filtros Activos"
  }
}
```

## File: `locales/es/common.json`

```json
{
  "hero": {
    "title": "CueTimer",
    "subtitle": "Professional presentation timer platform with real-time synchronization for perfect event timing.",
    "getStarted": "Get Started"
  },
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "events": "Events",
    "timers": "Timers",
    "pricing": "Pricing",
    "blog": "Blog",
    "about": "About",
    "contact": "Contact",
    "login": "Login",
    "signup": "Sign Up",
    "logout": "Logout",
    "profile": "Profile",
    "settings": "Settings",
    "backToHome": "Back to Home"
  },
  "auth": {
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "firstName": "First Name",
    "lastName": "Last Name",
    "emailPlaceholder": "your@email.com",
    "passwordPlaceholder": "••••••••",
    "confirmPasswordPlaceholder": "••••••••",
    "firstNamePlaceholder": "John",
    "lastNamePlaceholder": "Doe",
    "signInPrompt": "Sign in to continue",
    "createAccountPrompt": "Create your free account",
    "noAccount": "Don't have an account?",
    "alreadyHaveAccount": "Already have an account?",
    "rememberMe": "Remember me",
    "forgotPassword": "Forgot password?",
    "continueWithGoogle": "Continue with Google",
    "continueWithMicrosoft": "Continue with Microsoft"
  },
  "actions": {
    "getStarted": "Get Started Free",
    "startFree": "Start Free",
    "buyNow": "Buy Now",
    "upgrade": "Upgrade",
    "downgrade": "Downgrade",
    "cancel": "Cancel",
    "save": "Save",
    "edit": "Edit",
    "delete": "Delete",
    "view": "View",
    "download": "Download",
    "upload": "Upload",
    "submit": "Submit",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "close": "Close",
    "confirm": "Confirm",
    "continue": "Continue",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "learnMore": "Learn more",
    "startTimer": "Start Timer",
    "pauseTimer": "Pause Timer",
    "stopTimer": "Stop Timer",
    "resetTimer": "Reset Timer",
    "resumeTimer": "Resume Timer"
  },
  "ui": {
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Operation completed successfully",
    "retry": "Try again",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "close": "Close",
    "search": "Search",
    "filter": "Filter",
    "sort": "Sort",
    "clear": "Clear",
    "select": "Select",
    "selectAll": "Select all",
    "none": "None",
    "all": "All",
    "yes": "Yes",
    "no": "No",
    "ok": "OK",
    "help": "Help",
    "learnMore": "Learn more"
  },
  "status": {
    "active": "Active",
    "inactive": "Inactive",
    "pending": "Pending",
    "completed": "Completed",
    "failed": "Failed",
    "cancelled": "Cancelled",
    "expired": "Expired",
    "processing": "Processing",
    "draft": "Draft",
    "published": "Published",
    "archived": "Archived",
    "running": "Running",
    "paused": "Paused",
    "stopped": "Stopped"
  },
  "time": {
    "now": "Now",
    "today": "Today",
    "yesterday": "Yesterday",
    "tomorrow": "Tomorrow",
    "thisWeek": "This week",
    "lastWeek": "Last week",
    "nextWeek": "Next week",
    "thisMonth": "This month",
    "lastMonth": "Last month",
    "nextMonth": "Next month",
    "thisYear": "This year",
    "lastYear": "Last year",
    "ago": "ago",
    "in": "in",
    "seconds": "seconds",
    "minutes": "minutes",
    "hours": "hours",
    "days": "days",
    "weeks": "weeks",
    "months": "months",
    "years": "years",
    "second": "second",
    "minute": "minute",
    "hour": "hour",
    "day": "day"
  },
  "units": {
    "currency": "$",
    "percent": "%",
    "items": "items",
    "item": "item",
    "users": "users",
    "user": "user",
    "files": "files",
    "file": "file",
    "pages": "pages",
    "page": "page",
    "events": "events",
    "event": "event",
    "timers": "timers",
    "timer": "timer"
  }
}
```

## File: `locales/es/dashboard.json`

```json
{
  "title": "Dashboard",
  "welcome": "Welcome back",
  "overview": "Overview",
  "recentActivity": "Recent Activity",
  "quickActions": "Quick Actions",
  "statistics": "Statistics",
  "events": "Events",
  "timers": "Timers",
  "totalEvents": "Total Events",
  "totalTimers": "Total Timers",
  "activeTimers": "Active Timers",
  "upcomingEvents": "Upcoming Events"
}
```

## File: `locales/es/errors.json`

```json
{
  "title": "Errors",
  "pageNotFound": "Page Not Found",
  "serverError": "Server Error",
  "networkError": "Network Error",
  "validationError": "Validation Error",
  "authenticationError": "Authentication Error",
  "authorizationError": "Authorization Error",
  "unknownError": "Unknown Error",
  "messages": {
    "pageNotFound": "The page you're looking for doesn't exist.",
    "serverError": "Something went wrong on our end. Please try again later.",
    "networkError": "Please check your internet connection and try again.",
    "validationError": "Please check your input and try again.",
    "authenticationError": "Please sign in to continue.",
    "authorizationError": "You don't have permission to access this resource.",
    "unknownError": "An unexpected error occurred. Please try again."
  },
  "actions": {
    "goHome": "Go Home",
    "retry": "Try Again",
    "reload": "Reload Page",
    "contactSupport": "Contact Support"
  }
}
```

## File: `locales/es/events.json`

```json
{
  "title": "Events",
  "description": "Manage your events and presentations",
  "create": {
    "title": "Create Event",
    "name": "Event Name",
    "namePlaceholder": "Annual Conference 2024",
    "description": "Description",
    "descriptionPlaceholder": "Annual company conference with multiple speakers",
    "date": "Event Date",
    "time": "Event Time",
    "location": "Location",
    "locationPlaceholder": "Conference Center Main Hall",
    "type": "Event Type",
    "types": {
      "conference": "Conference",
      "meeting": "Meeting",
      "webinar": "Webinar",
      "workshop": "Workshop",
      "presentation": "Presentation",
      "training": "Training Session"
    },
    "timezone": "Timezone",
    "maxDuration": "Maximum Duration",
    "speakers": "Speakers",
    "addSpeaker": "Add Speaker"
  },
  "details": {
    "eventName": "Event Name",
    "eventType": "Event Type",
    "date": "Date",
    "time": "Time",
    "location": "Location",
    "duration": "Duration",
    "status": "Status",
    "speakers": "Speakers",
    "timers": "Timers",
    "attendees": "Attendees"
  },
  "list": {
    "upcoming": "Upcoming Events",
    "past": "Past Events",
    "all": "All Events",
    "noEvents": "No events found",
    "createFirst": "Create your first event"
  },
  "actions": {
    "createEvent": "Create Event",
    "editEvent": "Edit Event",
    "deleteEvent": "Delete Event",
    "duplicateEvent": "Duplicate Event",
    "exportReport": "Export Report",
    "shareEvent": "Share Event",
    "joinEvent": "Join Event",
    "leaveEvent": "Leave Event"
  },
  "roles": {
    "organizer": "Organizer",
    "presenter": "Presenter",
    "controller": "Timer Controller",
    "viewer": "Viewer"
  },
  "status": {
    "draft": "Draft",
    "published": "Published",
    "active": "Active",
    "completed": "Completed",
    "cancelled": "Cancelled"
  }
}
```

## File: `locales/es/hero.json`

```json
{
  "title": "CueTimer",
  "subtitle": "Professional presentation timer platform with real-time synchronization for perfect event timing.",
  "getStarted": "Get Started",
  "watchDemo": "Watch Demo",
  "features": {
    "title": "Features",
    "realtime": {
      "title": "Real-time Synchronization",
      "description": "Keep everyone in sync with real-time timer updates across all devices."
    },
    "professional": {
      "title": "Professional Controls",
      "description": "Industry-standard timing controls with customizable segments and warnings."
    },
    "multilingual": {
      "title": "Multi-language Support",
      "description": "Available in multiple languages to serve international events and teams."
    },
    "analytics": {
      "title": "Detailed Analytics",
      "description": "Comprehensive timing reports and insights for continuous improvement."
    }
  },
  "cta": {
    "primary": "Start Free Trial",
    "secondary": "Schedule Demo"
  }
}
```

## File: `locales/es/navigation.json`

```json
{
  "home": "Home",
  "dashboard": "Dashboard",
  "events": "Events",
  "timers": "Timers",
  "pricing": "Pricing",
  "blog": "Blog",
  "about": "About",
  "contact": "Contact",
  "login": "Login",
  "signup": "Sign Up",
  "logout": "Logout",
  "profile": "Profile",
  "settings": "Settings",
  "backToHome": "Back to Home",
  "language": "Language",
  "theme": "Theme",
  "help": "Help",
  "support": "Support"
}
```

## File: `locales/es/presentations.json`

```json
{
  "title": "Presentations",
  "description": "Manage presentation schedules and timing",
  "create": {
    "title": "Create Presentation",
    "name": "Presentation Title",
    "namePlaceholder": "Keynote: Future of Technology",
    "speaker": "Speaker",
    "speakerPlaceholder": "John Smith",
    "description": "Description",
    "descriptionPlaceholder": "An overview of emerging technology trends",
    "duration": "Duration",
    "startTime": "Start Time",
    "endTime": "End Time",
    "room": "Room/Stage",
    "roomPlaceholder": "Main Stage",
    "type": "Presentation Type",
    "types": {
      "keynote": "Keynote",
      "talk": "Talk",
      "workshop": "Workshop",
      "panel": "Panel Discussion",
      "lightning": "Lightning Talk",
      "tutorial": "Tutorial"
    }
  },
  "segments": {
    "title": "Presentation Segments",
    "add": "Add Segment",
    "remove": "Remove Segment",
    "name": "Segment Name",
    "duration": "Duration",
    "warnings": "Enable Warnings",
    "preset": "Use Preset",
    "presets": {
      "standard": "Standard Presentation",
      "withQA": "With Q&A",
      "workshop": "Workshop Format",
      "panel": "Panel Discussion",
      "lightning": "Lightning Talk"
    }
  },
  "details": {
    "title": "Presentation Details",
    "speaker": "Speaker",
    "duration": "Duration",
    "startTime": "Start Time",
    "endTime": "End Time",
    "room": "Location",
    "status": "Status",
    "segments": "Segments"
  },
  "actions": {
    "create": "Create Presentation",
    "edit": "Edit Presentation",
    "delete": "Delete Presentation",
    "duplicate": "Duplicate Presentation",
    "start": "Start Presentation",
    "joinAsPresenter": "Join as Presenter",
    "joinAsController": "Join as Timer Controller",
    "viewAsAudience": "View as Audience"
  },
  "status": {
    "scheduled": "Scheduled",
    "ready": "Ready",
    "running": "Running",
    "paused": "Paused",
    "completed": "Completed",
    "cancelled": "Cancelled"
  },
  "realtime": {
    "connected": "Connected to timer",
    "disconnected": "Disconnected from timer",
    "reconnecting": "Reconnecting...",
    "syncStatus": "Sync Status",
    "lastUpdate": "Last Update",
    "participants": "Participants"
  }
}
```

## File: `locales/es/pricing.json`

```json
{
  "title": "Pricing",
  "subtitle": "Choose the perfect plan for your needs",
  "monthly": "Monthly",
  "yearly": "Yearly",
  "save": "Save",
  "popular": "Popular",
  "current": "Current",
  "features": {
    "basicTimers": "Basic Timers",
    "unlimitedEvents": "Unlimited Events",
    "realTimeSync": "Real-time Sync",
    "advancedAnalytics": "Advanced Analytics",
    "prioritySupport": "Priority Support",
    "customBranding": "Custom Branding",
    "apiAccess": "API Access",
    "teamCollaboration": "Team Collaboration"
  },
  "plans": {
    "free": {
      "name": "Free",
      "price": "$0",
      "description": "Perfect for getting started"
    },
    "pro": {
      "name": "Pro",
      "price": "$9",
      "description": "For professional presenters"
    },
    "enterprise": {
      "name": "Enterprise",
      "price": "Custom",
      "description": "For large organizations"
    }
  }
}
```

## File: `locales/es/settings.json`

```json
{
  "title": "Settings",
  "profile": "Profile",
  "account": "Account",
  "preferences": "Preferences",
  "notifications": "Notifications",
  "security": "Security",
  "billing": "Billing",
  "language": "Language",
  "theme": "Theme",
  "timezone": "Timezone",
  "darkMode": "Dark Mode",
  "lightMode": "Light Mode",
  "systemMode": "System",
  "emailNotifications": "Email Notifications",
  "pushNotifications": "Push Notifications",
  "changePassword": "Change Password",
  "twoFactorAuth": "Two-Factor Authentication",
  "deleteAccount": "Delete Account",
  "saveChanges": "Save Changes"
}
```

## File: `locales/es/support.json`

```json
{
  "title": "Support",
  "helpCenter": "Help Center",
  "contactUs": "Contact Us",
  "documentation": "Documentation",
  "faq": "Frequently Asked Questions",
  "tutorials": "Tutorials",
  "community": "Community",
  "reportIssue": "Report an Issue",
  "featureRequest": "Request a Feature",
  "subject": "Subject",
  "message": "Message",
  "send": "Send Message",
  "searchHelp": "Search for help",
  "category": "Category",
  "priority": "Priority",
  "low": "Low",
  "medium": "Medium",
  "high": "High",
  "urgent": "Urgent"
}
```

## File: `locales/es/timer.json`

```json
{
  "title": "Timer",
  "description": "Professional timing controls",
  "controls": {
    "start": "Start",
    "pause": "Pause",
    "stop": "Stop",
    "reset": "Reset",
    "resume": "Resume",
    "addTime": "Add Time",
    "removeTime": "Remove Time"
  },
  "display": {
    "timeRemaining": "Time Remaining",
    "timeElapsed": "Time Elapsed",
    "totalTime": "Total Time",
    "currentSegment": "Current Segment",
    "nextSegment": "Next Segment"
  },
  "segments": {
    "presentation": "Presentation",
    "questions": "Q&A",
    "break": "Break",
    "setup": "Setup",
    "introduction": "Introduction",
    "conclusion": "Conclusion",
    "networking": "Networking"
  },
  "warnings": {
    "fiveMinutes": "5 minutes remaining",
    "twoMinutes": "2 minutes remaining",
    "oneMinute": "1 minute remaining",
    "thirtySeconds": "30 seconds remaining",
    "tenSeconds": "10 seconds remaining",
    "timeUp": "Time's up!",
    "overtime": "Overtime"
  },
  "presenterMessages": {
    "startNow": "Please begin your presentation",
    "wrapUp": "Please begin to wrap up",
    "finishNow": "Time is up, please finish",
    "questionsStart": "Time for questions",
    "questionsEnd": "Q&A time is over"
  },
  "states": {
    "ready": "Ready",
    "running": "Running",
    "paused": "Paused",
    "finished": "Finished",
    "overtime": "Overtime"
  },
  "settings": {
    "enableSounds": "Enable Sounds",
    "enableVibrations": "Enable Vibrations",
    "enableWarnings": "Enable Time Warnings",
    "presenterView": "Presenter View",
    "audienceView": "Audience View"
  }
}
```

## File: `locales/fr/about.json`

```json
{
  "title": "À propos de CueTimer",
  "subtitle": "Solutions de minutage professionnel pour les professionnels d'événements qui exigent fiabilité et simplicité.",
  "mission": {
    "title": "Notre Mission",
    "description": "Fournir aux professionnels d'événements la solution de minutage la plus fiable et intuitive qui fonctionne parfaitement en ligne et hors ligne, garantissant le déroulement sans faille de chaque présentation."
  },
  "vision": {
    "title": "Notre Vision",
    "description": "Devenir la norme de l'industrie pour la technologie de minutage d'événements, approuvée par les professionnels du monde entier pour sa simplicité, sa fiabilité et ses fonctionnalités innovantes."
  },
  "team": {
    "title": "Développé par des Professionnels d'Événements",
    "description": "Nous comprenons les défis des événements en direct car nous y avons été. Notre équipe combine des décennies d'expérience en gestion d'événements avec une technologie de pointe pour offrir des solutions qui fonctionnent vraiment sur le terrain."
  }
}
```

## File: `locales/fr/auth.json`

```json
{
  "title": "Authentication",
  "login": "Login",
  "signup": "Sign Up",
  "logout": "Logout",
  "email": "Email",
  "password": "Password",
  "confirmPassword": "Confirm Password",
  "forgotPassword": "Forgot Password?",
  "rememberMe": "Remember me",
  "signInPrompt": "Sign in to your account",
  "createAccountPrompt": "Create your account",
  "noAccount": "Don't have an account?",
  "alreadyHaveAccount": "Already have an account?",
  "signIn": "Sign In",
  "signUp": "Sign Up",
  "resetPassword": "Reset Password",
  "createNewPassword": "Create New Password"
}
```

## File: `locales/fr/billing.json`

```json
{
  "title": "Billing",
  "subscription": "Subscription",
  "paymentMethod": "Payment Method",
  "invoices": "Invoices",
  "usage": "Usage",
  "currentPlan": "Current Plan",
  "upgradePlan": "Upgrade Plan",
  "downgradePlan": "Downgrade Plan",
  "cancelSubscription": "Cancel Subscription",
  "reactivateSubscription": "Reactivate Subscription",
  "addPaymentMethod": "Add Payment Method",
  "removePaymentMethod": "Remove Payment Method",
  "billingHistory": "Billing History",
  "nextBillingDate": "Next Billing Date",
  "amount": "Amount",
  "status": "Status",
  "paid": "Paid",
  "pending": "Pending",
  "failed": "Failed"
}
```

## File: `locales/fr/blog.json`

```json
{
  "meta": {
    "title": "Blog CueTimer - Conseils de Temporisation d'Événements et Productivité",
    "description": "Lisez les derniers articles sur la gestion d'événements, l'optimisation des minuteurs et les conseils de présentation professionnelle des experts CueTimer."
  },
  "title": "Blog CueTimer",
  "subtitle": "Insights d'experts sur la temporisation d'événements, la productivité et les compétences de présentation professionnelle. Apprenez des experts du secteur et améliorez vos événements.",
  "loading": "Chargement des articles du blog...",
  "error": "Erreur lors du chargement des articles du blog",
  "empty": "Aucun article du blog trouvé.",
  "featured": "En vedette",
  "minRead": "min de lecture",
  "readMore": "Lire Plus",
  "backToBlog": "Retour au Blog",
  "relatedPosts": "Articles Connexes",
  "navigation": {
    "previous": "Article Précédent",
    "next": "Article Suivant"
  },
  "categories": {
    "timing": "Temporisation",
    "productivity": "Productivité",
    "events": "Événements",
    "features": "Fonctionnalités",
    "tutorials": "Tutoriels",
    "industry": "Secteur"
  },
  "filter": {
    "searchPlaceholder": "Rechercher des articles du blog...",
    "categoryLabel": "Catégorie",
    "allCategories": "Toutes les Catégories",
    "featuredOnly": "Seulement en Vedette",
    "clearFilters": "Effacer les Filtres",
    "activeFilters": "Filtres Actifs"
  }
}
```

## File: `locales/fr/common.json`

```json
{
  "hero": {
    "title": "CueTimer",
    "subtitle": "Professional presentation timer platform with real-time synchronization for perfect event timing.",
    "getStarted": "Get Started"
  },
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "events": "Events",
    "timers": "Timers",
    "pricing": "Pricing",
    "blog": "Blog",
    "about": "About",
    "contact": "Contact",
    "login": "Login",
    "signup": "Sign Up",
    "logout": "Logout",
    "profile": "Profile",
    "settings": "Settings",
    "backToHome": "Back to Home"
  },
  "auth": {
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "firstName": "First Name",
    "lastName": "Last Name",
    "emailPlaceholder": "your@email.com",
    "passwordPlaceholder": "••••••••",
    "confirmPasswordPlaceholder": "••••••••",
    "firstNamePlaceholder": "John",
    "lastNamePlaceholder": "Doe",
    "signInPrompt": "Sign in to continue",
    "createAccountPrompt": "Create your free account",
    "noAccount": "Don't have an account?",
    "alreadyHaveAccount": "Already have an account?",
    "rememberMe": "Remember me",
    "forgotPassword": "Forgot password?",
    "continueWithGoogle": "Continue with Google",
    "continueWithMicrosoft": "Continue with Microsoft"
  },
  "actions": {
    "getStarted": "Get Started Free",
    "startFree": "Start Free",
    "buyNow": "Buy Now",
    "upgrade": "Upgrade",
    "downgrade": "Downgrade",
    "cancel": "Cancel",
    "save": "Save",
    "edit": "Edit",
    "delete": "Delete",
    "view": "View",
    "download": "Download",
    "upload": "Upload",
    "submit": "Submit",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "close": "Close",
    "confirm": "Confirm",
    "continue": "Continue",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "learnMore": "Learn more",
    "startTimer": "Start Timer",
    "pauseTimer": "Pause Timer",
    "stopTimer": "Stop Timer",
    "resetTimer": "Reset Timer",
    "resumeTimer": "Resume Timer"
  },
  "ui": {
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Operation completed successfully",
    "retry": "Try again",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "close": "Close",
    "search": "Search",
    "filter": "Filter",
    "sort": "Sort",
    "clear": "Clear",
    "select": "Select",
    "selectAll": "Select all",
    "none": "None",
    "all": "All",
    "yes": "Yes",
    "no": "No",
    "ok": "OK",
    "help": "Help",
    "learnMore": "Learn more"
  },
  "status": {
    "active": "Active",
    "inactive": "Inactive",
    "pending": "Pending",
    "completed": "Completed",
    "failed": "Failed",
    "cancelled": "Cancelled",
    "expired": "Expired",
    "processing": "Processing",
    "draft": "Draft",
    "published": "Published",
    "archived": "Archived",
    "running": "Running",
    "paused": "Paused",
    "stopped": "Stopped"
  },
  "time": {
    "now": "Now",
    "today": "Today",
    "yesterday": "Yesterday",
    "tomorrow": "Tomorrow",
    "thisWeek": "This week",
    "lastWeek": "Last week",
    "nextWeek": "Next week",
    "thisMonth": "This month",
    "lastMonth": "Last month",
    "nextMonth": "Next month",
    "thisYear": "This year",
    "lastYear": "Last year",
    "ago": "ago",
    "in": "in",
    "seconds": "seconds",
    "minutes": "minutes",
    "hours": "hours",
    "days": "days",
    "weeks": "weeks",
    "months": "months",
    "years": "years",
    "second": "second",
    "minute": "minute",
    "hour": "hour",
    "day": "day"
  },
  "units": {
    "currency": "$",
    "percent": "%",
    "items": "items",
    "item": "item",
    "users": "users",
    "user": "user",
    "files": "files",
    "file": "file",
    "pages": "pages",
    "page": "page",
    "events": "events",
    "event": "event",
    "timers": "timers",
    "timer": "timer"
  }
}
```

## File: `locales/fr/dashboard.json`

```json
{
  "title": "Dashboard",
  "welcome": "Welcome back",
  "overview": "Overview",
  "recentActivity": "Recent Activity",
  "quickActions": "Quick Actions",
  "statistics": "Statistics",
  "events": "Events",
  "timers": "Timers",
  "totalEvents": "Total Events",
  "totalTimers": "Total Timers",
  "activeTimers": "Active Timers",
  "upcomingEvents": "Upcoming Events"
}
```
