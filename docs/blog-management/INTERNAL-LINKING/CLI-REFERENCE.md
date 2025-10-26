# Internal Linking Automation - CLI Reference

**Complete command-line interface reference for the CueTimer internal linking
system**

---

## 🎯 Overview

The Internal Linking CLI provides powerful command-line tools for analyzing,
managing, and optimizing internal links across your CueTimer blog content. This
reference covers all available commands, options, and usage patterns.

---

## 🚀 Quick Start

### Installation

The CLI is included with the CueTimer Blog Management System:

```bash
# Verify CLI is available
bun run blog:internal-links --help

# Check version
bun run blog:internal-links --version
```

### Basic Usage

```bash
# Analyze single article
bun run blog:internal-links analyze --slug "article-slug"

# Generate site-wide report
bun run blog:internal-links analyze --locale en --export ./report.json

# View statistics
bun run blog:internal-links stats --locale en
```

---

## 📋 Command Reference

### analyze

Analyze internal linking opportunities for articles.

```bash
bun run blog:internal-links analyze [options]
```

#### Options

| Option                  | Type   | Default | Description                               |
| ----------------------- | ------ | ------- | ----------------------------------------- |
| `-s, --slug <slug>`     | string | -       | Analyze specific article by slug          |
| `-l, --locale <locale>` | string | `en`    | Filter by locale (en, es, pt-br, fr, all) |
| `--limit <number>`      | number | `5`     | Maximum suggestions per article           |
| `--min-score <number>`  | number | `0.3`   | Minimum relevance score (0.0-1.0)         |
| `--category <category>` | string | -       | Filter by category                        |
| `--export <path>`       | string | -       | Export results to JSON file               |
| `--format <format>`     | string | `table` | Output format (table, json, csv)          |
| `--verbose`             | flag   | `false` | Show detailed output                      |
| `--quiet`               | flag   | `false` | Suppress non-error output                 |

#### Examples

**Analyze Single Article**

```bash
bun run blog:internal-links analyze --slug "advanced-timing-techniques"
```

**Output:**

```
🔗 Link Suggestions:

Article: advanced-timing-techniques (en)

  1. Event Management Guide
     Score: 85.2%
     Reason: category
     Suggested anchor: "event management"
     Context: "Learn how to manage events efficiently..."

  2. Timer Settings Tutorial
     Score: 72.8%
     Reason: tag
     Suggested anchor: "timer settings"
     Context: "Complete guide to timer configuration..."

  3. Basic Presentation Skills
     Score: 68.4%
     Reason: semantic
     Suggested anchor: "presentation skills"
     Context: "Essential skills for effective presentations..."

Processing time: 1.2s
Cache hit: No
```

**Analyze with Custom Settings**

```bash
bun run blog:internal-links analyze \
  --slug "advanced-timing-techniques" \
  --limit 10 \
  --min-score 0.4 \
  --verbose
```

**Export Results**

```bash
bun run blog:internal-links analyze \
  --slug "advanced-timing-techniques" \
  --export ./analysis.json \
  --format json
```

**Export Format (JSON):**

```json
{
  "article": {
    "slug": "advanced-timing-techniques",
    "title": "Advanced Timing Techniques",
    "locale": "en",
    "category": "tutorial"
  },
  "suggestions": [
    {
      "slug": "event-management-guide",
      "title": "Event Management Guide",
      "score": 0.852,
      "reason": "category",
      "suggestedAnchor": "event management",
      "contextExcerpt": "Learn how to manage events efficiently...",
      "targetCategory": "tutorial",
      "publishedAt": "2025-10-20"
    }
  ],
  "metadata": {
    "processingTime": 1234,
    "cacheHit": false,
    "totalSuggestions": 3,
    "generatedAt": "2025-10-26T10:30:00Z"
  }
}
```

### stats

Display internal linking statistics and metrics.

```bash
bun run blog:internal-links stats [options]
```

#### Options

| Option                      | Type   | Default | Description                 |
| --------------------------- | ------ | ------- | --------------------------- |
| `-l, --locale <locale>`     | string | `all`   | Filter by locale            |
| `-c, --category <category>` | string | -       | Filter by category          |
| `--detailed`                | flag   | `false` | Show detailed statistics    |
| `--export <path>`           | string | -       | Export statistics to file   |
| `--format <format>`         | string | `table` | Output format (table, json) |
| `--period <days>`           | number | `30`    | Analysis period in days     |

#### Examples

**Basic Statistics**

```bash
bun run blog:internal-links stats
```

**Output:**

```
📈 Internal Linking Statistics:

Total Articles: 45
Articles with Internal Links: 38
Average Links per Article: 3.24
Link Coverage: 84.44%

By Locale:
  en: 20 articles, 3.8 avg links
  es: 12 articles, 2.9 avg links
  pt-br: 8 articles, 2.6 avg links
  fr: 5 articles, 3.1 avg links

By Category:
  tutorial: 12 articles, 4.1 avg links
  case-study: 8 articles, 2.8 avg links
  feature-announce: 15 articles, 3.2 avg links
  news: 10 articles, 1.9 avg links
```

**Detailed Statistics**

```bash
bun run blog:internal-links stats --detailed --locale en
```

**Output:**

```
📊 Detailed Internal Linking Statistics (en)

Content Overview:
  Total Articles: 20
  Total Word Count: 45,230
  Average Article Length: 2,261 words

Linking Performance:
  Articles with Links: 18 (90.0%)
  Total Internal Links: 63
  Average Links per Article: 3.5
  Average Link Score: 0.68

Quality Metrics:
  High-Quality Links (>0.8): 24 (38.1%)
  Medium-Quality Links (0.5-0.8): 28 (44.4%)
  Low-Quality Links (<0.5): 11 (17.5%)

Link Distribution:
  Category-based: 28 (44.4%)
  Tag-based: 15 (23.8%)
  Semantic: 12 (19.0%)
  Keyword: 8 (12.7%)

Top Performing Articles:
  1. event-management-guide: 8 links, 0.82 avg score
  2. timer-settings-tutorial: 7 links, 0.78 avg score
  3. advanced-timing-techniques: 6 links, 0.75 avg score
```

### validate

Validate internal linking configuration and content.

```bash
bun run blog:internal-links validate [options]
```

#### Options

| Option            | Type   | Default | Description                      |
| ----------------- | ------ | ------- | -------------------------------- |
| `--config`        | flag   | `false` | Validate configuration only      |
| `--content`       | flag   | `false` | Validate content only            |
| `--links`         | flag   | `false` | Validate generated links only    |
| `--fix`           | flag   | `false` | Attempt to fix validation issues |
| `--export <path>` | string | -       | Export validation report         |

#### Examples

**Complete Validation**

```bash
bun run blog:internal-links validate
```

**Output:**

```
✅ Internal Linking Validation

Configuration:
  ✅ Config file exists and is valid
  ✅ All required fields present
  ✅ Values within acceptable ranges
  ⚠️  Consider increasing cache timeout for better performance

Content Analysis:
  ✅ All articles have valid slugs
  ✅ All articles have required metadata
  ✅ No duplicate slugs found
  ❌ 3 articles have very short content (< 100 words)

Link Validation:
  ✅ All generated links point to valid articles
  ✅ No circular references detected
  ✅ All links have valid anchor text
  ⚠️  12 links have low relevance scores (< 0.3)

Issues Found:
  1. Article "quick-tip" has only 45 words
  2. Article "announcement" has only 78 words
  3. Article "update" has only 92 words
  4. 12 low-quality links detected

Recommendations:
  - Expand short articles or exclude from linking
  - Increase minimum relevance score to 0.4
  - Review and improve low-quality links

Overall Score: 85/100
```

### config

Manage internal linking configuration.

```bash
bun run blog:internal-links config [subcommand] [options]
```

#### Subcommands

**show** - Display current configuration

```bash
bun run blog:internal-links config show
```

**set** - Update configuration values

```bash
bun run blog:internal-links config set <key> <value>
```

**reset** - Reset configuration to defaults

```bash
bun run blog:internal-links config reset [--key <key>]
```

**validate** - Validate configuration

```bash
bun run blog:internal-links config validate
```

#### Examples

**Show Configuration**

```bash
bun run blog:internal-links config show
```

**Output:**

```
⚙️  Internal Linking Configuration

Core Settings:
  enabled: true
  maxLinksPerPost: 5
  minRelevanceScore: 0.3

Content Filtering:
  excludeCategories: ["news", "archived"]
  targetCategories: ["tutorial", "guide"]
  excludeTags: ["deprecated"]
  targetTags: ["featured"]

Performance:
  cacheResults: true
  cacheTimeout: 3600000 (1 hour)
  batchSize: 50
  parallelProcessing: true

Multi-language:
  locales: ["en", "es", "pt-br", "fr"]
  enableCrossLanguageLinks: false

Scoring Weights:
  categoryWeight: 0.3
  tagWeight: 0.2
  semanticWeight: 0.4
  keywordWeight: 0.1
```

**Update Configuration**

```bash
# Set maximum links per post
bun run blog:internal-links config set maxLinksPerPost 8

# Set minimum relevance score
bun run blog:internal-links config set minRelevanceScore 0.4

# Add category to exclusion list
bun run blog:internal-links config set excludeCategories '["news","archived","deprecated"]'
```

### cache

Manage internal linking cache.

```bash
bun run blog:internal-links cache [subcommand] [options]
```

#### Subcommands

**status** - Show cache status

```bash
bun run blog:internal-links cache status
```

**clear** - Clear cache

```bash
bun run blog:internal-links cache clear [--pattern <pattern>]
```

**warm** - Warm up cache with popular content

```bash
bun run blog:internal-links cache warm [--locale <locale>] [--count <number>]
```

#### Examples

**Cache Status**

```bash
bun run blog:internal-links cache status
```

**Output:**

```
💾 Cache Status

Cache Type: Memory
Cache Size: 245 entries (2.3 MB)
Hit Rate: 78.4%
Miss Rate: 21.6%

Oldest Entry: 2.3 hours ago
Newest Entry: 2 minutes ago

Cache Breakdown:
  Link Suggestions: 180 entries
  Content Analysis: 45 entries
  Similarity Calculations: 20 entries

Performance Impact:
  Average retrieval time: 0.8ms
  Cache hits saved: ~15.2 seconds of processing time
```

**Clear Cache**

```bash
bun run blog:internal-links cache clear
```

**Clear Specific Pattern**

```bash
bun run blog:internal-links cache clear --pattern "en_*"
```

**Warm Cache**

```bash
bun run blog:internal-links cache warm --locale en --count 50
```

### generate

Generate internal links for content.

```bash
bun run blog:internal-links generate [options]
```

#### Options

| Option                  | Type   | Default | Description                                   |
| ----------------------- | ------ | ------- | --------------------------------------------- |
| `--slug <slug>`         | string | -       | Generate links for specific article           |
| `--locale <locale>`     | string | `all`   | Filter by locale                              |
| `--category <category>` | string | -       | Filter by category                            |
| `--dry-run`             | flag   | `false` | Show what would be generated without applying |
| `--apply`               | flag   | `false` | Apply generated links to content              |
| `--backup`              | flag   | `false` | Create backup before applying changes         |
| `--force`               | flag   | `false` | Force overwrite existing links                |

#### Examples

**Dry Run Generation**

```bash
bun run blog:internal-links generate --dry-run --locale en
```

**Generate and Apply**

```bash
bun run blog:internal-links generate --apply --backup --locale en
```

**Output:**

```
🔗 Generating Internal Links

Analyzing 20 articles (en)...

Article: event-management-guide
  Found 8 link opportunities
  Will insert: event-timing, conference-planning, speaker-tools
  Skipped: archived-article (low relevance)

Article: timer-settings-tutorial
  Found 7 link opportunities
  Will insert: basic-timer, advanced-settings, troubleshooting
  Skipped: None

Backup created: ./backups/internal-links-2025-10-26-10-30.json

Processing complete:
  Articles processed: 20
  Links generated: 63
  Links inserted: 45
  Errors: 0

Files modified:
  - content/blog/2025/10/event-management-guide.mdx
  - content/blog/2025/09/timer-settings-tutorial.mdx
  - ... (18 more files)
```

---

## 🌍 Multi-Language Support

### Language-Specific Analysis

```bash
# Analyze English content
bun run blog:internal-links analyze --locale en

# Analyze Spanish content
bun run blog:internal-links analyze --locale es

# Analyze all languages
bun run blog:internal-links analyze --locale all

# Analyze specific language with custom settings
bun run blog:internal-links analyze \
  --locale pt-br \
  --limit 8 \
  --min-score 0.25
```

### Cross-Language Linking

```bash
# Enable cross-language analysis
bun run blog:internal-links config set enableCrossLanguageLinks true

# Analyze cross-language opportunities
bun run blog:internal-links analyze \
  --locale en \
  --cross-language \
  --limit 3
```

---

## 📊 Output Formats

### Table Format (Default)

Human-readable table output with color coding.

```bash
bun run blog:internal-links analyze --format table
```

### JSON Format

Machine-readable JSON output for programmatic use.

```bash
bun run blog:internal-links analyze --format json --export results.json
```

### CSV Format

Comma-separated values for spreadsheet analysis.

```bash
bun run blog:internal-links analyze --format csv --export results.csv
```

**CSV Output:**

```csv
source_slug,target_slug,target_title,score,reason,suggested_anchor
advanced-timing,event-management,Event Management Guide,0.852,category,event management
advanced-timing,timer-settings,Timer Settings Tutorial,0.728,tag,timer settings
```

---

## 🔧 Advanced Usage

### Batch Processing

```bash
# Process all articles in batches
bun run blog:internal-links analyze \
  --locale all \
  --batch-size 20 \
  --parallel \
  --export ./batch-results.json
```

### Custom Filters

```bash
# Filter by category and score
bun run blog:internal-links analyze \
  --category tutorial \
  --min-score 0.6 \
  --limit 10

# Filter by publication date
bun run blog:internal-links analyze \
  --published-after 2025-09-01 \
  --published-before 2025-10-26
```

### Performance Optimization

```bash
# Use cache for faster processing
bun run blog:internal-links analyze \
  --cache \
  --cache-ttl 7200

# Process with performance monitoring
bun run blog:internal-links analyze \
  --performance \
  --profile
```

---

## 🚨 Error Handling

### Common Errors

**Configuration Error**

```bash
❌ Error: Invalid configuration: minRelevanceScore must be between 0.0 and 1.0
💡 Solution: Use a value between 0.0 and 1.0
```

**Content Not Found**

```bash
❌ Error: Article not found: "non-existent-article"
💡 Solution: Check that the article slug is correct and the article exists
```

**Processing Timeout**

```bash
❌ Error: Processing timeout after 30 seconds
💡 Solution: Try reducing the analysis scope or increasing timeout
```

### Debug Mode

```bash
# Enable debug output
bun run blog:internal-links analyze --debug --slug "article-slug"

# Verbose logging
bun run blog:internal-links analyze --verbose --performance
```

---

## 🔗 Integration Examples

### CI/CD Integration

```bash
#!/bin/bash
# ci-cd-linking-check.sh

# Run linking analysis
echo "Running internal linking analysis..."
bun run blog:internal-links analyze --locale en --export ./linking-report.json

# Check if coverage meets threshold
COVERAGE=$(bun run blog:internal-links stats --format json | jq '.linkCoverage')
THRESHOLD=80

if (( $(echo "$COVERAGE < $THRESHOLD" | bc -l) )); then
  echo "❌ Internal linking coverage ($COVERAGE%) is below threshold ($THRESHOLD%)"
  exit 1
else
  echo "✅ Internal linking coverage ($COVERAGE%) meets threshold ($THRESHOLD%)"
fi
```

### Scheduled Reports

```bash
#!/bin/bash
# weekly-linking-report.sh

# Generate weekly report
DATE=$(date +%Y-%m-%d)
REPORT_DIR="./reports/weekly/$DATE"

mkdir -p "$REPORT_DIR"

# Generate statistics
bun run blog:internal-links stats --detailed --export "$REPORT_DIR/stats.json"

# Analyze top articles
bun run blog:internal-links analyze --limit 20 --export "$REPORT_DIR/top-articles.json"

# Generate coverage report
bun run blog:internal-links analyze --locale all --export "$REPORT_DIR/coverage-report.json"

echo "Weekly report generated: $REPORT_DIR"
```

---

## 🔗 Related Documentation

- [Usage Guide](./USAGE-GUIDE.md) - How to use the CLI tools
- [API Reference](./API-REFERENCE.md) - API documentation
- [Configuration](./CONFIGURATION.md) - Configuration options
- [Examples](./EXAMPLES.md) - CLI usage examples

---

**CLI version:** 1.0.0 **Last updated:** October 26, 2025

**Need CLI help?** Use `bun run blog:internal-links --help` or
[contact support](mailto:support@cuetimer.com).
