# Feature Announcement Template

This template helps you create compelling and professional feature announcements
for the CueTimer blog. It's designed to effectively communicate new product
capabilities, highlight benefits, and drive user adoption.

## Overview

The Feature Announcement Template generates MDX-formatted blog posts that
include:

- Engaging product launch messaging
- Clear feature benefits and use cases
- Professional marketing content
- Call-to-action elements
- Multiple content sections for comprehensive coverage

## Quick Start

```typescript
import {
  createFeatureAnnounceVariables,
  generateFeatureAnnounceContent,
} from './lib/blog-scripts/templates/feature-announce';

// Create with minimal configuration
const variables = createFeatureAnnounceVariables({
  title: 'Introducing Dark Mode',
  featureName: 'Dark Mode',
  version: '3.1.5',
  benefits: ['Reduced eye strain', 'Better visibility'],
  useCases: ['Evening presentations', 'Dark environments'],
});

// Generate MDX content
const content = generateFeatureAnnounceContent(variables);
```

## Template Structure

### Required Variables

| Variable      | Type     | Description                  |
| ------------- | -------- | ---------------------------- |
| `title`       | string   | Feature announcement title   |
| `featureName` | string   | Name of the feature          |
| `version`     | string   | Version number               |
| `description` | string   | Detailed feature description |
| `benefits`    | string[] | Key benefits array           |
| `useCases`    | string[] | Example use cases array      |

### Optional Variables

| Variable              | Type     | Description                       |
| --------------------- | -------- | --------------------------------- |
| `releaseDate`         | string   | Release date (defaults to today)  |
| `videoUrl`            | string   | Demo video URL                    |
| `screenshots`         | array    | Feature screenshots with captions |
| `breakingChanges`     | string[] | Breaking changes list             |
| `upgradeInstructions` | string   | Upgrade guide                     |
| `technicalDetails`    | array    | Technical implementation details  |
| `pricing`             | object   | Pricing information               |
| `testimonials`        | array    | Early user feedback               |

## Content Sections

The template generates these sections in order:

1. **Announcement** - Exciting launch introduction
2. **What It Does** - Detailed feature description
3. **Key Benefits** - Value proposition highlights
4. **Perfect For** - Target use cases and scenarios
5. **Getting Started** - Quick start guide
6. **Try It Today** - Call-to-action and next steps

## Example Usage

### Complete Feature Announcement

```typescript
const variables: FeatureAnnounceVariables = {
  title: 'Introducing Real-Time Collaboration: Present Together, Perfectly',
  featureName: 'Real-Time Collaboration',
  version: '3.2.0',
  description:
    'Real-Time Collaboration allows multiple presenters to coordinate seamlessly...',
  benefits: [
    'Synchronize timing across multiple speakers automatically',
    'Share real-time notes and cues with your presentation team',
    'Reduce handoff delays by 75% between speakers',
  ],
  useCases: [
    'Corporate all-hands meetings with multiple presenters',
    'Conference panels with scheduled speaking segments',
    'Team presentations with coordinated demonstrations',
  ],
  releaseDate: '2025-11-15',
  videoUrl: 'https://www.youtube.com/watch?v=cuetimer-realtime-collab',
  screenshots: [
    {
      url: '/images/features/realtime-collab-dashboard.png',
      alt: 'Real-Time Collaboration dashboard',
      caption: 'See all presenters in one unified view',
    },
  ],
  testimonials: [
    {
      text: 'Real-Time Collaboration has transformed our quarterly meetings...',
      author: 'Sarah Chen',
      role: 'Head of Communications',
      company: 'TechCorp Solutions',
    },
  ],
};

const content = generateFeatureAnnounceContent(variables);
```

### Simple Feature Announcement

```typescript
const variables = createFeatureAnnounceVariables({
  title: 'Dark Mode: Present Comfortably Anytime',
  featureName: 'Dark Mode',
  version: '3.1.5',
  benefits: [
    'Reduced eye strain during long presentations',
    'Better visibility in dark presentation rooms',
  ],
  useCases: [
    'Evening presentations and conferences',
    'Dark auditorium environments',
  ],
});

const content = generateFeatureAnnounceContent(variables);
```

## Generated Content Features

### Frontmatter

The template automatically generates comprehensive frontmatter including:

- Title, category, summary
- Version and release date
- Read time calculation
- SEO-optimized tags
- Language and modification timestamp

### Visual Elements

- Hero section with gradient background
- Feature showcase with screenshots
- Video embed support
- Responsive grid layouts
- Call-to-action buttons

### Content Sections

- **Benefits Section**: Highlighted with icons and cards
- **Use Cases**: Organized with descriptive examples
- **Getting Started**: Step-by-step instructions
- **Technical Details**: Implementation information (optional)
- **Testimonials**: Social proof from early users (optional)

### Marketing Elements

- Exciting launch messaging
- Clear value propositions
- Action-oriented language
- Professional presentation
- SEO-optimized structure

## Best Practices

### Content Guidelines

1. **Focus on Benefits**: Emphasize what users gain, not just what the feature
   does
2. **Use Specific Numbers**: Quantify benefits whenever possible (e.g., "Save
   30% time")
3. **Include Social Proof**: Add testimonials from real users when available
4. **Clear Call-to-Action**: Tell users exactly what to do next
5. **Visual Content**: Include screenshots and videos when possible

### SEO Optimization

1. **Descriptive Titles**: Include feature name and key benefit
2. **Relevant Tags**: Use feature-related keywords
3. **Structured Content**: Use proper heading hierarchy
4. **Meta Descriptions**: Include key benefits in summary

### Timing and Release

1. **Consistent Versioning**: Follow semantic versioning
2. **Release Date**: Use actual release date
3. **Breaking Changes**: Clearly communicate any disruptions
4. **Upgrade Instructions**: Provide clear migration steps

## File Integration

The template integrates seamlessly with the existing CueTimer blog system:

1. **Content Generation**: Use `generateFeatureAnnounceContent()` to create MDX
2. **File Creation**: Save to your blog content directory
3. **Multi-language**: Template supports EN, PT-BR, and ES languages
4. **Workflow**: Compatible with existing blog workflow systems

## Customization

You can customize the template by:

1. **Modifying Variables**: Add new variables to the interface
2. **Adjusting Content Structure**: Update the contentStructure array
3. **Styling Changes**: Modify Tailwind classes in the generated MDX
4. **Adding Sections**: Include new content sections as needed

## Examples

See `/lib/blog-scripts/examples/feature-announce-example.ts` for complete
working examples:

- Complete feature announcement with all options
- Simple announcement with minimal configuration
- Technical feature announcement for developers
- Mobile app feature announcement

## Support

For questions or issues with the Feature Announcement Template:

1. Check the example files for reference implementations
2. Review the template structure documentation
3. Contact the development team for custom requirements

---

**File Location**: `/lib/blog-scripts/templates/feature-announce.ts`
**Examples**: `/lib/blog-scripts/examples/feature-announce-example.ts`
**Category**: `feature-announce` **Languages**: `en`, `pt-br`, `es`
