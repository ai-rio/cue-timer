
## 📘 Stage Timer App – **Refactored** Strategy Document

### **Guiding Principle: Beachhead & Data-Driven Expansion**
We will focus intensely on a single, high-value niche ("beachhead market") to achieve product-market fit and initial traction, before expanding into adjacent markets validated by our keyword research.

---

### 1. Market Context (Validated)
- **Existing tools:** Showtimer, Stagetimer.io, ProPresenter.
- **Gap:** A **low-complexity, mobile-first timer app** that’s reliable, offline-friendly, and monetizable.
- **✅ Validation:** Keyword research confirms this gap exists with high-intent, low-volume searches (`stage timer app`, `conference countdown timer`).

---

### 2. Niche Gaps & **Beachhead Strategy**
- **Primary Beachhead Market (Phase 1 Focus):** **Event Managers, Conference Organizers, & Worship Services.**
    - **Why:** High-intent keywords (`conference countdown timer`, `speaker timer app`) and clear workflow needs (Presenter/Controller views). This community is tight-knit, enabling word-of-mouth growth.
- **Secondary Expansion Market (Phase 3):** **Education & Productivity.**
    - **Why:** Massive search volume (`classroom timer app`, `pomodoro timer online`) proves a large adjacent market. We will attack this after solidifying our position in the beachhead.
- **De-prioritized Market:** **Esports.**
    - **Why:** Keyword research shows negligible search volume (`esports timer app`: 0-10), suggesting the market is too small or uses different terminology. We will park this idea until there is clear market signal.

---

### 3. Tech Stack (No Change)
- **Frontend:** Next.js (PWA).
- **Backend:** Supabase.
- **Mobile:** Capacitor.
- **Hosting:** Vercel / Supabase.

---

### 4. Architecture (No Change)
- **Track 1:** SEO Marketing Site (`yourapp.com`).
- **Track 2:** Mobile-First App (`app.yourapp.com`).
- **Shared Backend:** Supabase.

---

### 5. MVP Feature Set (Enhanced)
- Create timers (countdown/stopwatch).
- **Presenter view (big numbers, color changes).**
- **Controller view (start/stop/reset, adjust time).**
- **Real-time sync across devices (with defined SLA: <500ms).**
- Simple auth (email/magic link).
- Mobile-first design (PWA).
- **🆕 QR Code Join:** A controller can generate a QR code that instantly opens a full-screen presenter view on any device—**no login or app install required.** This is our key "wow" feature for guest presenters.

---

### 6. Roadmap (Restructured)

### **Phase 1: MVP & Beachhead Dominance (Weeks 1-12)**
- **Core timer + sync + QR Code Join.**
- Presenter & controller views optimized for event/worship use cases.
- PWA deployment.
- **Goal:** First 100 active users in the beachhead market.

### **Phase 2: Pro Features & Workflow Integration (Months 4-6)**
- **Custom Branding (upload logo, change colors).** *Justified by high search volume for "aesthetic" timers.*
- **Integrations:** Start with one high-impact integration (e.g., Google Calendar, Slack). *Justified by searches for `asana pomodoro timer`, `toggl pomodoro`.*
- Export reports (CSV/PDF).
- Unlimited devices.
- Notifications & chimes.
- Messaging to presenters.

### **Phase 3: Niche Expansion into Education (Months 7-9)**
- **Launch "Education Pack" ($5-15/mo):**
    - Classroom-specific templates (e.g., "Quiz Timer," "Group Work Timer").
    - Simple attendance tracking.
    - Student-friendly view.
- *Justified by massive search volume for `classroom timer app` and `study timer app`.*

---

### 7. Pricing Strategy (Validated)
- **Free Tier:** Core timer, 1–2 devices.
- **Pro Tier ($5–10/mo):** Unlimited devices, reports, **custom branding**, messaging.
- **Team Tier ($20–50/mo):** Multi-user roles, templates, analytics.
- **Niche Add-Ons ($5–15/mo):** **Education Pack** first.
- **✅ Validation:** High CPC data for business-related keywords confirms commercial viability of Pro/Team tiers.

---

### 8. Go-to-Market Plan (Overhauled)

### **Phase 1: Audience First (Weeks 1-4)**
- **Launch a "Coming Soon" landing page** tailored to the beachhead market.
- **Offer a compelling incentive** (e.g., "50% off for life") to build an email waitlist.
- **Outreach to event managers, churches, schools** with the message: "We're building a timer to solve your exact problem. Want to be the first to know?"

### **Phase 2: Content-Driven Traction (Weeks 5-12)**
- **Publish blog posts targeting "Bridge Keywords":**
    - "The Ultimate Checklist for a Flawless Live Stream Service" (targets `live stream countdown timer`).
    - "How to Keep Your Keynote on Time: A Presenter's Guide" (targets `keynote presentation timer`).
- **Soft launch to the waitlist.** Gather intense feedback.
- **Post in Reddit/Discord/LinkedIn groups** with helpful content, not just a link to your app.

### **Phase 3: Public Launch & Retention (Month 4+)**
- **Public launch to app stores.**
- **Referral loop (“Invite a friend, get 1 month free”).**
- **Use SEO to target "Money Keywords"** (`stage timer app`, `conference countdown timer`) on your marketing site.

---

### 9. 90-Day Action Plan (Re-sequenced)

- **Week 1:** Launch waitlist landing page & start audience building outreach.
- **Weeks 2-5:** Build MVP (core timer, sync, **QR Code Join**).
- **Weeks 6-7:** Private Alpha with the waitlist. Get intense feedback.
- **Week 8:** Soft launch / Public Beta. Publish 2 niche-focused blog posts. Aim for 50-100 highly engaged beta users.
- **Week 9:** Submit to App Stores (review can take time).
- **Week 10:** Add the first "Pro" feature based on Beta feedback (e.g., **Custom Branding**).
- **Week 11:** Public Launch! Announce to waitlist, communities, and launch the referral program.
- **Week 12:** Analyze initial data, talk to first paying customers, and plan the next Pro feature.

---

### 10. User Funnel (No Change)
1. Discovery → 2. Conversion → 3. Activation → 4. Retention → 5. Revenue → 6. Referral.

---

### 11. Keyword Research (Now a Core Driver)
- **Event niche (our beachhead):** `stage timer app`, `conference countdown timer`. **-> Used for SEO & ASO.**
- **Broad countdown (content bait):** `countdown app`, `event countdown app`. **-> Used for blog content.**
- **Education (our expansion):** `classroom timer app`, `study countdown timer`. **-> Informs Phase 3 features.**
- **Fitness (future exploration):** `tabata timer`, `HIIT workout timer`. **-> Parked for now.**
- **Streaming/gaming (low priority):** `live stream countdown timer`. **-> Used for content, not product focus.**

---

### 12. Deployment Plan (Keyword-Specific)
- **SEO:** Target "Money Keywords" (`stage timer app`, `conference countdown timer`) on homepage. Target "Bridge Keywords" (`classroom timer`) on the blog.
- **ASO:** Use "Money Keywords" in the App Store title/subtitle. Use "Bridge Keywords" in the description.
- **Communities:** Focus on **event management and church tech groups** first. Fitness and education groups will be targeted later.

---

### 🎯 Final Summary of Changes

This refactored plan is more focused and less risky. We have:
1.  **Chosen a Beachhead:** Concentrating our energy on the event/worship market to ensure a successful launch.
2.  **Sequenced Our Actions:** Building an audience *before* the product is ready to ensure we have customers on day one.
3.  **Made Data-Driven Decisions:** Using keyword research to prioritize features (Custom Branding), validate pricing (Pro Tier), and choose our expansion market (Education over Esports).
4.  **Added a "Magic" Feature:** The QR Code Join is a powerful, differentiator that directly addresses a key user friction point.

