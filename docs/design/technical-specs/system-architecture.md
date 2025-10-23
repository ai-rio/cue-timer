## 🏗️ System Architecture (Text Diagram)

```
                ┌───────────────────────────┐
                │       Marketing Site      │
                │  (Next.js SSR for SEO)    │
                │                           │
                │ - Landing pages           │
                │ - Blog / CMS (optional)   │
                │ - Newsletter / Waitlist   │
                └─────────────┬─────────────┘
                              │
                              ▼
                ┌───────────────────────────┐
                │        Supabase DB        │
                │   (Single Instance)       │
                │                           │
   ┌────────────┼───────────────┬───────────┼────────────┐
   │            │               │           │            │
   ▼            ▼               ▼           ▼            ▼
 App Schema   Marketing       Billing     Auth        Storage
 (events,     Schema          Schema      (users,     (logos,
 timers,      (signups,       (plans,     sessions)   reports,
 messages)    forms, blog)    subs, txns)             assets)
```

```
                ▲
                │
                │
   ┌────────────┴─────────────┐
   │         Timer App        │
   │ (Next.js + Ionic + Cap.) │
   │                          │
   │ - Timer creation         │
   │ - Presenter/Controller   │
   │ - Real-time sync         │
   │ - Presenter messaging    │
   │ - Reports export         │
   └──────────────────────────┘
```

```
                ▲
                │
                │
   ┌────────────┴─────────────┐
   │       Billing Layer      │
   │   (Stripe / LemonSqueezy)│
   │                          │
   │ - Subscriptions          │
   │ - Payments               │
   │ - Webhooks → Supabase    │
   └──────────────────────────┘
```

```
                ▲
                │
                │
   ┌────────────┴─────────────┐
   │     Admin Dashboard      │
   │ (Optional, internal use) │
   │                          │
   │ - User analytics         │
   │ - Event usage stats      │
   │ - Subscription mgmt      │
   └──────────────────────────┘
```

---

## 🔑 Key Points
- **One Supabase instance** serves both the **app** and the **marketing site**.
- **Mobile-first approach** using **Next.js + Ionic + Capacitor starter** for rapid development
- **Schemas separate concerns**:
  - `app` schema → timers, events, messages, reports.
  - `marketing` schema → signups, blog posts.
  - `billing` schema → subscriptions, payments.
- **Cross-platform deployment**: Single codebase deploys to web, iOS, and Android
- **Auth is shared**: users can log in once and be recognized across app + marketing.
- **Stripe/LemonSqueezy** integrates via webhooks → updates subscription tables in Supabase.
- **Admin dashboard** (optional) can query Supabase directly for analytics.  
