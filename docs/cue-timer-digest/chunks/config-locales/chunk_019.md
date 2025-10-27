# Chunk 19: config_locales

## Metadata

- **Files**: 24
- **Size**: 24,980 characters (~6,245 tokens)
- **Categories**: config

## Files in this chunk

- `locales/fr/errors.json`
- `locales/fr/events.json`
- `locales/fr/hero.json`
- `locales/fr/navigation.json`
- `locales/fr/presentations.json`
- `locales/fr/pricing.json`
- `locales/fr/settings.json`
- `locales/fr/support.json`
- `locales/fr/timer.json`
- `locales/pt-br/about.json`
- `locales/pt-br/auth.json`
- `locales/pt-br/billing.json`
- `locales/pt-br/blog.json`
- `locales/pt-br/common.json`
- `locales/pt-br/dashboard.json`
- `locales/pt-br/errors.json`
- `locales/pt-br/events.json`
- `locales/pt-br/hero.json`
- `locales/pt-br/navigation.json`
- `locales/pt-br/presentations.json`
- `locales/pt-br/pricing.json`
- `locales/pt-br/settings.json`
- `locales/pt-br/support.json`
- `locales/pt-br/timer.json`

---

## File: `locales/fr/errors.json`

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

## File: `locales/fr/events.json`

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

## File: `locales/fr/hero.json`

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

## File: `locales/fr/navigation.json`

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

## File: `locales/fr/presentations.json`

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

## File: `locales/fr/pricing.json`

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

## File: `locales/fr/settings.json`

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

## File: `locales/fr/support.json`

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

## File: `locales/fr/timer.json`

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

## File: `locales/pt-br/about.json`

```json
{
  "title": "Sobre CueTimer",
  "subtitle": "Soluções de temporização profissional para profissionais de eventos que exigem confiabilidade e simplicidade.",
  "mission": {
    "title": "Nossa Missão",
    "description": "Fornecer aos profissionais de eventos a solução de temporização mais confiável e intuitiva que funciona perfeitamente online e offline, garantindo que cada apresentação transcorra sem problemas."
  },
  "vision": {
    "title": "Nossa Visão",
    "description": "Tornar-nos o padrão da indústria para tecnologia de temporização de eventos, confiada por profissionais mundialmente por sua simplicidade, confiabilidade e recursos inovadores."
  },
  "team": {
    "title": "Desenvolvido por Profissionais de Eventos",
    "description": "Entendemos os desafios de eventos ao vivo porque já estivemos lá. Nossa equipe combina décadas de experiência em gerenciamento de eventos com tecnologia de ponta para entregar soluções que realmente funcionam no campo."
  }
}
```

## File: `locales/pt-br/auth.json`

```json
{
  "title": "Autenticação",
  "login": "Entrar",
  "signup": "Cadastrar",
  "logout": "Sair",
  "email": "E-mail",
  "password": "Senha",
  "confirmPassword": "Confirmar Senha",
  "forgotPassword": "Esqueceu a senha?",
  "rememberMe": "Lembrar de mim",
  "signInPrompt": "Entre na sua conta",
  "createAccountPrompt": "Crie sua conta",
  "noAccount": "Não tem uma conta?",
  "alreadyHaveAccount": "Já tem uma conta?",
  "signIn": "Entrar",
  "signUp": "Cadastrar",
  "resetPassword": "Redefinir Senha",
  "createNewPassword": "Criar Nova Senha"
}
```

## File: `locales/pt-br/billing.json`

```json
{}
```

## File: `locales/pt-br/blog.json`

```json
{
  "meta": {
    "title": "Blog CueTimer - Dicas de Temporização de Eventos e Produtividade",
    "description": "Leia os últimos artigos sobre gestão de eventos, otimização de temporizadores e dicas de apresentação profissional dos especialistas CueTimer."
  },
  "title": "Blog CueTimer",
  "subtitle": "Insights especialistas sobre temporização de eventos, produtividade e habilidades de apresentação profissional. Aprenda com especialistas do setor e leve seus eventos para o próximo nível.",
  "loading": "Carregando posts do blog...",
  "error": "Erro ao carregar posts do blog",
  "empty": "Nenhum post do blog encontrado.",
  "featured": "Destaque",
  "minRead": "min de leitura",
  "readMore": "Leia Mais",
  "backToBlog": "Voltar ao Blog",
  "relatedPosts": "Posts Relacionados",
  "navigation": {
    "previous": "Post Anterior",
    "next": "Próximo Post"
  },
  "categories": {
    "timing": "Temporização",
    "productivity": "Produtividade",
    "events": "Eventos",
    "features": "Recursos",
    "tutorials": "Tutoriais",
    "industry": "Setor"
  },
  "filter": {
    "searchPlaceholder": "Pesquisar posts do blog...",
    "categoryLabel": "Categoria",
    "allCategories": "Todas as Categorias",
    "featuredOnly": "Apenas Destaques",
    "clearFilters": "Limpar Filtros",
    "activeFilters": "Filtros Ativos"
  }
}
```

## File: `locales/pt-br/common.json`

```json
{
  "hero": {
    "title": "CueTimer",
    "subtitle": "Plataforma profissional de timer para apresentações com sincronização em tempo real para timing perfeito de eventos.",
    "getStarted": "Começar"
  },
  "navigation": {
    "home": "Início",
    "dashboard": "Painel",
    "events": "Eventos",
    "timers": "Timers",
    "pricing": "Preços",
    "blog": "Blog",
    "about": "Sobre",
    "contact": "Contato",
    "login": "Entrar",
    "signup": "Cadastrar",
    "logout": "Sair",
    "profile": "Perfil",
    "settings": "Configurações",
    "backToHome": "Voltar para Início",
    "getStarted": "Começar"
  },
  "auth": {
    "email": "E-mail",
    "password": "Senha",
    "confirmPassword": "Confirmar Senha",
    "firstName": "Nome",
    "lastName": "Sobrenome",
    "emailPlaceholder": "seu@email.com",
    "passwordPlaceholder": "••••••••",
    "confirmPasswordPlaceholder": "••••••••",
    "firstNamePlaceholder": "João",
    "lastNamePlaceholder": "Silva",
    "signInPrompt": "Faça login para continuar",
    "createAccountPrompt": "Crie sua conta gratuita",
    "noAccount": "Não tem uma conta?",
    "alreadyHaveAccount": "Já tem uma conta?",
    "rememberMe": "Lembrar de mim",
    "forgotPassword": "Esqueceu a senha?",
    "continueWithGoogle": "Continuar com Google",
    "continueWithMicrosoft": "Continuar com Microsoft"
  },
  "actions": {
    "getStarted": "Começar Gratuitamente",
    "startFree": "Iniciar Gratuitamente",
    "buyNow": "Comprar Agora",
    "upgrade": "Atualizar",
    "downgrade": "Rebaixar",
    "cancel": "Cancelar",
    "save": "Salvar",
    "edit": "Editar",
    "delete": "Excluir",
    "view": "Ver",
    "download": "Baixar",
    "upload": "Enviar",
    "submit": "Enviar",
    "back": "Voltar",
    "next": "Próximo",
    "previous": "Anterior",
    "close": "Fechar",
    "confirm": "Confirmar",
    "continue": "Continuar",
    "loading": "Carregando...",
    "error": "Erro",
    "success": "Sucesso",
    "learnMore": "Saiba mais",
    "startTimer": "Iniciar Timer",
    "pauseTimer": "Pausar Timer",
    "stopTimer": "Parar Timer",
    "resetTimer": "Reiniciar Timer",
    "resumeTimer": "Retomar Timer"
  },
  "ui": {
    "loading": "Carregando...",
    "error": "Ocorreu um erro",
    "success": "Operação realizada com sucesso",
    "retry": "Tentar novamente",
    "cancel": "Cancelar",
    "confirm": "Confirmar",
    "close": "Fechar",
    "search": "Buscar",
    "filter": "Filtrar",
    "sort": "Ordenar",
    "clear": "Limpar",
    "select": "Selecionar",
    "selectAll": "Selecionar todos",
    "none": "Nenhum",
    "all": "Todos",
    "yes": "Sim",
    "no": "Não",
    "ok": "OK",
    "help": "Ajuda",
    "learnMore": "Saiba mais"
  },
  "status": {
    "active": "Ativo",
    "inactive": "Inativo",
    "pending": "Pendente",
    "completed": "Concluído",
    "failed": "Falhou",
    "cancelled": "Cancelado",
    "expired": "Expirado",
    "processing": "Processando",
    "draft": "Rascunho",
    "published": "Publicado",
    "archived": "Arquivado",
    "running": "Executando",
    "paused": "Pausado",
    "stopped": "Parado"
  },
  "time": {
    "now": "Agora",
    "today": "Hoje",
    "yesterday": "Ontem",
    "tomorrow": "Amanhã",
    "thisWeek": "Esta semana",
    "lastWeek": "Última semana",
    "nextWeek": "Próxima semana",
    "thisMonth": "Este mês",
    "lastMonth": "Último mês",
    "nextMonth": "Próximo mês",
    "thisYear": "Este ano",
    "lastYear": "Último ano",
    "ago": "atrás",
    "in": "em",
    "seconds": "segundos",
    "minutes": "minutos",
    "hours": "horas",
    "days": "dias",
    "weeks": "semanas",
    "months": "meses",
    "years": "anos",
    "second": "segundo",
    "minute": "minuto",
    "hour": "hora",
    "day": "dia"
  },
  "units": {
    "currency": "R$",
    "percent": "%",
    "items": "itens",
    "item": "item",
    "users": "usuários",
    "user": "usuário",
    "files": "arquivos",
    "file": "arquivo",
    "pages": "páginas",
    "page": "página",
    "events": "eventos",
    "event": "evento",
    "timers": "timers",
    "timer": "timer"
  }
}
```

## File: `locales/pt-br/dashboard.json`

```json
{
  "title": "Painel",
  "welcome": "Bem-vindo de volta",
  "overview": "Visão Geral",
  "recentActivity": "Atividade Recente",
  "quickActions": "Ações Rápidas",
  "statistics": "Estatísticas",
  "events": "Eventos",
  "timers": "Temporizadores",
  "totalEvents": "Total de Eventos",
  "totalTimers": "Total de Temporizadores",
  "activeTimers": "Temporizadores Ativos",
  "upcomingEvents": "Próximos Eventos"
}
```

## File: `locales/pt-br/errors.json`

```json
{
  "hero": {
    "title": "CueTimer",
    "subtitle": "Plataforma profissional de timer para apresentações com sincronização em tempo real para cronometragem perfeita de eventos.",
    "getStarted": "Começar"
  },
  "navigation": {
    "home": "Início",
    "dashboard": "Painel",
    "events": "Eventos",
    "timers": "Timers",
    "pricing": "Preços",
    "blog": "Blog",
    "about": "Sobre",
    "contact": "Contato",
    "login": "Entrar",
    "signup": "Cadastrar",
    "logout": "Sair",
    "profile": "Perfil",
    "settings": "Configurações",
    "backToHome": "Voltar ao Início"
  },
  "auth": {
    "email": "Email",
    "password": "Senha",
    "confirmPassword": "Confirmar Senha",
    "firstName": "Nome",
    "lastName": "Sobrenome",
    "emailPlaceholder": "seu@email.com",
    "passwordPlaceholder": "••••••••",
    "confirmPasswordPlaceholder": "••••••••",
    "firstNamePlaceholder": "João",
    "lastNamePlaceholder": "Silva",
    "signInPrompt": "Entre para continuar",
    "createAccountPrompt": "Crie sua conta gratuita",
    "noAccount": "Não tem uma conta?",
    "alreadyHaveAccount": "Já tem uma conta?",
    "rememberMe": "Lembrar de mim",
    "forgotPassword": "Esqueceu a senha?",
    "continueWithGoogle": "Continuar com Google",
    "continueWithMicrosoft": "Continuar com Microsoft"
  },
  "actions": {
    "getStarted": "Começar Gratuitamente",
    "startFree": "Iniciar Gratuitamente",
    "buyNow": "Comprar Agora",
    "upgrade": "Atualizar",
    "downgrade": "Rebaixar",
    "cancel": "Cancelar",
    "save": "Salvar",
    "edit": "Editar",
    "delete": "Excluir",
    "view": "Visualizar",
    "download": "Baixar",
    "upload": "Enviar",
    "submit": "Enviar",
    "back": "Voltar",
    "next": "Próximo",
    "previous": "Anterior",
    "close": "Fechar",
    "confirm": "Confirmar",
    "continue": "Continuar",
    "loading": "Carregando...",
    "error": "Erro",
    "success": "Sucesso",
    "learnMore": "Saiba mais",
    "startTimer": "Iniciar Timer",
    "pauseTimer": "Pausar Timer",
    "stopTimer": "Parar Timer",
    "resetTimer": "Redefinir Timer",
    "resumeTimer": "Retomar Timer"
  },
  "ui": {
    "loading": "Carregando...",
    "error": "Ocorreu um erro",
    "success": "Operação concluída com sucesso",
    "retry": "Tentar novamente",
    "cancel": "Cancelar",
    "confirm": "Confirmar",
    "close": "Fechar",
    "search": "Buscar",
    "filter": "Filtrar",
    "sort": "Ordenar",
    "clear": "Limpar",
    "select": "Selecionar",
    "selectAll": "Selecionar todos",
    "none": "Nenhum",
    "all": "Todos",
    "yes": "Sim",
    "no": "Não",
    "ok": "OK",
    "help": "Ajuda",
    "learnMore": "Saiba mais"
  },
  "status": {
    "active": "Ativo",
    "inactive": "Inativo",
    "pending": "Pendente",
    "completed": "Concluído",
    "failed": "Falhou",
    "cancelled": "Cancelado",
    "expired": "Expirado",
    "processing": "Processando",
    "draft": "Rascunho",
    "published": "Publicado",
    "archived": "Arquivado",
    "running": "Executando",
    "paused": "Pausado",
    "stopped": "Parado"
  },
  "time": {
    "now": "Agora",
    "today": "Hoje",
    "yesterday": "Ontem",
    "tomorrow": "Amanhã",
    "thisWeek": "Esta semana",
    "lastWeek": "Semana passada",
    "nextWeek": "Próxima semana",
    "thisMonth": "Este mês",
    "lastMonth": "Mês passado",
    "nextMonth": "Próximo mês",
    "thisYear": "Este ano",
    "lastYear": "Ano passado",
    "ago": "atrás",
    "in": "em",
    "seconds": "segundos",
    "minutes": "minutos",
    "hours": "horas",
    "days": "dias",
    "weeks": "semanas",
    "months": "meses",
    "years": "anos",
    "second": "segundo",
    "minute": "minuto",
    "hour": "hora",
    "day": "dia"
  },
  "units": {
    "currency": "R$",
    "percent": "%",
    "items": "itens",
    "item": "item",
    "users": "usuários",
    "user": "usuário",
    "files": "arquivos",
    "file": "arquivo",
    "pages": "páginas",
    "page": "página",
    "events": "eventos",
    "event": "evento",
    "timers": "timers",
    "timer": "timer"
  }
}
```

## File: `locales/pt-br/events.json`

```json
{
  "title": "Eventos",
  "createEvent": "Criar Evento",
  "editEvent": "Editar Evento",
  "deleteEvent": "Excluir Evento",
  "eventName": "Nome do Evento",
  "eventDate": "Data do Evento",
  "eventTime": "Horário do Evento",
  "location": "Local",
  "description": "Descrição",
  "participants": "Participantes",
  "status": "Status",
  "upcoming": "Próximos",
  "past": "Passados",
  "active": "Ativos",
  "completed": "Concluídos"
}
```

## File: `locales/pt-br/hero.json`

```json
{
  "title": "CueTimer",
  "subtitle": "Plataforma profissional de temporizadores para apresentações com sincronização em tempo real para temporização perfeita de eventos.",
  "getStarted": "Começar Agora",
  "features": {
    "realTime": "Sincronização em Tempo Real",
    "professional": "Temporização Profissional",
    "reliable": "Confiável Offline",
    "easy": "Fácil de Usar"
  }
}
```

## File: `locales/pt-br/navigation.json`

```json
{
  "home": "Início",
  "dashboard": "Painel",
  "events": "Eventos",
  "timers": "Temporizadores",
  "pricing": "Preços",
  "blog": "Blog",
  "about": "Sobre",
  "contact": "Contato",
  "login": "Entrar",
  "signup": "Cadastrar",
  "logout": "Sair",
  "profile": "Perfil",
  "settings": "Configurações",
  "backToHome": "Voltar ao Início",
  "language": "Idioma",
  "theme": "Tema",
  "help": "Ajuda",
  "support": "Suporte"
}
```

## File: `locales/pt-br/presentations.json`

```json
{
  "title": "Apresentações",
  "createPresentation": "Criar Apresentação",
  "editPresentation": "Editar Apresentação",
  "deletePresentation": "Excluir Apresentação",
  "presentationName": "Nome da Apresentação",
  "duration": "Duração",
  "slides": "Slides",
  "speaker": "Palestrante",
  "startPresentation": "Iniciar Apresentação",
  "pausePresentation": "Pausar Apresentação",
  "stopPresentation": "Parar Apresentação",
  "resumePresentation": "Retomar Apresentação"
}
```

## File: `locales/pt-br/pricing.json`

```json
{}
```

## File: `locales/pt-br/settings.json`

```json
{}
```

## File: `locales/pt-br/support.json`

```json
{}
```

## File: `locales/pt-br/timer.json`

```json
{
  "title": "Timer",
  "description": "Controles profissionais de temporização",
  "controls": {
    "start": "Iniciar",
    "pause": "Pausar",
    "stop": "Parar",
    "reset": "Reiniciar",
    "resume": "Retomar",
    "addTime": "Adicionar Tempo",
    "removeTime": "Remover Tempo"
  },
  "display": {
    "timeRemaining": "Tempo Restante",
    "timeElapsed": "Tempo Decorrido",
    "totalTime": "Tempo Total",
    "currentSegment": "Segmento Atual",
    "nextSegment": "Próximo Segmento"
  },
  "segments": {
    "presentation": "Apresentação",
    "questions": "Perguntas",
    "break": "Pausa",
    "setup": "Preparação",
    "introduction": "Introdução",
    "conclusion": "Conclusão",
    "networking": "Networking"
  },
  "warnings": {
    "fiveMinutes": "5 minutos restantes",
    "twoMinutes": "2 minutos restantes",
    "oneMinute": "1 minuto restante",
    "thirtySeconds": "30 segundos restantes",
    "tenSeconds": "10 segundos restantes",
    "timeUp": "Tempo esgotado!",
    "overtime": "Tempo excedido"
  },
  "presenterMessages": {
    "startNow": "Por favor, comece sua apresentação",
    "wrapUp": "Por favor, comece a concluir",
    "finishNow": "O tempo acabou, por favor termine",
    "questionsStart": "Hora das perguntas",
    "questionsEnd": "Tempo de perguntas acabou"
  },
  "states": {
    "ready": "Pronto",
    "running": "Executando",
    "paused": "Pausado",
    "finished": "Finalizado",
    "overtime": "Excedido"
  },
  "settings": {
    "enableSounds": "Habilitar Sons",
    "enableVibrations": "Habilitar Vibrações",
    "enableWarnings": "Habilitar Avisos de Tempo",
    "presenterView": "Visão do Apresentador",
    "audienceView": "Visão da Audiência"
  }
}
```
