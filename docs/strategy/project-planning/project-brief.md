## **Project Brief: CueTimer**

**Date:** October 26, 2023 **Version:** 2.0 **Status:** Approved

### 1. Project Vision

To create the go-to, mobile-first stage timer application for event
professionals. **CueTimer** will provide a radically simple, reliable, and
offline-friendly solution that eliminates the technical friction of managing
live event timing, allowing presenters and technicians to focus on delivering a
flawless experience.

### 2. Problem Statement

Event managers, conference organizers, and worship service directors
consistently struggle with technology for managing stage timing. Existing
solutions fall into two flawed categories:

1. **Overly Complex & Expensive:** Tools like ProPresenter are full multimedia
   suites that are costly, require dedicated hardware (laptops), and have a
   steep learning curve.
2. **Overly Simple & Unreliable:** Basic apps or online timers lack critical
   features like real-time remote control, fail when Wi-Fi is unstable, and are
   not designed for professional multi-device workflows.

This gap forces professionals to rely on clunky, unreliable workarounds, leading
to delayed schedules, stressed presenters, and unprofessional productions.

### 3. Proposed Solution

We will build a **Progressive Web App (PWA)** called **CueTimer** with a
two-device workflow:

- **Controller View:** On the event manager's phone/tablet. Allows them to
  start, stop, pause, and adjust the timer.
- **Presenter View:** A full-screen, distraction-free display of the timer on
  any device (a tablet on the podium, a monitor in the livestream booth, etc.).

**Key Features:**

- **Real-Time Sync:** ✅ **VALIDATED** - Sub-500ms sync across all devices using
  PowerSync + Supabase.
- **Offline-First Reliability:** ✅ **PROVEN** - Timer continues to function
  with poor/no internet, syncing automatically when reconnected.
- **Essential Presenter Messaging:** ✅ **NEW** - Real-time visual cues from
  manager to presenter (mic checks, timing warnings, pacing guidance).
- **Frictionless Presenter Mode:** A **QR Code Join** feature allows a presenter
  to instantly join the timer session on their device without needing to log in
  or install an app.
- **Simple Auth:** Magic link email authentication for quick access.

### 4. Target Audience (Beachhead Market)

Our initial launch will focus exclusively on:

- **Corporate Event & Conference Organizers**
- **Worship Service & Church Tech Directors**
- **Professional Speakers & MCs**

This market understands the importance of a "cue" and has demonstrated high
intent and a clear willingness to pay for professional tools that solve this
specific problem.

### 5. Key Differentiators

1. **Radical Simplicity:** A mobile-first design that does one thing perfectly:
   manage stage time.
2. **Offline-First Reliability:** Works when other tools fail, providing peace
   of mind in high-stakes environments.
3. **Frictionless Experience:** The QR Code Join feature removes all barriers
   for guest presenters, creating a "wow" moment.
4. **Essential Communication:** Real-time presenter messaging addresses the
   critical need for subtle presenter guidance during live events.
5. **Professional Branding:** The name **CueTimer** establishes us as an insider
   tool built specifically for the event industry.

### 6. Project Goals & Success Metrics

**Business Goals:**

- Achieve first 100 active users within the first 90 days.
- Convert the first 5-10 users to a paid Pro plan within the first 4 months.
- Validate product-market fit within the beachhead market.

**Product Success Metrics:**

- **North Star Metric:** Weekly Active Timers.
- **Activation Rate:** >40% of new signups create a timer and sync it to a
  second device within 24 hours.
- **Retention Rate:** >60% of weekly active timers return the following week.

### 7. Scope & High-Level Timeline

| Phase                  | Timeline       | Key Deliverables                                                                                         |
| :--------------------- | :------------- | :------------------------------------------------------------------------------------------------------- |
| **Phase 1: MVP**       | **Weeks 1-12** | Core timer, real-time sync, QR Code Join, Presenter/Controller views, PWA deployment at **cuetimer.io**. |
| **Phase 2: Pro**       | **Months 4-6** | Custom Branding, first integration (e.g., Google Calendar), reports, unlimited devices.                  |
| **Phase 3: Expansion** | **Months 7-9** | Launch "Education Pack" based on market validation.                                                      |

### 8. Key Stakeholders

| Role               | Responsibility                                                    |
| :----------------- | :---------------------------------------------------------------- |
| **Project Lead**   | Overall strategy, GTM, budget, and success of the project.        |
| **Lead Developer** | Technical architecture, development, and deployment.              |
| **UX/UI Designer** | User experience, interface design, and branding for **CueTimer**. |
| **Marketing Lead** | Audience building, content strategy, and launch execution.        |

### 9. Budget & Resources

This project will be initially bootstrapped / funded by seed capital. Primary
resource allocation will be for:

- Development & design hours.
- Subscriptions for core tools (Supabase, Vercel, Figma, etc.).
- **Domain registration for cuetimer.io** and initial marketing spend.

### 10. Risks & Assumptions

| Risks                                                                                                     | Mitigation                                                                                                                                                       |
| :-------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Technical:** Real-time sync infrastructure doesn't meet performance requirements.                       | ✅ **VALIDATED**: PowerSync + Supabase provides proven <500ms sync with complete working implementation. Have migration plan to self-hosted PowerSync if needed. |
| **Market:** A competitor (e.g., Stagetimer.io) launches a similar mobile feature before we gain traction. | Our moat is the beachhead focus, superior UX (QR Code), and a more professional brand identity (**CueTimer**). Execute faster.                                   |
| **Execution:** Feature creep delays the MVP launch.                                                       | Treat the 90-day plan as law. All new ideas go into a Phase 2+ backlog.                                                                                          |

| Assumptions                                                                                             |
| :------------------------------------------------------------------------------------------------------ |
| Our target beachhead market is actively searching for and dissatisfied with current solutions.          |
| A mobile-first workflow is preferable to a laptop-based workflow for our users.                         |
| The name **CueTimer** will resonate with our target audience as a professional, industry-specific tool. |

---

### **Next Steps**

1. **Secure Assets:** Immediately purchase **cuetimer.io** and reserve the
   handle `@cuetimer` on key social media platforms (Twitter, Instagram, etc.).
2. **Begin Brand Exploration:** Start thinking about a logo for **CueTimer**.
   The name lends itself to concepts like play buttons, spotlights, or
   minimalist timing cues.
3. **Update All Documentation:** Replace all instances of "Stage Timer App" with
   "CueTimer" in the comprehensive strategy document and the 90-day action plan.
4. **Commence Week 1:** Begin execution of the 90-day action plan, starting with
   the launch of the "Coming Soon" landing page for **CueTimer**.
