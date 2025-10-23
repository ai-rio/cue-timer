# CueTimer + QuoteKit Integration Plan

**Document Version:** 1.0
**Date:** 2025-10-23
**Status:** Ready for Implementation
**Purpose:** Guide for integrating QuoteKit's Stripe and marketing features into CueTimer

---

## 🎯 Integration Overview

QuoteKit provides an excellent foundation for CueTimer's marketing site and payment infrastructure. This integration plan outlines how to leverage QuoteKit's proven components while adding our custom blog system.

## ✅ What We Get From QuoteKit

### **1. Complete Stripe Integration**
- **Subscription Management**: Full Stripe Checkout workflow
- **Webhook Processing**: `/api/webhooks` route for real-time sync
- **Customer Portal**: Self-service subscription management
- **Product Configuration**: `stripe-fixtures.json` for easy setup
- **Security**: Proper webhook signature verification

### **2. Authentication System**
- **Supabase Auth**: Email-based magic link authentication
- **User Management**: Account creation and session handling
- **Protected Routes**: Middleware for authenticated pages

### **3. Marketing Components**
- **Pricing Page**: Tiered pricing display with Stripe integration
- **UI Components**: shadcn/ui with Tailwind CSS
- **Responsive Design**: Mobile-first approach
- **Modern Styling**: Professional appearance

### **4. Email Infrastructure**
- **React Email**: Component-based email templates
- **Resend Integration**: Transactional email delivery
- **Welcome Emails**: Automated user onboarding

## 🏗️ Integration Architecture

### **System Components**
```
┌─────────────────────────────────┐
│      CueTimer Marketing Site    │
│   (Next.js + QuoteKit Base)     │
│                                 │
│ ┌─────────────┬───────────────┐ │
│ │   Landing   │     Blog      │ │
│ │    Pages    │    System     │ │
│ └─────────────┴───────────────┘ │
│                                 │
│ ┌─────────────┬───────────────┐ │
│ │   Pricing   │   Account     │ │
│ │   Page      │  Management   │ │
│ └─────────────┴───────────────┘ │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│        Shared Infrastructure     │
│                                 │
│ ┌─────────────┬───────────────┐ │
│ │  Supabase   │    Stripe     │ │
│ │   (Auth +   │  (Payments +  │ │
│ │   Database) │  Subscriptions)│ │
│ └─────────────┴───────────────┐ │
│                                 │
│ ┌─────────────┬───────────────┐ │
│ │   Resend    │   Vercel      │ │
│ │  (Emails)   │  (Hosting)    │ │
│ └─────────────┴───────────────┘ │
└─────────────────────────────────┘
```

## 📝 MDX Blog System (Already Built!)

QuoteKit includes a **comprehensive MDX blog system** with these features:

### **File-Based Content Management**
```
content/posts/
├── 2024/
│   ├── 12-27-client-communication-strategies.mdx
│   └── 12-31-seasonal-pricing-strategies.mdx
├── 2025/
│   ├── 01-02-must-have-apps-for-landscapers.mdx
│   ├── 01-04-increase-quote-value-upselling.mdx
│   └── ... (existing posts)
```

### **MDX Components System**
```typescript
// mdx-components.tsx - Custom component mapping
- BlogGrid.tsx - Responsive post grid
- BlogPostHeader.tsx - Post metadata and images
- BlogSearchAndFilter.tsx - Search and filtering
- RelatedPosts.tsx - Related post suggestions
- MDXContent.tsx - MDX rendering with custom components
- Table of Contents generation
- SEO components (structured data, metadata)
```

### **Content Management Tools**
```bash
bun run blog:new "Post Title"     # Create new MDX post
bun run blog:validate            # Validate content
bun run blog:seo-audit           # SEO analysis
bun run blog:analytics           # Content performance
bun run blog:publish             # Publishing workflow
```

### **Blog Structure for CueTimer**
```
src/app/blog/
├── page.tsx                     # Blog listing (reuse QuoteKit)
├── [slug]/
│   └── page.tsx                 # Individual posts (reuse QuoteKit)
├── content-management/          # Admin interface (reuse QuoteKit)
└── components/                  # MDX components (reuse QuoteKit)
    ├── BlogGrid.tsx
    ├── BlogPostHeader.tsx
    ├── BlogSearchAndFilter.tsx
    └── MDXContent.tsx
```

## 💳 Stripe Configuration for CueTimer

### **Product Pricing Structure**
```json
// Update stripe-fixtures.json
{
  "_meta": {
    "template_version": 0
  },
  "products": [
    {
      "id": "prod_cuetimer_free",
      "name": "CueTimer Free",
      "description": "Perfect for trying out CueTimer",
      "default_price": {
        "id": "price_cuetimer_free_monthly",
        "currency": "USD",
        "unit_amount": 0,
        "recurring": {
          "interval": "month",
          "interval_count": 1
        },
        "metadata": {
          "tier": "free",
          "max_timers": "3",
          "max_devices": "2",
          "messaging_enabled": "false"
        }
      }
    },
    {
      "id": "prod_cuetimer_pro",
      "name": "CueTimer Pro",
      "description": "Professional event management",
      "default_price": {
        "id": "price_cuetimer_pro_monthly",
        "currency": "USD",
        "unit_amount": 1200,
        "recurring": {
          "interval": "month",
          "interval_count": 1
        },
        "metadata": {
          "tier": "pro",
          "max_timers": "unlimited",
          "max_devices": "unlimited",
          "messaging_enabled": "true",
          "custom_branding": "true",
          "priority_support": "true"
        }
      }
    },
    {
      "id": "prod_cuetimer_teams",
      "name": "CueTimer Teams",
      "description": "For organizations and venues",
      "default_price": {
        "id": "price_cuetimer_teams_monthly",
        "currency": "USD",
        "unit_amount": 4900,
        "recurring": {
          "interval": "month",
          "interval_count": 1
        },
        "metadata": {
          "tier": "teams",
          "max_timers": "unlimited",
          "max_devices": "unlimited",
          "messaging_enabled": "true",
          "custom_branding": "true",
          "priority_support": "true",
          "team_members": "5",
          "analytics_dashboard": "true"
        }
      }
    }
  ]
}
```

## 🚀 Implementation Steps

### **Phase 1: Base Integration (Week 1)**
1. **Clone QuoteKit**: Set up as base foundation
2. **Environment Setup**: Configure Supabase and Stripe for CueTimer
3. **Branding Update**: Replace QuoteKit branding with CueTimer
4. **Pricing Page**: Update with CueTimer pricing tiers
5. **Landing Page**: Create CueTimer-specific landing content

### **Phase 2: Blog Content & Customization (Week 2)**
1. **Content Strategy**: Create CueTimer-focused blog categories
2. **Content Migration**: Replace landscaping posts with event management content
3. **Component Customization**: Update MDX components with CueTimer branding
4. **SEO Configuration**: Update metadata and structured data for CueTimer topics
5. **Content Creation**: Write initial blog posts for event management keywords

### **Phase 3: Integration & Testing (Week 3)**
1. **User Flow Testing**: Complete signup → payment → blog access
2. **Content Creation**: Add initial blog posts
3. **Performance Optimization**: Optimize loading speeds
4. **Mobile Testing**: Ensure responsive design
5. **Analytics Setup**: Add tracking and monitoring

## 📋 Content Strategy Integration

### **Blog Categories for CueTimer (MDX Frontmatter)**
```yaml
---
title: "How to Keep Your Conference on Schedule"
slug: "keep-conference-on-schedule"
category: "event-management"  # Updated from "pricing" | "operations" | "tools"
author: "CueTimer Team"
publishedAt: "2025-10-24"
summary: "Professional strategies for maintaining perfect event timing"
readTime: 8
image: "/images/conference-timing.jpg"
featured: true
draft: false
tags: ["conference", "timing", "event-management", "professional"]
seo:
  description: "Learn professional strategies to keep your conference running on schedule with CueTimer"
  keywords: ["conference timing", "event management", "schedule management"]
imageAlt: "Conference presenter on stage with timer display"
---
```

**Content Categories:**
1. **event-management** - Professional event strategies
2. **technical-tutorials** - Timer setup and features
3. **industry-insights** - Event technology trends
4. **case-studies** - Success stories and use cases
5. **product-updates** - New features and announcements

## 🎨 Design Adaptation

### **CueTimer Brand Colors**
```css
/* Update Tailwind config */
theme: {
  extend: {
    colors: {
      brand: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        900: '#0c4a6e'
      }
    }
  }
}
```

### **Component Customization**
- **Buttons**: Use CueTimer brand colors
- **Typography**: Maintain professional event industry feel
- **Icons**: Event and timing-related iconography
- **Layout**: Focus on mobile event manager workflows

## 🔧 Technical Considerations

### **SEO Optimization**
- **Blog Posts**: Optimize for event management keywords
- **Structured Data**: Add Article schema for blog content
- **Meta Tags**: Dynamic meta tags for each page
- **Sitemap**: Auto-generate sitemap with blog posts

### **Performance**
- **Image Optimization**: Next.js Image component for blog images
- **Code Splitting**: Separate bundles for marketing vs app
- **Caching**: Implement proper caching strategies
- **CDN**: Leverage Vercel's Edge Network

### **Security**
- **Webhook Validation**: Verify Stripe webhook signatures
- **Content Security**: Sanitize user-generated blog content
- **Rate Limiting**: Implement API rate limiting
- **Authentication**: Proper Supabase RLS policies

## 📊 Success Metrics

### **Marketing Site Metrics**
- **Conversion Rate**: Signups from landing page
- **Blog Engagement**: Time on page, scroll depth
- **SEO Performance**: Organic traffic growth
- **Social Sharing**: Blog post share metrics

### **Business Metrics**
- **Free to Pro Conversion**: % upgrading to paid plans
- **User Acquisition**: Cost per acquisition by channel
- **Content ROI**: Leads generated from blog content
- **Brand Awareness**: Direct traffic and brand searches

---

## 🎯 Next Steps

1. **Immediate Actions**
   - Clone QuoteKit repository
   - Set up Supabase project for CueTimer
   - Configure Stripe account with CueTimer products
   - Begin branding customization

2. **Development Priorities**
   - Implement blog database schema
   - Create blog admin interface
   - Write initial content strategy
   - Set up analytics and monitoring

3. **Launch Preparation**
   - Content creation for launch
   - SEO optimization
   - Performance testing
   - Marketing material preparation

This integration provides CueTimer with a professional marketing foundation while allowing us to focus development resources on the core timer application functionality.

---

**Document Status:** Ready for Implementation
**Dependencies:** QuoteKit repository access, Supabase setup, Stripe configuration
**Timeline:** 3 weeks to complete integration and launch