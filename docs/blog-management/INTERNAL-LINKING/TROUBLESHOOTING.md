# Internal Linking Automation - Troubleshooting Guide

**Comprehensive troubleshooting guide for the CueTimer internal linking system**

---

## 🎯 Overview

This guide provides solutions to common issues, error scenarios, and performance
problems you may encounter while using the Internal Linking Automation system.
Issues are organized by category with clear symptoms, causes, and step-by-step
solutions.

---

## 🚨 Common Issues

### Installation and Setup

#### Issue: CLI command not found

**Symptoms:**

```bash
bun run blog:internal-links --help
# Error: Command not found
```

**Causes:**

- CLI script not properly installed
- File permissions issue
- Node.js/Bun version incompatibility

**Solutions:**

1. **Verify installation:**

```bash
# Check if script exists
ls -la scripts/blog-internal-links.ts

# Check package.json scripts
cat package.json | grep "blog:internal-links"
```

2. **Verify dependencies:**

```bash
# Check if dependencies are installed
bun install

# Verify Node.js/Bun version
node --version  # Should be 18+
bun --version   # Should be 1.0+
```

3. **Check file permissions:**

```bash
# Make script executable
chmod +x scripts/blog-internal-links.ts
```

4. **Reinstall dependencies:**

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
bun install
```

---

### Configuration Issues

#### Issue: Invalid configuration error

**Symptoms:**

```bash
❌ Error: Invalid configuration: minRelevanceScore must be between 0.0 and 1.0
```

**Causes:**

- Configuration values out of valid range
- Missing required configuration fields
- Invalid JSON syntax

**Solutions:**

1. **Validate configuration file:**

```bash
bun run blog:internal-links config validate
```

2. **Check configuration values:**

```bash
bun run blog:internal-links config show
```

3. **Reset to defaults:**

```bash
# Reset entire configuration
bun run blog:internal-links config reset

# Reset specific field
bun run blog:internal-links config reset --key minRelevanceScore
```

4. **Manually fix configuration:**

```typescript
// config/internal-linking.config.ts
export const internalLinkingConfig = {
  enabled: true,
  maxLinksPerPost: 5, // Must be 1-20
  minRelevanceScore: 0.3, // Must be 0.0-1.0
  // ... other config
};
```

#### Issue: Configuration not being applied

**Symptoms:**

- Changes to configuration don't take effect
- Default behavior continues despite config changes

**Causes:**

- Cache not cleared after configuration change
- Multiple configuration files conflicting
- Environment variables overriding config

**Solutions:**

1. **Clear cache:**

```bash
bun run blog:internal-links cache clear
```

2. **Check for multiple config files:**

```bash
find . -name "*internal-linking*config*" -type f
```

3. **Check environment variables:**

```bash
env | grep INTERNAL_LINKING
```

4. **Restart application:**

```bash
# For development
bun run dev

# For production
bun run build
bun run start
```

---

### Performance Issues

#### Issue: Slow processing time

**Symptoms:**

- Link generation taking >10 seconds
- Memory usage increasing during processing
- Timeouts during batch operations

**Causes:**

- Large content files
- Insufficient caching
- High concurrent load
- Inefficient similarity calculations

**Solutions:**

1. **Enable performance monitoring:**

```bash
bun run blog:internal-links analyze --performance --debug
```

2. **Optimize configuration:**

```bash
# Reduce batch size
bun run blog:internal-links config set batchSize 25

# Increase cache timeout
bun run blog:internal-links config set cacheTimeout 7200000

# Enable parallel processing
bun run blog:internal-links config set parallelProcessing true
```

3. **Process in smaller batches:**

```bash
bun run blog:internal-links analyze --batch-size 10
```

4. **Check system resources:**

```bash
# Check memory usage
bun run blog:internal-links stats --detailed

# Monitor system resources
top -p $(pgrep -f "blog-internal-links")
```

#### Issue: High memory usage

**Symptoms:**

- Process using >500MB memory
- Out of memory errors on large sites
- Memory not being released after processing

**Causes:**

- Large content files being processed
- Cache not properly managed
- Memory leaks in processing pipeline

**Solutions:**

1. **Reduce content processing limits:**

```bash
bun run blog:internal-links config set maxContentLength 8000
bun run blog:internal-links config set truncateLongContent true
```

2. **Optimize cache settings:**

```bash
# Reduce cache size
bun run blog:internal-links config set maxCacheSize 500

# Reduce cache timeout
bun run blog:internal-links config set cacheTimeout 1800000
```

3. **Enable garbage collection:**

```typescript
// Force garbage collection in processing
if (global.gc) {
  global.gc();
}
```

4. **Process content in chunks:**

```bash
bun run blog:internal-links analyze --chunk-size 500
```

---

### Content Processing Issues

#### Issue: No link suggestions generated

**Symptoms:**

```bash
🔗 Link Suggestions:

Article: my-article

  (no suggestions found)
```

**Causes:**

- Content too short
- No related content available
- Relevance threshold too high
- Content filtering too restrictive

**Solutions:**

1. **Check content length:**

```bash
# Verify minimum word count
bun run blog:internal-links analyze --verbose --slug "my-article"
```

2. **Lower relevance threshold:**

```bash
bun run blog:internal-links config set minRelevanceScore 0.1
```

3. **Check content filtering:**

```bash
# Review exclusion lists
bun run blog:internal-links config show | grep "exclude"
```

4. **Analyze content pool:**

```bash
# Check available content
bun run blog:internal-links stats --detailed
```

#### Issue: Low quality link suggestions

**Symptoms:**

- Links with low relevance scores (<0.3)
- Irrelevant target articles
- Poor anchor text suggestions

**Causes:**

- Insufficient content analysis
- Poor category/tag organization
- Inadequate keyword extraction

**Solutions:**

1. **Improve content metadata:**

```yaml
# content/blog/my-article.mdx
---
title: 'My Article Title'
category: 'tutorial' # Be specific
tags: ['timing', 'beginner', 'featured'] # Use relevant tags
summary: 'Clear, concise summary'
author: 'Author Name'
---
```

2. **Adjust scoring weights:**

```bash
bun run blog:internal-links config set categoryWeight 0.4
bun run blog:internal-links config set semanticWeight 0.5
bun run blog:internal-links config set keywordWeight 0.1
```

3. **Increase minimum relevance:**

```bash
bun run blog:internal-links config set minRelevanceScore 0.4
```

4. **Review content categories:**

```bash
# Analyze category distribution
bun run blog:internal-links stats --detailed | grep "By Category"
```

---

### Multi-Language Issues

#### Issue: Links not working for non-English content

**Symptoms:**

- No suggestions for Spanish/Portuguese articles
- Cross-language links when not desired
- Poor quality suggestions for non-English content

**Causes:**

- Insufficient content in target language
- Language detection issues
- Cross-language linking enabled unintentionally

**Solutions:**

1. **Check language content availability:**

```bash
bun run blog:internal-links stats --detailed --locale es
```

2. **Disable cross-language linking:**

```bash
bun run blog:internal-links config set enableCrossLanguageLinks false
```

3. **Configure language-specific settings:**

```bash
# Set language-specific weights
bun run blog:internal-links config set languageSettings '{"es": {"maxLinksPerPost": 3, "minRelevanceScore": 0.4}}'
```

4. **Verify locale codes:**

```bash
# Check content locales
find content/blog -name "*.mdx" -exec grep -l "locale:" {} \;
```

---

## 🔧 Advanced Troubleshooting

### Debug Mode

Enable comprehensive debugging to identify issues:

```bash
# Enable debug output
bun run blog:internal-links analyze --debug --verbose --slug "problematic-article"

# Performance profiling
bun run blog:internal-links analyze --profile --performance

# Cache debugging
bun run blog:internal-links cache status --debug
```

### Log Analysis

Check application logs for detailed error information:

```bash
# View recent logs
tail -f logs/internal-linking.log

# Search for errors
grep "ERROR" logs/internal-linking.log | tail -20

# Analyze performance
grep "processing_time" logs/internal-linking.log | tail -20
```

### Manual Testing

Test individual components to isolate issues:

```typescript
// Test content processing
import { processMdxContentWithLinks } from '@/lib/utils';

const testContent = 'Test content about timer management and event planning.';
const result = await processMdxContentWithLinks(
  testContent,
  'test-slug',
  'en',
  3
);
console.log('Result:', result);
```

```typescript
// Test suggestion generation
import { getLinkSuggestions } from '@/lib/internal-linking';

const suggestions = await getLinkSuggestions('test-slug', 5, 'en');
console.log('Suggestions:', suggestions);
```

---

## 📊 Performance Tuning

### Large Site Optimization

For sites with 1000+ articles:

1. **Batch processing configuration:**

```bash
bun run blog:internal-links config set batchSize 100
bun run blog:internal-links config set parallelProcessing true
bun run blog:internal-links config set maxConcurrentBatches 3
```

2. **Cache optimization:**

```bash
bun run blog:internal-links config set cacheTimeout 7200000  # 2 hours
bun run blog:internal-links config set maxCacheSize 2000
```

3. **Content limits:**

```bash
bun run blog:internal-links config set maxContentLength 5000
bun run blog:internal-links config set minWordCount 200
```

### Memory Optimization

For memory-constrained environments:

1. **Reduce processing scope:**

```bash
bun run blog:internal-links config set maxLinksPerPost 3
bun run blog:internal-links config set truncateLongContent true
```

2. **Aggressive caching:**

```bash
bun run blog:internal-links config set cacheResults true
bun run blog:internal-links config set compressionEnabled true
```

3. **Processing limits:**

```bash
bun run blog:internal-links config set maxProcessingTime 5000
bun run blog:internal-links config set memoryThreshold 0.7
```

---

## 🚨 Error Codes Reference

### System Errors

| Code             | Description                 | Solution                                 |
| ---------------- | --------------------------- | ---------------------------------------- |
| `CONFIG_001`     | Invalid configuration value | Check and fix configuration              |
| `CONFIG_002`     | Missing required field      | Add missing configuration                |
| `CONTENT_001`    | Content not found           | Verify article exists                    |
| `CONTENT_002`    | Content too short           | Increase content length or adjust limits |
| `PROCESSING_001` | Processing timeout          | Increase timeout or reduce scope         |
| `PROCESSING_002` | Memory error                | Optimize memory usage                    |
| `CACHE_001`      | Cache error                 | Clear cache or check permissions         |
| `NETWORK_001`    | Network timeout             | Check network connectivity               |

### Content Errors

| Code       | Description                 | Solution                     |
| ---------- | --------------------------- | ---------------------------- |
| `LINK_001` | No suggestions found        | Lower relevance threshold    |
| `LINK_002` | Invalid target article      | Check target article exists  |
| `LINK_003` | Circular reference detected | Review content relationships |
| `LINK_004` | Invalid anchor text         | Improve content analysis     |

---

## 🆘 Getting Help

### Support Channels

1. **Documentation:** Check this guide and related documentation
2. **Community:** Join our Discord community
3. **Issues:** Report bugs via GitHub Issues
4. **Email:** support@cuetimer.com

### Reporting Issues

When reporting issues, include:

1. **System Information:**

```bash
# Node.js/Bun version
node --version
bun --version

# System info
uname -a

# Memory and disk
free -h
df -h
```

2. **Configuration:**

```bash
bun run blog:internal-links config show
```

3. **Error Details:**

- Full error message
- Steps to reproduce
- Expected vs actual behavior

4. **Debug Output:**

```bash
bun run blog:internal-links analyze --debug --verbose 2>&1 > debug.log
```

### Diagnostic Script

Run our diagnostic script to gather system information:

```bash
bun run scripts/diagnostic.ts
```

This will generate a comprehensive report including:

- System specifications
- Configuration validation
- Performance benchmarks
- Common issue detection

---

## 🔗 Related Documentation

- [Usage Guide](./USAGE-GUIDE.md) - How to use the system
- [Configuration](./CONFIGURATION.md) - Configuration options
- [API Reference](./API-REFERENCE.md) - API documentation
- [Integration Guide](./INTEGRATION.md) - System integration

---

**Still having issues?** [Contact our support team](mailto:support@cuetimer.com)
with your diagnostic report and we'll help you resolve the problem quickly.
