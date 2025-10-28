# Chunk 35: documentation_docs

## Metadata

- **Files**: 1
- **Size**: 19,641 characters (~4,910 tokens)
- **Categories**: documentation

## Files in this chunk

- `docs/blog-management/TROUBLESHOOTING.md`

---

## File: `docs/blog-management/TROUBLESHOOTING.md`

````markdown
# Troubleshooting Guide

**Common issues, debugging strategies, and solutions for the CueTimer Blog
Management System**

---

## 🎯 Overview

This comprehensive troubleshooting guide helps you identify, diagnose, and
resolve common issues with the CueTimer Blog Management System. It covers CLI
tools, content creation, publishing, SEO optimization, and system maintenance
problems.

## 🔧 Diagnostic Tools

### System Health Check

```bash
# Run comprehensive system diagnostics
bun run blog:workflow:status --health-check

# Check specific components
bun run blog:workflow:status --check-database
bun run blog:workflow:status --check-cache
bun run blog:workflow:status --check-file-system
```
````

### Debug Mode

Enable debug logging for detailed troubleshooting:

```bash
# Enable debug mode
export CUETIMER_DEBUG=true
export CUETIMER_LOG_LEVEL=debug

# Run with verbose output
bun run blog:create --verbose --template "timing-guide" --title "Debug Test"
```

### Log Analysis

```bash
# Check application logs
tail -f logs/application.log

# Check error logs
tail -f logs/error.log

# Filter specific errors
grep "ERROR" logs/application.log | tail -20
```

---

## 📝 Content Creation Issues

### Template Validation Errors

#### Issue: Template variables not found

**Error Message:**

```
Error: Required variable "title" is missing
```

**Causes:**

- Required template variables not provided
- Variable names misspelled
- JSON format errors in variables

**Solutions:**

1. **Check template requirements:**

```bash
bun run blog:create --template "timing-guide" --list-variables
```

2. **Validate variables JSON:**

```bash
# Create variables file with proper JSON format
cat > variables.json << EOF
{
  "title": "Test Timing Guide",
  "targetAudience": "Professional speakers",
  "difficultyLevel": "beginner",
  "estimatedTime": 30
}
EOF

bun run blog:create --template "timing-guide" --variables "$(cat variables.json)"
```

3. **Use interactive mode:**

```bash
bun run blog:create --interactive
```

#### Issue: Template not found

**Error Message:**

```
Error: Template "invalid-template" not found
```

**Solutions:**

1. **List available templates:**

```bash
bun run blog:create --list-templates
```

2. **Check template spelling:**

```bash
# Correct template names:
# - timing-guide
# - case-study
# - feature-announce
# - presentation-tips
```

3. **Verify template installation:**

```bash
# Check template files exist
ls -la lib/blog-scripts/templates/
```

### File System Errors

#### Issue: Permission denied

**Error Message:**

```
Error: EACCES: permission denied, mkdir 'content/blog/2025/01'
```

**Solutions:**

1. **Check directory permissions:**

```bash
ls -la content/
ls -la content/blog/

# Fix permissions if needed
chmod -R 755 content/
chown -R $USER:$USER content/
```

2. **Create directories manually:**

```bash
mkdir -p content/blog/2025/01
chmod 755 content/blog/2025/01
```

3. **Check disk space:**

```bash
df -h
```

#### Issue: File already exists

**Error Message:**

```
Error: EEXIST: file already exists, open 'content/blog/2025/01/test-post.mdx'
```

**Solutions:**

1. **Use different title:**

```bash
bun run blog:create --template "timing-guide" --title "Different Test Post"
```

2. **Remove existing file:**

```bash
rm content/blog/2025/01/test-post.mdx
```

3. **Use force option:**

```bash
bun run blog:create --template "timing-guide" --title "Test Post" --force
```

### Content Generation Errors

#### Issue: Invalid content structure

**Error Message:**

```
Error: Content validation failed: Invalid markdown format
```

**Solutions:**

1. **Check template structure:**

```bash
bun run blog:create --template "timing-guide" --validate-template
```

2. **Review generated content:**

```bash
# Create test content
bun run blog:create --template "timing-guide" --title "Test" --dry-run

# Review the output for formatting issues
```

3. **Validate markdown:**

```bash
# Use markdown linter
bun run content:validate content/blog/2025/01/test-post.mdx
```

---

## 🌍 Multi-Language Issues

### Translation Problems

#### Issue: Translation not found

**Error Message:**

```
Error: Translation not found for language "pt-br"
```

**Solutions:**

1. **Check translation status:**

```bash
bun run blog:workflow:status --type "translations" --post "post-slug"
```

2. **Create missing translation:**

```bash
bun run blog:create --template "timing-guide" --title "Título em Português" --language "pt-br" --master-post "post-slug"
```

3. **Verify language configuration:**

```bash
# Check supported languages
bun run blog:workflow:status --languages
```

#### Issue: Inconsistent translations

**Error Message:**

```
Warning: Inconsistent fields detected between languages
```

**Solutions:**

1. **Check synchronization status:**

```bash
bun run blog:workflow:status --post "post-slug" --sync-check
```

2. **Synchronize translations:**

```bash
bun run blog:workflow:status --post "post-slug" --sync-languages
```

3. **Manual review:**

```bash
# Compare language files
diff content/blog/2025/01/post-en.mdx content/blog/2025/01/post-pt-br.mdx
```

### Language Configuration Issues

#### Issue: Language not supported

**Error Message:**

```
Error: Language "invalid-lang" is not supported
```

**Solutions:**

1. **Check supported languages:**

```bash
bun run blog:workflow:status --languages
```

2. **Add new language:**

```typescript
// Add to lib/blog-scripts/types.ts
export const SUPPORTED_LANGUAGES = ['en', 'pt-br', 'es', 'fr', 'de'];
```

3. **Update configuration:**

```bash
# Update cuetimer.config.json
{
  "languages": ["en", "pt-br", "es", "fr"]
}
```

---

## 🚀 Publishing and Workflow Issues

### Publishing Problems

#### Issue: Publication failed

**Error Message:**

```
Error: Publication failed: Content validation errors
```

**Solutions:**

1. **Check content validation:**

```bash
bun run blog:seo-check --file "content/blog/2025/01/post.mdx" --threshold 80
```

2. **Fix SEO issues:**

```bash
bun run blog:seo-check --file "content/blog/2025/01/post.mdx" --fix
```

3. **Review workflow status:**

```bash
bun run blog:workflow:status --post "post-slug" --detailed
```

#### Issue: Scheduling conflicts

**Error Message:**

```
Error: Publication time conflicts with existing scheduled post
```

**Solutions:**

1. **Check scheduled posts:**

```bash
bun run blog:publish --list --status "scheduled"
```

2. **Reschedule conflicting posts:**

```bash
bun run blog:publish --post "conflicting-post" --action reschedule --date "2025-02-02T10:00:00Z"
```

3. **Use different time:**

```bash
bun run blog:publish --post "new-post" --action schedule --date "2025-02-01T14:00:00Z"
```

### Workflow Status Issues

#### Issue: Post stuck in workflow state

**Error Message:**

```
Warning: Post has been in "in-review" status for 7 days
```

**Solutions:**

1. **Check workflow history:**

```bash
bun run blog:workflow:status --post "post-slug" --history
```

2. **Force state transition:**

```bash
bun run blog:workflow:status --post "post-slug" --force-state "published"
```

3. **Reset workflow:**

```bash
bun run blog:workflow:status --post "post-slug" --reset-workflow
```

---

## 🔍 SEO and Analytics Issues

### SEO Analysis Problems

#### Issue: SEO score low

**Error Message:**

```
SEO Score: 45/100 - Multiple issues detected
```

**Solutions:**

1. **Run detailed SEO analysis:**

```bash
bun run blog:seo-check --file "content/blog/2025/01/post.mdx" --detailed
```

2. **Apply automatic fixes:**

```bash
bun run blog:seo-check --file "content/blog/2025/01/post.mdx" --auto-fix
```

3. **Review recommendations:**

```bash
bun run blog:seo-check --file "content/blog/2025/01/post.mdx" --recommendations
```

Common SEO issues and fixes:

- **Short title**: Increase title length to 30-60 characters
- **Missing meta description**: Add compelling meta description (150-160
  characters)
- **No internal links**: Add 2-3 relevant internal links
- **Missing alt text**: Add descriptive alt text to images
- **Poor heading structure**: Ensure proper H1-H6 hierarchy

#### Issue: SEO check timeout

**Error Message:**

```
Error: SEO analysis timed out after 30 seconds
```

**Solutions:**

1. **Increase timeout:**

```bash
export CUETIMER_SEO_TIMEOUT=60000
bun run blog:seo-check --file "content/blog/2025/01/post.mdx"
```

2. **Check specific categories:**

```bash
bun run blog:seo-check --file "content/blog/2025/01/post.mdx" --check "content,technical"
```

3. **Run analysis in parts:**

```bash
bun run blog:seo-check --file "content/blog/2025/01/post.mdx" --category "content"
bun run blog:seo-check --file "content/blog/2025/01/post.mdx" --category "technical"
```

### Analytics Issues

#### Issue: No analytics data

**Error Message:**

```
No analytics data available for the specified period
```

**Solutions:**

1. **Check analytics configuration:**

```bash
bun run blog:analytics --check-config
```

2. **Verify tracking setup:**

```bash
# Check if analytics tracking code is present
grep -r "GA_MEASUREMENT_ID" .
```

3. **Wait for data collection:**

```bash
# Analytics data may take 24-48 hours to appear
bun run blog:analytics --period "7d" --preview
```

#### Issue: Analytics API errors

**Error Message:**

```
Error: Analytics API request failed: 403 Forbidden
```

**Solutions:**

1. **Check API credentials:**

```bash
# Verify API key is valid
echo $CUETIMER_API_KEY
```

2. **Regenerate API key:**

```bash
# Generate new API key from dashboard
# Update environment variable
export CUETIMER_API_KEY="new-api-key"
```

3. **Check rate limits:**

```bash
bun run blog:analytics --check-rate-limits
```

---

## 🔧 CLI Tool Issues

### Command Not Found Errors

#### Issue: CLI commands not available

**Error Message:**

```
Error: command not found: blog-create
```

**Solutions:**

1. **Check installation:**

```bash
# Verify scripts are in package.json
cat package.json | grep "blog:"

# Install dependencies
bun install
```

2. **Use npm scripts:**

```bash
# Use the correct script format
bun run blog:create  # NOT blog-create
```

3. **Check file permissions:**

```bash
# Make scripts executable
chmod +x scripts/*.ts
```

### Dependency Issues

#### Issue: Missing dependencies

**Error Message:**

```
Error: Cannot find module 'commander'
```

**Solutions:**

1. **Install missing dependencies:**

```bash
bun install
```

2. **Check package.json:**

```bash
# Verify all required dependencies are listed
cat package.json | grep -A 20 "dependencies"
```

3. **Clear node_modules:**

```bash
rm -rf node_modules bun.lockb
bun install
```

### Memory and Performance Issues

#### Issue: Out of memory errors

**Error Message:**

```
JavaScript heap out of memory
```

**Solutions:**

1. **Increase Node.js memory limit:**

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
bun run blog:create --template "timing-guide" --title "Large Content"
```

2. **Process content in batches:**

```bash
bun run blog:seo-check --directory "content/blog" --batch-size 10
```

3. **Use streaming for large files:**

```bash
bun run blog:analytics --streaming --large-dataset
```

---

## 🌐 Network and Connectivity Issues

### API Connection Problems

#### Issue: Cannot connect to API

**Error Message:**

```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solutions:**

1. **Check if application is running:**

```bash
curl http://localhost:3000/api/health
```

2. **Start application:**

```bash
bun run dev
```

3. **Check port availability:**

```bash
netstat -tlnp | grep :3000
```

#### Issue: SSL/TLS errors

**Error Message:**

```
Error: self-signed certificate in certificate chain
```

**Solutions:**

1. **Skip SSL verification for development:**

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
bun run blog:analytics
```

2. **Use correct certificate:**

```bash
# Verify SSL certificate
openssl s_client -connect your-domain.com:443
```

3. **Update certificates:**

```bash
# Renew SSL certificate
certbot renew
```

### Firewall and Security Issues

#### Issue: Requests blocked by firewall

**Error Message:**

```
Error: Request timeout after 30 seconds
```

**Solutions:**

1. **Check firewall rules:**

```bash
sudo ufw status
sudo iptables -L
```

2. **Allow required ports:**

```bash
sudo ufw allow 3000
sudo ufw allow 80
sudo ufw allow 443
```

3. **Check security groups (cloud):**

```bash
# Verify AWS security groups allow traffic
# Verify Azure network security group rules
# Verify Google Cloud firewall rules
```

---

## 💾 Database Issues

### Connection Problems

#### Issue: Database connection failed

**Error Message:**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

1. **Check database server:**

```bash
# PostgreSQL
pg_isready -h localhost -p 5432

# MySQL
mysqladmin ping -h localhost
```

2. **Check connection string:**

```bash
echo $DATABASE_URL
```

3. **Verify database credentials:**

```bash
psql $DATABASE_URL -c "SELECT 1;"
```

#### Issue: Database migration errors

**Error Message:**

```
Error: Migration failed: Relation already exists
```

**Solutions:**

1. **Check migration status:**

```bash
bun run db:migrate:status
```

2. **Rollback and retry:**

```bash
bun run db:migrate:rollback
bun run db:migrate
```

3. **Force migration:**

```bash
bun run db:migrate --force
```

### Performance Issues

#### Issue: Slow database queries

**Symptoms:**

- API responses taking > 5 seconds
- Database timeouts
- High CPU usage

**Solutions:**

1. **Identify slow queries:**

```sql
-- PostgreSQL
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

2. **Add missing indexes:**

```sql
-- Add indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_blog_posts_category ON blog_posts(category);
CREATE INDEX CONCURRENTLY idx_blog_posts_published_at ON blog_posts(published_at DESC);
```

3. **Optimize queries:**

```sql
-- Use EXPLAIN ANALYZE to understand query performance
EXPLAIN ANALYZE SELECT * FROM blog_posts WHERE category = 'timing-guide' ORDER BY published_at DESC LIMIT 10;
```

---

## 🔧 System Maintenance Issues

### Disk Space Problems

#### Issue: Insufficient disk space

**Error Message:**

```
Error: ENOSPC: no space left on device
```

**Solutions:**

1. **Check disk usage:**

```bash
df -h
du -sh /* | sort -hr | head -10
```

2. **Clean up temporary files:**

```bash
# Clear npm cache
npm cache clean --force

# Clear Docker images
docker system prune -a

# Clear logs
find logs/ -name "*.log" -mtime +30 -delete
```

3. **Archive old content:**

```bash
# Move old content to archive
find content/blog/ -name "*.mdx" -mtime +365 -exec mv {} archive/ \;
```

### Memory Issues

#### Issue: High memory usage

**Symptoms:**

- System becomes unresponsive
- Out of memory errors
- Swap usage high

**Solutions:**

1. **Monitor memory usage:**

```bash
top
htop
free -h
```

2. **Identify memory leaks:**

```bash
# Node.js heap dump
kill -USR2 <nodejs-pid>

# Analyze heap dump
node --inspect heapdump-*.heapsnapshot
```

3. **Optimize memory usage:**

```bash
# Limit Node.js memory
export NODE_OPTIONS="--max-old-space-size=2048"

# Use streaming for large datasets
bun run blog:analytics --streaming
```

---

## 🚨 Emergency Procedures

### System Recovery

#### Complete System Recovery

```bash
#!/bin/bash
# scripts/emergency-recovery.sh

echo "🚨 Starting emergency system recovery..."

# 1. Stop all services
echo "⏹️ Stopping services..."
docker-compose down

# 2. Backup current state
echo "💾 Creating emergency backup..."
./scripts/backup.sh emergency-$(date +%Y%m%d-%H%M%S)

# 3. Restore from last known good backup
echo "🔄 Restoring from backup..."
LAST_BACKUP=$(ls -t /backups/cuetimer/ | head -1)
./scripts/recover.sh $LAST_BACKUP

# 4. Start services
echo "▶️ Starting services..."
docker-compose up -d

# 5. Health check
echo "🏥 Performing health check..."
sleep 30

if curl -f http://localhost:3000/api/health; then
  echo "✅ System recovery successful"
else
  echo "❌ System recovery failed - manual intervention required"
  exit 1
fi
```

### Data Corruption Recovery

```bash
#!/bin/bash
# scripts/data-corruption-recovery.sh

echo "🔧 Recovering from data corruption..."

# 1. Identify corrupted data
echo "🔍 Identifying corrupted data..."
find content/blog/ -name "*.mdx" -exec grep -l "ERROR" {} \;

# 2. Restore from Git
echo "📦 Restoring from Git..."
git checkout HEAD~1 -- content/blog/

# 3. Validate content
echo "✅ Validating content..."
bun run blog:workflow:status --validate-all

# 4. Re-index content
echo "📚 Re-indexing content..."
bun run blog:rebuild-index

echo "✅ Data recovery completed"
```

---

## 📞 Getting Help

### Self-Service Resources

1. **Documentation**
   - [User Guide](./README.md)
   - [CLI Reference](./CLI-REFERENCE.md)
   - [API Reference](./API-REFERENCE.md)

2. **Diagnostic Commands**

   ```bash
   # System health check
   bun run blog:workflow:status --health-check

   # Detailed diagnostics
   bun run blog:workflow:status --diagnostic --output diagnostic-report.html

   # Performance analysis
   bun run blog:analytics --system-performance --period "24h"
   ```

3. **Log Analysis**

   ```bash
   # Recent errors
   grep "ERROR" logs/application.log | tail -20

   # Performance issues
   grep "timeout\|slow" logs/application.log | tail -20

   # Database issues
   grep "database\|connection" logs/application.log | tail -20
   ```

### Contact Support

When to contact support:

- Error persists after trying all solutions
- System is completely down
- Data corruption suspected
- Security issues identified

**Support Information:**

- **Email**: support@cuetimer.com
- **Priority Support**: enterprise@cuetimer.com
- **Emergency**: emergency@cuetimer.com
- **Documentation**: https://docs.cuetimer.com
- **Community**: https://community.cuetimer.com

### Bug Reporting

When reporting bugs, include:

1. **System Information**

   ```bash
   bun run blog:workflow:status --system-info
   ```

2. **Error Details**
   - Complete error message
   - Steps to reproduce
   - Expected vs actual behavior

3. **Environment Details**
   - Operating system
   - Node.js/Bun version
   - Browser (if applicable)

4. **Logs**
   - Application logs
   - Error logs
   - System logs

---

## 📋 Quick Reference

### Common Commands

| Issue               | Command                                              |
| ------------------- | ---------------------------------------------------- |
| System health       | `bun run blog:workflow:status --health-check`        |
| Template issues     | `bun run blog:create --list-templates`               |
| SEO problems        | `bun run blog:seo-check --file "post.mdx" --fix`     |
| Translation issues  | `bun run blog:workflow:status --type "translations"` |
| Publishing problems | `bun run blog:publish --list --status "all"`         |
| Performance issues  | `bun run blog:analytics --system-performance`        |
| Permission errors   | `chmod -R 755 content/`                              |
| Dependency issues   | `bun install`                                        |
| Memory issues       | `export NODE_OPTIONS="--max-old-space-size=4096"`    |

### Emergency Commands

```bash
# Emergency backup
./scripts/backup.sh emergency-$(date +%Y%m%d-%H%M%S)

# System restart
docker-compose down && docker-compose up -d

# Clear all caches
redis-cli FLUSHALL
bun run blog:workflow:status --clear-cache

# Restore from backup
./scripts/recover.sh <backup-name>
```

---

_For additional help or questions about troubleshooting, please refer to our
[support documentation](https://docs.cuetimer.com) or contact our technical
support team._

```

```
