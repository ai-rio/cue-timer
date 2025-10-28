# Chunk 0: 000_overview

## Metadata

- **Files**: 1
- **Size**: 12,879 characters (~3,219 tokens)
- **Categories**: metadata

## Files in this chunk

- `__directory_structure__`

---

## Directory Structure

```
Directory structure:
└── ai-rio-cue-timer/
    ├── README.md
    ├── CLAUDE.md
    ├── commitlint.config.cjs
    ├── components.json
    ├── DESIGN_SYSTEM_IMPLEMENTATION.md
    ├── eslint.config.js
    ├── global.d.ts
    ├── i18n.ts
    ├── jest.config.ci.js
    ├── jest.config.js
    ├── LICENSE
    ├── lighthouserc.json
    ├── lint-staged.config.cjs
    ├── mdx-components.tsx
    ├── middleware.ts
    ├── next-env.d.ts
    ├── next.config.js
    ├── package.json
    ├── PHASE_1_AUDIT_REPORT.md
    ├── PHASE_1_TASKS-ARCHIVED.md
    ├── PHASE_1_TASKS.md
    ├── postcss.config.cjs
    ├── prettier.config.mjs
    ├── tailwind.config.ts
    ├── tailwind.config.ts.disabled
    ├── test-timer.html
    ├── TIMER_VISIBILITY_FIX.md
    ├── tsconfig.json
    ├── .env.example
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── [locale]/
    │   │   ├── layout.tsx
    │   │   ├── (auth)/
    │   │   │   ├── layout.tsx
    │   │   │   ├── callback/
    │   │   │   │   └── route.ts
    │   │   │   └── login/
    │   │   │       └── page.tsx
    │   │   ├── (marketing)/
    │   │   │   ├── page.tsx
    │   │   │   ├── about/
    │   │   │   │   └── page.tsx
    │   │   │   ├── blog/
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── [slug]/
    │   │   │   │       └── page.tsx
    │   │   │   └── pricing/
    │   │   │       └── page.tsx
    │   │   ├── account/
    │   │   │   ├── layout.tsx
    │   │   │   └── dashboard/
    │   │   │       └── page.tsx
    │   │   ├── checkout/
    │   │   │   ├── page.tsx
    │   │   │   ├── cancel/
    │   │   │   │   └── page.tsx
    │   │   │   └── success/
    │   │   │       └── page.tsx
    │   │   ├── design-system/
    │   │   │   ├── README.md
    │   │   │   ├── page.tsx
    │   │   │   └── test-assertions.md
    │   │   ├── test/
    │   │   │   └── page.tsx
    │   │   └── theme-demo/
    │   │       └── page.tsx
    │   ├── api/
    │   │   ├── auth/
    │   │   │   └── magic-link/
    │   │   │       └── route.ts
    │   │   ├── blog/
    │   │   │   └── route.ts
    │   │   └── stripe/
    │   │       ├── create-payment-intent/
    │   │       │   └── route.ts
    │   │       └── webhook/
    │   │           └── route.ts
    │   └── test-route/
    │       ├── layout.tsx
    │       └── page.tsx
    ├── components/
    │   ├── ErrorBoundary.tsx
    │   ├── LanguageSwitcher.tsx
    │   ├── Navigation.tsx
    │   ├── TailwindTest.tsx
    │   ├── theme-toggle.tsx
    │   ├── blog/
    │   │   ├── AccessibleBlogSearch.tsx
    │   │   ├── AccessibleMDXRenderer.tsx
    │   │   ├── AdvancedBlogSearchAndFilter.tsx
    │   │   ├── AuthorBio.tsx
    │   │   ├── BlogContent.tsx
    │   │   ├── BlogContentEnhanced.tsx
    │   │   ├── BlogContentManager.tsx
    │   │   ├── BlogContentSimple.tsx
    │   │   ├── BlogErrorBoundary.tsx
    │   │   ├── BlogGrid.tsx
    │   │   ├── BlogGridSimple.tsx
    │   │   ├── BlogPostCard.tsx
    │   │   ├── BlogPostCardSimple.tsx
    │   │   ├── BlogPostNavigation.tsx
    │   │   ├── BlogPostWrapper.tsx
    │   │   ├── BlogSearchAndFilter.tsx
    │   │   ├── BlogSearchAndFilterSimple.tsx
    │   │   ├── EnhancedMDXRenderer.tsx
    │   │   ├── LanguageSelector.tsx
    │   │   ├── MDXRenderer.tsx
    │   │   ├── OptimizedMDXRenderer.tsx
    │   │   ├── RelatedPosts.tsx
    │   │   ├── TableOfContents.tsx
    │   │   └── TemplateAwareBlogPostWrapper.tsx
    │   ├── checkout/
    │   │   └── CheckoutForm.tsx
    │   └── ui/
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── dialog.tsx
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── loading.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── switch.tsx
    │       └── tabs.tsx
    ├── content/
    │   └── blog/
    │       ├── 2024/
    │       │   ├── productivity-event-management.md
    │       │   └── professional-timing-tips-presentations.md
    │       └── 2025/
    │           └── 10/
    │               └── test-timing-guide.mdx
    ├── contexts/
    │   └── AuthContext.tsx
    ├── docs/
    │   ├── README.md
    │   ├── documentation-overview.md
    │   ├── ESLINT-DISASTER-RECOVERY-FINAL-PLAN.md
    │   ├── ESLINT-DISASTER-RECOVERY-REPORT.md
    │   ├── ESLINT-MAINTENANCE-STRATEGY.md
    │   ├── INDEX.md
    │   ├── naming-conventions.md
    │   ├── VALIDATION-SUMMARY.md
    │   ├── blog-management/
    │   │   ├── README.md
    │   │   ├── API-REFERENCE.md
    │   │   ├── CLI-REFERENCE.md
    │   │   ├── DEPLOYMENT-READINESS.md
    │   │   ├── DEPLOYMENT.md
    │   │   ├── DEVELOPER-GUIDE.md
    │   │   ├── IMPLEMENTATION-SUMMARY.md
    │   │   ├── SYSTEM-CERTIFICATION.md
    │   │   ├── TEMPLATES.md
    │   │   ├── TROUBLESHOOTING.md
    │   │   └── WORKFLOW.md
    │   ├── design/
    │   │   ├── branding/
    │   │   │   └── design-system.md
    │   │   ├── technical-specs/
    │   │   │   ├── mobile-pwa-architecture.md
    │   │   │   └── system-architecture.md
    │   │   └── ui-ux/
    │   │       ├── messaging-system-specifications.md
    │   │       └── user-interface-guidelines.md
    │   ├── development/
    │   │   ├── husky-setup.md
    │   │   ├── project-summary.md
    │   │   ├── architecture/
    │   │   │   └── project-architecture.md
    │   │   ├── guides/
    │   │   │   ├── development-workflow.md
    │   │   │   ├── git-workflow-guide.md
    │   │   │   ├── powersync-implementation-guide.md
    │   │   │   ├── quotekit-integration-plan.md
    │   │   │   ├── quotekit-reference-only-policy.md
    │   │   │   ├── TIMER_VISIBILITY_FIX.md
    │   │   │   └── troubleshooting-guide.md
    │   │   ├── roadmap/
    │   │   │   ├── next-steps-ARCHIVED.md
    │   │   │   └── next-steps.md
    │   │   ├── setup/
    │   │   │   └── technical-setup-summary.md
    │   │   └── type-check/
    │   │       ├── README.md
    │   │       ├── implementation-summary.md
    │   │       ├── integration-guide.md
    │   │       ├── quick-reference.md
    │   │       ├── troubleshooting.md
    │   │       ├── type-automation-summary.md
    │   │       └── type-check-verification-report.md
    │   ├── phase-reports/
    │   │   ├── DESIGN_SYSTEM_IMPLEMENTATION.md
    │   │   ├── PHASE_1_AUDIT_REPORT.md
    │   │   ├── PHASE_1_TASKS-ARCHIVED.md
    │   │   ├── PHASE_1_TASKS.md
    │   │   └── PHASE_4_IMPLEMENTATION_SUMMARY.md
    │   ├── plans/
    │   │   ├── 2024-10-25-blog-management-implementation-plan.md
    │   │   └── 2025-01-25-aggressive-eslint-agent-deployment-design.md
    │   ├── research/
    │   │   └── competitor-analysis/
    │   │       └── competitive-landscape.md
    │   ├── strategy/
    │   │   ├── content-strategy.md
    │   │   ├── help-documentation.md
    │   │   ├── keyword-integrated-content-strategy.md
    │   │   ├── marketing-messaging.md
    │   │   ├── user-onboarding-content.md
    │   │   ├── go-to-market/
    │   │   │   └── go-to-market-strategy.md
    │   │   ├── project-planning/
    │   │   │   ├── ideal-customer-profile.md
    │   │   │   ├── offline-first-feasibility-report.md
    │   │   │   └── project-brief.md
    │   │   └── roadmap/
    │   │       ├── CONSOLIDATION_SUMMARY.md
    │   │       ├── project-roadmap-ARCHIVED.md
    │   │       ├── project-roadmap-master.md
    │   │       └── project-roadmap.md
    │   ├── templates/
    │   │   └── prompts/
    │   │       └── creative-team-prompt.md
    │   └── testing/
    │       ├── README.md
    │       └── COVERAGE-REPORT.md
    ├── lib/
    │   ├── blog-utils.ts
    │   ├── blog.ts
    │   ├── utils.ts
    │   ├── auth/
    │   │   ├── middleware.ts
    │   │   └── supabase.ts
    │   ├── blog-scripts/
    │   │   ├── content-creator.ts
    │   │   ├── types.ts
    │   │   ├── examples/
    │   │   │   └── feature-announce-example.ts
    │   │   └── templates/
    │   │       ├── case-study.ts
    │   │       ├── feature-announce.ts
    │   │       ├── presentation-tips.ts
    │   │       ├── README-feature-announce.md
    │   │       ├── README-presentation-tips.md
    │   │       ├── test-presentation-tips.ts
    │   │       ├── timing-guide.ts
    │   │       └── verify-presentation-tips.ts
    │   ├── seo/
    │   │   └── blog-seo.ts
    │   └── stripe/
    │       ├── config.ts
    │       └── webhooks.ts
    ├── locales/
    │   ├── de/
    │   │   ├── about.json
    │   │   ├── auth.json
    │   │   ├── billing.json
    │   │   ├── blog.json
    │   │   ├── common.json
    │   │   ├── dashboard.json
    │   │   ├── errors.json
    │   │   ├── events.json
    │   │   ├── hero.json
    │   │   ├── navigation.json
    │   │   ├── presentations.json
    │   │   ├── pricing.json
    │   │   ├── settings.json
    │   │   ├── support.json
    │   │   └── timer.json
    │   ├── en/
    │   │   ├── about.json
    │   │   ├── auth.json
    │   │   ├── billing.json
    │   │   ├── blog.json
    │   │   ├── common.json
    │   │   ├── dashboard.json
    │   │   ├── errors.json
    │   │   ├── events.json
    │   │   ├── hero.json
    │   │   ├── navigation.json
    │   │   ├── presentations.json
    │   │   ├── pricing.json
    │   │   ├── settings.json
    │   │   ├── support.json
    │   │   └── timer.json
    │   ├── es/
    │   │   ├── about.json
    │   │   ├── auth.json
    │   │   ├── billing.json
    │   │   ├── blog.json
    │   │   ├── common.json
    │   │   ├── dashboard.json
    │   │   ├── errors.json
    │   │   ├── events.json
    │   │   ├── hero.json
    │   │   ├── navigation.json
    │   │   ├── presentations.json
    │   │   ├── pricing.json
    │   │   ├── settings.json
    │   │   ├── support.json
    │   │   └── timer.json
    │   ├── fr/
    │   │   ├── about.json
    │   │   ├── auth.json
    │   │   ├── billing.json
    │   │   ├── blog.json
    │   │   ├── common.json
    │   │   ├── dashboard.json
    │   │   ├── errors.json
    │   │   ├── events.json
    │   │   ├── hero.json
    │   │   ├── navigation.json
    │   │   ├── presentations.json
    │   │   ├── pricing.json
    │   │   ├── settings.json
    │   │   ├── support.json
    │   │   └── timer.json
    │   └── pt-br/
    │       ├── about.json
    │       ├── auth.json
    │       ├── billing.json
    │       ├── blog.json
    │       ├── common.json
    │       ├── dashboard.json
    │       ├── errors.json
    │       ├── events.json
    │       ├── hero.json
    │       ├── navigation.json
    │       ├── presentations.json
    │       ├── pricing.json
    │       ├── settings.json
    │       ├── support.json
    │       └── timer.json
    ├── reports/
    │   ├── accessibility-compliance-report.md
    │   ├── bundle-optimization-report.md
    │   ├── eslint-disaster-assessment.md
    │   └── optimization-summary.md
    ├── scripts/
    │   ├── blog-analytics.ts
    │   ├── blog-create.ts
    │   ├── blog-publish.ts
    │   ├── blog-seo-check.ts
    │   ├── blog-workflow-status.ts
    │   ├── deploy-blog-system.ts
    │   ├── deploy-validation.ts
    │   ├── generate-test-coverage.ts
    │   ├── IMPLEMENTATION-SUMMARY.md
    │   ├── keyword_analysis.py
    │   ├── README-blog-create.md
    │   ├── system-health-check.ts
    │   ├── test-blog-create.ts
    │   ├── test-blog-system.ts
    │   └── test-local.sh
    ├── styles/
    │   └── accessibility.css
    ├── tests/
    │   ├── global.d.ts
    │   ├── setup.ts
    │   ├── blog-scripts/
    │   │   ├── content-creator.test.ts
    │   │   ├── templates-basic.test.js
    │   │   └── templates.test-summary.md
    │   ├── config/
    │   │   └── eslint-validation.test.ts
    │   ├── integration/
    │   │   ├── blog-content-manager.test.tsx
    │   │   ├── blog-workflow.test.ts
    │   │   ├── cli-workflow.test.ts
    │   │   ├── error-handling.test.ts
    │   │   └── mdx-renderers.test.tsx
    │   ├── performance/
    │   │   └── blog-performance.test.ts
    │   ├── scripts/
    │   │   ├── blog-create.test.ts
    │   │   ├── blog-seo-check.test.ts
    │   │   ├── cli-integration.test.ts
    │   │   └── deploy-validation.test.ts
    │   ├── types/
    │   │   └── test.d.ts
    │   └── typescript/
    │       └── type-enforcement.test.ts
    ├── types/
    │   ├── auth.ts
    │   ├── blog-api.ts
    │   ├── blog-enhanced.ts
    │   ├── blog.ts
    │   ├── jest.d.ts
    │   ├── orders.ts
    │   ├── stripe.ts
    │   └── supabase.ts
    ├── .github/
    │   └── workflows/
    │       └── test-suite.yml
    ├── .husky/
    │   ├── commit-msg
    │   ├── post-commit
    │   └── pre-commit
    └── .serena/
        ├── project.yml
        └── memories/
            ├── documentation-clarity-validation.md
            └── type-check-mandatory-workflow.md
```
