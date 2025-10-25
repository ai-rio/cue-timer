# Blog Creation CLI

A comprehensive command-line interface for creating blog posts using CueTimer
templates. This tool provides both interactive and non-interactive modes to
streamline your content creation workflow.

## 🚀 Quick Start

```bash
# Interactive mode (default)
bun run blog:create

# Non-interactive mode
bun run blog:create --title "My Post" --template timing-guide --author "John Doe"

# Show available templates
bun run blog:create help-templates

# Show help
bun run blog:create --help
```

## 📋 Available Templates

### 1. Timing Guide (`timing-guide`)

Step-by-step guides for mastering presentation timing techniques.

**Use cases:**

- Educational content about timing strategies
- How-to guides for specific timing scenarios
- Best practices for different presentation types

### 2. Case Study (`case-study`)

Success stories and real-world applications of CueTimer.

**Use cases:**

- Customer success stories
- Implementation case studies
- ROI-focused content

### 3. Feature Announcement (`feature-announce`)

Announce new features and updates to the CueTimer platform.

**Use cases:**

- Product launches
- Feature updates
- Platform improvements

### 4. Presentation Tips (`presentation-tips`)

Practical tips and best practices for better presentations.

**Use cases:**

- Educational content
- Best practice guides
- Skill development articles

## 🌐 Supported Languages

- `en` - English
- `pt-br` - Português (Brazil)
- `es` - Español

## 📖 Command Line Options

| Option                  | Type   | Default         | Description                             |
| ----------------------- | ------ | --------------- | --------------------------------------- |
| `--title <title>`       | string | -               | Blog post title                         |
| `--template <template>` | string | -               | Template type (see available templates) |
| `--language <language>` | string | `en`            | Language code (en, pt-br, es)           |
| `--author <author>`     | string | `CueTimer Team` | Author name                             |
| `--draft`               | flag   | `true`          | Create as draft                         |
| `--no-draft`            | flag   | -               | Create as published                     |
| `--interactive`         | flag   | `true`          | Use interactive prompts                 |
| `--no-interactive`      | flag   | -               | Skip prompts, use only CLI args         |

## 💡 Usage Examples

### Interactive Mode (Recommended for beginners)

```bash
bun run blog:create
```

This will guide you through:

1. Template selection with descriptions
2. Language selection
3. Author information
4. Template-specific variable collection
5. Review and confirmation

### Non-Interactive Mode (For automation/scripts)

```bash
# Basic timing guide
bun run blog:create \
  --title "Mastering Conference Presentations" \
  --template timing-guide \
  --author "Sarah Johnson" \
  --no-interactive

# Published case study
bun run blog:create \
  --title "TechCorp Success Story" \
  --template case-study \
  --author "Marketing Team" \
  --no-draft \
  --no-interactive

# Multi-language content
bun run blog:create \
  --title "Guía de Temporización" \
  --template timing-guide \
  --language pt-br \
  --author "Equipe CueTimer" \
  --no-interactive
```

## 🎯 Template-Specific Features

### Timing Guide

- **Difficulty levels**: beginner, intermediate, advanced
- **Time estimates**: Customizable completion times
- **Step-by-step instructions**: Dynamic step collection
- **Tips and best practices**: Add expert tips for each step
- **Prerequisites and tools**: Comprehensive setup guidance

### Case Study

- **Client information**: Industry, company details
- **Challenge/solution format**: Problem-solving narrative
- **Measurable results**: Quantifiable achievements with metrics
- **Client testimonials**: Add authentic customer quotes
- **Implementation timeline**: Step-by-step rollout process

### Feature Announcement

- **Version information**: Release numbers and dates
- **Key benefits**: Value proposition highlights
- **Use cases**: Real-world application scenarios
- **Technical details**: Implementation information
- **Early feedback**: Beta user testimonials

### Presentation Tips

- **Skill categorization**: delivery, content, visual, timing, engagement
- **Difficulty targeting**: Beginner to advanced content
- **Real-world examples**: Practical application scenarios
- **Common mistakes**: Pitfalls and solutions
- **Additional resources**: Further learning materials

## 📁 File Structure

Created files follow this structure:

```
content/blog/
├── YYYY/
│   └── MM/
│       ├── post-title.mdx
│       ├── another-post.mdx
│       └── ...
```

For example:

```
content/blog/2025/10/mastering-conference-presentations.mdx
```

## 🎨 Generated Content Features

All generated posts include:

### Front Matter

- Title, slug, category
- Author and publication info
- SEO metadata
- Language and draft status
- Reading time estimation

### Rich Content

- MDX with React components
- Tailwind CSS styling
- Responsive design
- Heroicons integration
- Interactive elements

### Structure

- Semantic HTML
- ARIA accessibility
- SEO-optimized headings
- Internal linking
- Call-to-action sections

## 🔧 Testing

Run the test suite to verify functionality:

```bash
bun run scripts/test-blog-create.ts
```

This will test:

- CLI command execution
- All template types
- File creation
- Error handling
- Help commands

## ⚠️ Error Handling

The CLI provides clear error messages for common issues:

- **Invalid template**: Shows available options
- **Missing required fields**: Guides you to provide needed information
- **File system errors**: Reports permission or path issues
- **Validation errors**: Highlights specific problems with input

## 🚨 Troubleshooting

### Common Issues

1. **Permission denied**

   ```bash
   chmod +x scripts/blog-create.ts
   ```

2. **Module not found**

   ```bash
   bun install
   ```

3. **Template not found**

   ```bash
   bun run blog:create help-templates
   ```

4. **Content directory not created**
   - The CLI automatically creates directories as needed
   - Ensure you have write permissions in the project root

### Getting Help

1. **Show all commands**:

   ```bash
   bun run blog:create --help
   ```

2. **Show templates**:

   ```bash
   bun run blog:create help-templates
   ```

3. **Run tests**:
   ```bash
   bun run scripts/test-blog-create.ts
   ```

## 🔄 Workflow Integration

### Content Creation Pipeline

1. **Planning**: Use the CLI to create initial drafts
2. **Editing**: Customize generated content as needed
3. **Review**: Test in development environment
4. **Publish**: Change draft status when ready

### Automation Examples

**Batch creation**:

```bash
#!/bin/bash
# Create multiple posts from a CSV file
while IFS=, read -r title template author; do
  bun run blog:create \
    --title "$title" \
    --template "$template" \
    --author "$author" \
    --no-interactive
done < posts.csv
```

**CI/CD integration**:

```yaml
# GitHub Actions example
- name: Create Blog Post
  run: |
    bun run blog:create \
      --title "Release ${{ github.ref_name }}" \
      --template feature-announce \
      --author "GitHub Actions" \
      --no-interactive
```

## 🎯 Best Practices

1. **Use descriptive titles**: Include keywords for SEO
2. **Choose appropriate templates**: Match content type to template
3. **Fill in all template variables**: Richer content creation
4. **Review generated content**: Customize and enhance as needed
5. **Test before publishing**: Verify links and formatting
6. **Use consistent authoring**: Maintain brand voice

## 📝 Customization

### Extending Templates

Templates are located in `lib/blog-scripts/templates/`. To customize:

1. Edit template files directly
2. Modify variable definitions
3. Update content generation functions
4. Test changes with the CLI

### Adding New Templates

1. Create new template file in `templates/` directory
2. Implement required interfaces
3. Export template and helper functions
4. Add to template mapping in CLI script
5. Test thoroughly

## 📊 Performance

- **Non-interactive mode**: ~2-3 seconds per post
- **Interactive mode**: Depends on user input
- **File generation**: Instantaneous
- **Memory usage**: Minimal (<50MB)

## 🔐 Security

- No external API calls
- Local file operations only
- No sensitive data collection
- Safe input validation

## 📄 License

This CLI tool is part of the CueTimer project and follows the same licensing
terms.

---

For additional support or questions, please refer to the main CueTimer
documentation or contact the development team.
