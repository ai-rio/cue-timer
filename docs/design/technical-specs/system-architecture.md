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
 reports)     forms, blog)    subs, txns)             assets)
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
- **Schemas separate concerns**:  
  - `app` schema → timers, events, reports.  
  - `marketing` schema → signups, blog posts.  
  - `billing` schema → subscriptions, payments.  
- **Auth is shared**: users can log in once and be recognized across app + marketing.  
- **Stripe/LemonSqueezy** integrates via webhooks → updates subscription tables in Supabase.  
- **Admin dashboard** (optional) can query Supabase directly for analytics.  
