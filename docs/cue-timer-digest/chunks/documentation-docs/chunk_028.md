# Chunk 28: documentation_docs

## Metadata

- **Files**: 1
- **Size**: 29,518 characters (~7,379 tokens)
- **Categories**: documentation

## Files in this chunk

- `docs/blog-management/CLI-REFERENCE.md`

---

## File: `docs/blog-management/CLI-REFERENCE.md`

````markdown
# CLI Reference Guide

**Complete command-line interface documentation for the CueTimer Blog Management
System**

---

## 🎯 Overview

The CueTimer Blog Management System includes 5 powerful CLI tools designed to
streamline content creation, publishing, optimization, and workflow management.
Each tool is built with TypeScript for type safety and includes comprehensive
error handling and user feedback.

## 🛠️ Available CLI Tools

| Tool                     | Command                        | Purpose                             | Key Features                                  |
| ------------------------ | ------------------------------ | ----------------------------------- | --------------------------------------------- |
| **Blog Create**          | `bun run blog:create`          | Content creation with templates     | Interactive mode, multi-language, validation  |
| **Blog Publish**         | `bun run blog:publish`         | Publishing workflow management      | Draft management, scheduling, status tracking |
| **Blog Analytics**       | `bun run blog:analytics`       | Performance analytics and reporting | Metrics, insights, data export                |
| **Blog SEO Check**       | `bun run blog:seo-check`       | SEO optimization and analysis       | Scoring, recommendations, batch processing    |
| **Blog Workflow Status** | `bun run blog:workflow:status` | Workflow management and monitoring  | Progress tracking, status reports             |

---

## 📝 Blog Create Tool

### Command Overview

```bash
bun run blog:create [options]
```
````

Creates new blog posts using specialized templates with intelligent content
generation and multi-language support.

### Usage Examples

#### Interactive Mode (Recommended)

```bash
bun run blog:create
```

Launches an interactive wizard that guides you through:

- Template selection
- Variable input
- Language selection
- Content generation
- File creation

#### Quick Creation with Template

```bash
bun run blog:create --template "timing-guide" --title "Mastering Presentation Timing" --author "Your Name"
```

#### Multi-Language Content Creation

```bash
# Create English version
bun run blog:create --template "case-study" --title "Success Story" --language "en" --author "Marketing Team"

# Create Portuguese version
bun run blog:create --template "case-study" --title "História de Sucesso" --language "pt-br" --author "Equipe de Marketing"
```

#### Advanced Usage with Custom Variables

```bash
bun run blog:create \
  --template "feature-announce" \
  --title "New Analytics Dashboard" \
  --variables '{"featureName": "Analytics Dashboard", "version": "2.0", "releaseDate": "2025-01-15"}' \
  --author "Product Team"
```

### Command Options

| Option              | Type    | Required | Description                      | Example                        |
| ------------------- | ------- | -------- | -------------------------------- | ------------------------------ |
| `--template, -t`    | string  | ❌       | Template to use                  | `timing-guide`                 |
| `--title`           | string  | ❌       | Blog post title                  | `"Advanced Timing Techniques"` |
| `--author`          | string  | ❌       | Author name                      | `"Jane Smith"`                 |
| `--language, -l`    | string  | ❌       | Content language                 | `pt-br`                        |
| `--variables, -v`   | JSON    | ❌       | Template variables (JSON string) | `'{"difficulty": "advanced"}'` |
| `--draft, -d`       | boolean | ❌       | Create as draft                  | `true`                         |
| `--output, -o`      | string  | ❌       | Output directory                 | `content/blog/custom`          |
| `--interactive, -i` | boolean | ❌       | Force interactive mode           | `true`                         |
| `--help, -h`        | boolean | ❌       | Show help                        | N/A                            |

### Available Templates

| Template ID         | Name                 | Category                 | Use Case                  |
| ------------------- | -------------------- | ------------------------ | ------------------------- |
| `timing-guide`      | Timing Guide         | Tutorial                 | Step-by-step guides       |
| `case-study`        | Case Study           | Success Story            | Real-world applications   |
| `feature-announce`  | Feature Announcement | Product News             | New features and updates  |
| `presentation-tips` | Presentation Tips    | Professional Development | Best practices and advice |

### Template Variable Examples

#### Timing Guide Variables

```json
{
  "targetAudience": "Professional speakers",
  "difficultyLevel": "intermediate",
  "estimatedTime": 45,
  "prerequisites": ["Basic presentation skills"],
  "steps": [
    {
      "title": "Preparation Phase",
      "description": "Set up your timing equipment",
      "timeAllocation": 15,
      "tips": ["Test all equipment beforehand"]
    }
  ]
}
```

#### Case Study Variables

```json
{
  "clientName": "TechCorp Summit",
  "industry": "Technology",
  "eventSize": "500+ attendees",
  "challenge": "Multi-track session management",
  "results": ["95% on-time sessions", "30% improvement in engagement"],
  "metrics": [
    {
      "category": "efficiency",
      "before": 60,
      "after": 95,
      "improvement": "58% better",
      "unit": "on-time percentage"
    }
  ]
}
```

### Output Structure

The tool creates content in the following structure:

```
content/blog/
├── YYYY/
│   ├── MM/
│   │   ├── post-slug.mdx
│   │   ├── post-slug-pt-br.mdx
│   │   └── post-slug-es.mdx
```

### Error Handling

The tool provides clear error messages for common issues:

- Missing required variables
- Invalid template selection
- File system permissions
- Template validation errors

### Tips and Best Practices

1. **Use Interactive Mode** for complex templates
2. **Save Variable JSON** for reuse in similar posts
3. **Test Templates** with small datasets first
4. **Review Generated Content** before publishing
5. **Use Consistent Naming** for better organization

---

## 🚀 Blog Publish Tool

### Command Overview

```bash
bun run blog:publish [options]
```

Manages the publishing workflow, including draft management, scheduling, and
publication status tracking.

### Usage Examples

#### List All Posts

```bash
bun run blog:publish --list
```

Shows all blog posts with their current status:

- Draft posts
- Scheduled posts
- Published posts
- Posts needing review

#### Publish a Specific Post

```bash
bun run blog:publish --post "timing-guide-advanced" --action publish
```

#### Schedule Publication

```bash
bun run blog:publish --post "feature-announcement" --action schedule --date "2025-02-01T10:00:00Z"
```

#### Batch Operations

```bash
# Publish all approved drafts
bun run blog:publish --category "draft" --action publish --batch

# Update publish dates for a category
bun run blog:publish --category "timing-guide" --action update-date --date "2025-01-25"
```

### Command Options

| Option           | Type    | Required | Description            | Example                   |
| ---------------- | ------- | -------- | ---------------------- | ------------------------- |
| `--post, -p`     | string  | ❌       | Specific post slug     | `"timing-guide-advanced"` |
| `--action, -a`   | string  | ❌       | Action to perform      | `publish`                 |
| `--date, -d`     | string  | ❌       | Schedule date          | `"2025-01-25T10:00:00Z"`  |
| `--category, -c` | string  | ❌       | Filter by category     | `"timing-guide"`          |
| `--list, -l`     | boolean | ❌       | List posts with status | `true`                    |
| `--batch, -b`    | boolean | ❌       | Batch operation mode   | `true`                    |
| `--force, -f`    | boolean | ❌       | Force operation        | `true`                    |
| `--dry-run, -n`  | boolean | ❌       | Preview changes only   | `true`                    |
| `--help, -h`     | boolean | ❌       | Show help              | N/A                       |

### Available Actions

| Action        | Description                     | Use Case                 |
| ------------- | ------------------------------- | ------------------------ |
| `publish`     | Publish draft immediately       | Ready-to-publish content |
| `schedule`    | Schedule for future publication | Time-sensitive content   |
| `unpublish`   | Return to draft status          | Content corrections      |
| `update-date` | Change publication date         | Rescheduling             |
| `archive`     | Archive old content             | Content cleanup          |
| `delete`      | Remove post permanently         | Content removal          |

### Status Indicators

| Status      | Meaning                   | Action Required     |
| ----------- | ------------------------- | ------------------- |
| `draft`     | Unpublished content       | Review and publish  |
| `scheduled` | Scheduled for publication | Wait or reschedule  |
| `published` | Live content              | Monitor performance |
| `archived`  | Hidden from public        | Restore or delete   |
| `error`     | Publication failed        | Fix and retry       |

### Workflow Management

#### Standard Publishing Workflow

```bash
# 1. Review drafts
bun run blog:publish --list --category "draft"

# 2. Preview content
bun run blog:publish --post "new-post" --dry-run

# 3. Publish content
bun run blog:publish --post "new-post" --action publish

# 4. Verify publication
bun run blog:publish --post "new-post" --list
```

#### Batch Publishing Workflow

```bash
# 1. Check all drafts
bun run blog:publish --list --category "draft"

# 2. Preview batch changes
bun run blog:publish --category "draft" --action publish --dry-run --batch

# 3. Execute batch publish
bun run blog:publish --category "draft" --action publish --batch
```

### Scheduling Examples

#### Schedule Multiple Posts

```bash
# Schedule timing guides for weekly release
bun run blog:publish --category "timing-guide" --action schedule --date "2025-02-01T10:00:00Z" --batch

# Schedule feature announcements
bun run blog:publish --category "feature-announce" --action schedule --date "2025-02-15T09:00:00Z"
```

#### Reschedule Content

```bash
# Move all Monday posts to Wednesday
bun run blog:publish --category "timing-guide" --action update-date --date "2025-02-03T10:00:00Z" --batch
```

---

## 📊 Blog Analytics Tool

### Command Overview

```bash
bun run blog:analytics [options]
```

Provides comprehensive analytics and performance insights for blog content,
including engagement metrics, SEO performance, and content trends.

### Usage Examples

#### Overall Analytics Summary

```bash
bun run blog:analytics --period "30d"
```

#### Category-Specific Analytics

```bash
bun run blog:analytics --category "timing-guide" --period "90d"
```

#### Export Analytics Data

```bash
# Export to CSV
bun run blog:analytics --export --format csv --output "analytics-report.csv"

# Export to JSON
bun run blog:analytics --export --format json --output "analytics-data.json"
```

#### Performance Insights

```bash
bun run blog:analytics --insights --category "all"
```

### Command Options

| Option           | Type    | Required | Description              | Example            |
| ---------------- | ------- | -------- | ------------------------ | ------------------ |
| `--period, -p`   | string  | ❌       | Time period for analysis | `30d`, `90d`, `1y` |
| `--category, -c` | string  | ❌       | Filter by category       | `timing-guide`     |
| `--post, -o`     | string  | ❌       | Specific post analysis   | `"post-slug"`      |
| `--export, -e`   | boolean | ❌       | Export data              | `true`             |
| `--format, -f`   | string  | ❌       | Export format            | `csv`, `json`      |
| `--output, -o`   | string  | ❌       | Output file path         | `analytics.csv`    |
| `--insights, -i` | boolean | ❌       | Generate insights        | `true`             |
| `--compare, -C`  | string  | ❌       | Compare with period      | `previous`         |
| `--help, -h`     | boolean | ❌       | Show help                | N/A                |

### Available Metrics

#### Engagement Metrics

- **Page Views**: Total page views per post
- **Read Time**: Average time spent on content
- **Bounce Rate**: Percentage of single-page visits
- **Social Shares**: Social media engagement
- **Comments**: User comments and interactions

#### SEO Metrics

- **Search Rankings**: Keyword ranking positions
- **Organic Traffic**: Search engine traffic
- **Click-Through Rate**: Search CTR performance
- **Backlinks**: Inbound link count
- **SEO Score**: Overall SEO health score

#### Content Performance

- **Conversion Rate**: Goal completion rate
- **Lead Generation**: MQL/SQL generation
- **User Retention**: Return visitor rate
- **Content Depth**: Scroll depth and engagement
- **Mobile Performance**: Mobile user engagement

### Analytics Output Examples

#### Summary Report

```
📊 Blog Analytics Summary (Last 30 Days)

📈 Overall Performance
- Total Views: 12,543 (+23% vs previous period)
- Average Read Time: 4m 32s (+15%)
- Bounce Rate: 34% (-8%)
- SEO Score: 87/100 (+5)

📝 Top Performing Content
1. "Advanced Timing Techniques" - 2,341 views
2. "Q&A Session Management" - 1,876 views
3. "Virtual Presentation Tips" - 1,543 views

🏷️ Category Performance
- Timing Guides: 5,432 views, 4m 45s avg read time
- Case Studies: 3,876 views, 5m 12s avg read time
- Feature Announcements: 2,234 views, 3m 28s avg read time
- Presentation Tips: 1,001 views, 4m 05s avg read time
```

#### Insights Report

```
💡 Content Insights

🎯 Opportunities
- "Timing Guides" category shows 45% higher engagement
- Posts with video content have 2x longer read time
- Mobile users prefer shorter, more visual content

📈 Trends
- "Virtual presentations" keyword trending up 67%
- Weekend traffic increased by 23%
- Portuguese content showing strong growth

⚠️ Areas for Improvement
- Case studies need stronger CTAs
- Feature announcements have high bounce rate
- Consider more interactive content for engagement
```

### Export Formats

#### CSV Export Structure

```csv
post_slug,category,views,read_time,bounce_rate,seo_score,publish_date
"timing-guide-advanced","timing-guide",2341,272,0.34,87,"2025-01-15"
"case-study-techcorp","case-study",1876,312,0.28,91,"2025-01-10"
```

#### JSON Export Structure

```json
{
  "period": "30d",
  "generated_at": "2025-01-25T10:00:00Z",
  "summary": {
    "total_views": 12543,
    "average_read_time": 272,
    "bounce_rate": 0.34,
    "seo_score": 87
  },
  "posts": [
    {
      "slug": "timing-guide-advanced",
      "category": "timing-guide",
      "metrics": {
        "views": 2341,
        "read_time": 272,
        "bounce_rate": 0.34,
        "seo_score": 87
      }
    }
  ]
}
```

---

## 🔍 Blog SEO Check Tool

### Command Overview

```bash
bun run blog:seo-check [options]
```

Analyzes and optimizes blog content for search engine performance, providing
scoring, recommendations, and automated improvements.

### Usage Examples

#### Check Single Post

```bash
bun run blog:seo-check --file "content/blog/2025/01/timing-guide-advanced.mdx"
```

#### Batch SEO Analysis

```bash
bun run blog:seo-check --directory "content/blog/2025" --recommendations
```

#### Generate SEO Report

```bash
bun run blog:seo-check --output "seo-report.html" --format html
```

#### Fix SEO Issues Automatically

```bash
bun run blog:seo-check --fix --directory "content/blog/2025" --auto-fix
```

### Command Options

| Option                  | Type    | Required | Description                 | Example                           |
| ----------------------- | ------- | -------- | --------------------------- | --------------------------------- |
| `--file, -f`            | string  | ❌       | Specific file to check      | `"content/blog/2025/01/post.mdx"` |
| `--directory, -d`       | string  | ❌       | Directory to check          | `"content/blog/2025"`             |
| `--recommendations, -r` | boolean | ❌       | Generate recommendations    | `true`                            |
| `--output, -o`          | string  | ❌       | Output file path            | `"seo-report.html"`               |
| `--format, -F`          | string  | ❌       | Output format               | `html`, `json`, `text`            |
| `--fix, -x`             | boolean | ❌       | Fix issues automatically    | `true`                            |
| `--auto-fix, -a`        | boolean | ❌       | Apply all recommended fixes | `true`                            |
| `--threshold, -t`       | number  | ❌       | Minimum score threshold     | `80`                              |
| `--help, -h`            | boolean | ❌       | Show help                   | N/A                               |

### SEO Analysis Categories

#### Content Optimization

- **Title Tags**: Length, keywords,吸引力
- **Meta Descriptions**: Length, CTR optimization
- **Header Structure**: H1-H6 hierarchy
- **Content Length**: Adequate word count
- **Keyword Density**: Optimal keyword usage

#### Technical SEO

- **URL Structure**: Clean, descriptive URLs
- **Internal Links**: Link distribution and anchor text
- **Image Optimization**: Alt tags, file sizes
- **Schema Markup**: Structured data implementation
- **Page Speed**: Loading performance

#### User Experience

- **Readability**: Content structure and clarity
- **Mobile Optimization**: Mobile-friendly content
- **Navigation**: Easy content discovery
- **Engagement**: User interaction metrics
- **Accessibility**: WCAG compliance

### SEO Scoring System

#### Score Calculation

- **Content Quality**: 40% of total score
- **Technical SEO**: 30% of total score
- **User Experience**: 20% of total score
- **Performance**: 10% of total score

#### Score Interpretation

- **90-100**: Excellent SEO optimization
- **80-89**: Good optimization with minor improvements
- **70-79**: Adequate optimization needs improvements
- **60-69**: Poor optimization requires significant work
- **Below 60**: Critical SEO issues need immediate attention

### Sample SEO Report

#### HTML Report Output

```html
<!DOCTYPE html>
<html>
  <head>
    <title>SEO Analysis Report - CueTimer Blog</title>
  </head>
  <body>
    <h1>SEO Analysis Report</h1>
    <div class="summary">
      <h2>Overall Score: 87/100</h2>
      <div class="score-breakdown">
        <div class="category">
          <h3>Content Quality: 92/100</h3>
          <ul>
            <li>✅ Title length optimal (56 characters)</li>
            <li>✅ Meta description compelling (158 characters)</li>
            <li>⚠️ Consider adding more internal links</li>
          </ul>
        </div>
      </div>
    </div>
  </body>
</html>
```

#### JSON Report Structure

```json
{
  "analysis_date": "2025-01-25T10:00:00Z",
  "overall_score": 87,
  "categories": {
    "content_quality": {
      "score": 92,
      "issues": [
        {
          "type": "recommendation",
          "message": "Add 2-3 more internal links",
          "impact": "medium"
        }
      ]
    },
    "technical_seo": {
      "score": 85,
      "issues": [
        {
          "type": "warning",
          "message": "Image alt text missing on 1 image",
          "impact": "low"
        }
      ]
    }
  },
  "recommendations": [
    {
      "category": "content",
      "priority": "medium",
      "action": "Add internal links to related content",
      "impact": "Improved navigation and SEO"
    }
  ]
}
```

### Automated Fixing

#### Supported Auto-Fixes

- **Meta Description**: Generate optimal meta descriptions
- **Title Optimization**: Improve title tags for SEO
- **Header Structure**: Fix H1-H6 hierarchy issues
- **Internal Links**: Add relevant internal links
- **Image Alt Text**: Generate descriptive alt text

#### Safe Fixing Guidelines

- Creates backup before any modifications
- Reviews changes before applying
- Provides change summary
- Allows selective fix application

---

## 📋 Blog Workflow Status Tool

### Command Overview

```bash
bun run blog:workflow:status [options]
```

Monitors and manages the entire content creation workflow, tracking progress
from creation through publication and beyond.

### Usage Examples

#### Overall System Status

```bash
bun run blog:workflow:status
```

#### Track Specific Post Workflow

```bash
bun run blog:workflow:status --post "timing-guide-advanced" --detailed
```

#### Translation Workflow Status

```bash
bun run blog:workflow:status --type "translations" --language "pt-br"
```

#### Generate Workflow Report

```bash
bun run blog:workflow:status --report --output "workflow-status.html"
```

### Command Options

| Option           | Type    | Required | Description            | Example                   |
| ---------------- | ------- | -------- | ---------------------- | ------------------------- |
| `--post, -p`     | string  | ❌       | Specific post to track | `"timing-guide-advanced"` |
| `--type, -t`     | string  | ❌       | Workflow type          | `translations`            |
| `--category, -c` | string  | ❌       | Filter by category     | `"timing-guide"`          |
| `--language, -l` | string  | ❌       | Language filter        | `"pt-br"`                 |
| `--status, -s`   | string  | ❌       | Status filter          | `"in-review"`             |
| `--detailed, -d` | boolean | ❌       | Detailed status view   | `true`                    |
| `--report, -r`   | boolean | ❌       | Generate report        | `true`                    |
| `--output, -o`   | string  | ❌       | Report output file     | `"workflow.html"`         |
| `--help, -h`     | boolean | ❌       | Show help              | N/A                       |

### Workflow States

#### Content Creation Workflow

1. **Draft** (`draft`)
   - Initial content creation
   - Template-based generation
   - Initial review and editing

2. **In Review** (`in-review`)
   - Content review process
   - SEO optimization
   - Quality assurance checks

3. **Approved** (`approved`)
   - Ready for publication
   - Final approvals completed
   - Scheduling preparation

4. **Scheduled** (`scheduled`)
   - Publication scheduled
   - Automatic publishing setup
   - Pre-publication checks

5. **Published** (`published`)
   - Live content
   - Performance monitoring
   - Ongoing optimization

#### Translation Workflow

1. **Master Created** (`master-created`)
   - Primary language content ready
   - Translation project initiated
   - Translation requirements defined

2. **In Translation** (`in-translation`)
   - Translation in progress
   - Cultural adaptation
   - Language-specific optimization

3. **Translation Review** (`translation-review`)
   - Native speaker review
   - Quality assurance
   - Cultural validation

4. **Translation Approved** (`translation-approved`)
   - Translation ready for publication
   - Final checks completed
   - Synchronization prepared

5. **Published** (`published`)
   - Multi-language content live
   - Performance tracking per language
   - Ongoing optimization

### Status Output Examples

#### Overall System Status

```
📋 CueTimer Blog Workflow Status

📊 Content Overview
- Total Posts: 47
- Published: 32
- In Review: 8
- Draft: 5
- Scheduled: 2

🌍 Multi-Language Status
- English: 47 posts (100%)
- Portuguese: 23 posts (49%)
- Spanish: 18 posts (38%)

📝 Category Status
- Timing Guides: 18 posts (4 draft, 2 in review, 12 published)
- Case Studies: 12 posts (1 draft, 3 in review, 8 published)
- Feature Announcements: 10 posts (0 draft, 2 in review, 8 published)
- Presentation Tips: 7 posts (0 draft, 1 in review, 6 published)

⚠️ Attention Required
- 5 posts need review (older than 14 days in draft)
- 3 translations pending approval
- 2 posts scheduled for publication today
```

#### Detailed Post Status

```
📝 Post: "Advanced Timing Techniques"
📂 Category: timing-guide
🌍 Languages: English (master), Portuguese (in-translation), Spanish (planned)

🔄 Workflow Status
✅ English: Published (2025-01-15)
  - SEO Score: 92/100
  - Performance: Above average
  - Last Updated: 2025-01-20

🔄 Portuguese: In Translation (75% complete)
  - Translator: Maria Silva
  - Started: 2025-01-18
  - ETA: 2025-01-25
  - Issues: Technical terminology review needed

⏳ Spanish: Planned
  - Priority: Medium
  - ETA: 2025-02-01
  - Assigned: Not yet

📊 Performance Metrics
- Views: 2,341 (English only)
- Read Time: 4m 32s
- Engagement: High
- SEO Performance: Excellent
```

### Workflow Automation

#### Automated Notifications

- **Draft Aging**: Alert when drafts are older than 7 days
- **Review Reminders**: Notify reviewers of pending content
- **Translation Deadlines**: Alert on translation ETA approaching
- **Publication Scheduling**: Remind of scheduled publications

#### Workflow Triggers

- **Content Ready**: Auto-move to review when SEO score > 80
- **Translation Complete**: Auto-notify reviewers when translation finished
- **Performance Drop**: Alert when published content performance declines
- **Scheduled Publishing**: Auto-publish at scheduled time

---

## 🔧 Advanced CLI Features

### Configuration Files

#### Global Configuration (`~/.cuetimer/config.json`)

```json
{
  "defaultAuthor": "CueTimer Team",
  "defaultLanguage": "en",
  "contentDirectory": "content/blog",
  "templatesDirectory": "lib/blog-scripts/templates",
  "seo": {
    "minScore": 80,
    "autoFix": false
  },
  "analytics": {
    "defaultPeriod": "30d",
    "exportFormat": "json"
  }
}
```

#### Project Configuration (`./cuetimer.config.json`)

```json
{
  "project": {
    "name": "CueTimer Blog",
    "version": "1.0.0"
  },
  "content": {
    "categories": [
      "timing-guide",
      "case-study",
      "feature-announce",
      "presentation-tips"
    ],
    "languages": ["en", "pt-br", "es"],
    "defaultTags": ["presentation", "timing", "professional"]
  },
  "workflow": {
    "reviewers": ["editor@cuetimer.com", "content@cuetimer.com"],
    "approvalRequired": true,
    "autoSchedule": false
  }
}
```

### Environment Variables

#### Configuration Options

```bash
# Default settings
export CUETIMER_DEFAULT_AUTHOR="Your Name"
export CUETIMER_DEFAULT_LANGUAGE="en"
export CUETIMER_CONTENT_DIR="custom/content/path"

# API Configuration
export CUETIMER_ANALYTICS_API_KEY="your-api-key"
export CUETIMER_SEO_SERVICE_URL="https://seo-api.example.com"

# Workflow Configuration
export CUETIMER_WORKFLOW_WEBHOOK="https://webhook.example.com/workflow"
export CUETIMER_NOTIFICATION_EMAIL="team@example.com"
```

### Integration Examples

#### CI/CD Pipeline Integration

```bash
#!/bin/bash
# ci-blog-check.sh

echo "🔍 Running blog content checks..."

# Type checking
bun run type-check

# SEO validation
bun run blog:seo-check --directory "content/blog" --threshold 80
if [ $? -ne 0 ]; then
  echo "❌ SEO validation failed"
  exit 1
fi

# Workflow status check
bun run blog:workflow:status --type "draft" --detailed

echo "✅ All checks passed"
```

#### Git Hooks Integration

```bash
#!/bin/bash
# pre-commit hook

# Check new blog posts
NEW_POSTS=$(git diff --cached --name-only | grep "content/blog.*\.mdx")
if [ ! -z "$NEW_POSTS" ]; then
  echo "🔍 Checking new blog posts..."
  for post in $NEW_POSTS; do
    bun run blog:seo-check --file "$post" --threshold 75
  done
fi
```

### Performance Optimization

#### Batch Processing

```bash
# Process multiple posts efficiently
bun run blog:seo-check --directory "content/blog" --parallel 4 --threshold 80

# Batch publishing with validation
bun run blog:publish --category "draft" --action publish --batch --validate
```

#### Caching

```bash
# Enable caching for repeated operations
export CUETIMER_CACHE_ENABLED=true
export CUETIMER_CACHE_DIR=".cuetimer/cache"

# Clear cache if needed
bun run blog:workflow:status --clear-cache
```

---

## 🛠️ Troubleshooting

### Common Issues

#### Permission Errors

```bash
# Fix file permissions
chmod -R 755 content/blog/
chown -R $USER:$USER content/blog/
```

#### Template Validation Errors

```bash
# Check template syntax
bun run blog:create --template "timing-guide" --validate-template

# List available templates
bun run blog:create --list-templates
```

#### SEO Check Failures

```bash
# Run with verbose output
bun run blog:seo-check --file "post.mdx" --verbose

# Check specific SEO categories
bun run blog:seo-check --file "post.mdx" --check "content,technical"
```

#### Workflow Issues

```bash
# Reset workflow status
bun run blog:workflow:status --post "problem-post" --reset

# Check workflow configuration
bun run blog:workflow:status --check-config
```

### Debug Mode

Enable debug logging for troubleshooting:

```bash
export CUETIMER_DEBUG=true
export CUETIMER_LOG_LEVEL=debug

bun run blog:create --template "timing-guide" --title "Debug Test"
```

### Getting Help

#### Command Help

```bash
# General help
bun run blog:create --help

# Template-specific help
bun run blog:create --template "timing-guide" --help-template

# SEO check help
bun run blog:seo-check --help-examples
```

#### Support Resources

- **Documentation**: [Template Reference](./TEMPLATES.md)
- **Workflow Guide**: [Workflow Documentation](./WORKFLOW.md)
- **Troubleshooting**: [Troubleshooting Guide](./TROUBLESHOOTING.md)
- **Community**:
  [GitHub Discussions](https://github.com/your-org/cue-timer/discussions)

---

_For additional help or questions, refer to the comprehensive
[troubleshooting guide](./TROUBLESHOOTING.md) or contact our support team._

```

```
