# CueTimer Documentation Naming Conventions

## Overview

This document establishes the naming conventions for all CueTimer documentation
files and folders to ensure consistency, clarity, and easy navigation.

## File Naming Standards

### General Rules

- **Use kebab-case** for all file and folder names
- **Use lowercase letters only**
- **Separate words with hyphens (-)**
- **Be descriptive but concise**
- **Avoid spaces, underscores, or special characters**

### File Naming Pattern

```
[category]-[subcategory]-[description].[extension]
```

### Examples

- ✅ `project-brief.md`
- ✅ `user-research-insights.md`
- ✅ `api-endpoint-reference.md`
- ❌ `Project Brief.md`
- ❌ `project_brief.md`
- ❌ `projectBrief.md`

## Folder Structure

### Documentation Organization

```
docs/
├── strategy/
│   ├── project-planning/
│   ├── go-to-market/
│   └── roadmap/
├── design/
│   ├── branding/
│   ├── ui-ux/
│   └── technical-specs/
├── development/
│   ├── api-docs/
│   ├── deployment/
│   └── guides/
├── research/
│   ├── market-analysis/
│   ├── competitor-analysis/
│   └── user-research/
├── templates/
│   ├── prompts/
│   └── checklists/
└── assets/
    ├── images/
    └── brand-resources/
```

### Naming Conventions by Category

#### Strategy Documents

- `project-brief.md`
- `business-plan.md`
- `market-strategy.md`
- `competitive-analysis.md`
- `go-to-market-plan.md`
- `revenue-model.md`

#### Design Documents

- `brand-guidelines.md`
- `design-system.md`
- `color-palette.md`
- `typography-specs.md`
- `component-library.md`
- `wireframe-templates.md`
- `user-flow-diagrams.md`

#### Development Documents

- `api-documentation.md`
- `deployment-guide.md`
- `setup-instructions.md`
- `coding-standards.md`
- `testing-strategy.md`
- `database-schema.md`

#### Research Documents

- `user-interviews.md`
- `market-research.md`
- `competitor-analysis.md`
- `survey-results.md`
- `persona-profiles.md`
- `user-feedback.md`

#### Templates

- `meeting-notes-template.md`
- `project-review-template.md`
- `user-testing-template.md`
- `design-review-template.md`

## File Metadata Standards

### Markdown Front Matter

All markdown files should include front matter with:

```yaml
---
title: 'Document Title'
description: 'Brief description of document content'
date: 'YYYY-MM-DD'
version: '1.0'
status: 'draft|review|approved|archived'
author: 'Author Name'
tags: ['tag1', 'tag2']
category: 'strategy|design|development|research'
---
```

## Version Control

### File Versioning

- Use semantic versioning for major documents
- Include version number in filename for major releases
- Example: `design-system-v2.0.md`

### Change Log

Maintain a `CHANGELOG.md` in each category folder:

```markdown
# Change Log - [Category]

## [Unreleased]

- Changes in progress

## [1.0.0] - 2024-10-23

- Initial release
```

## Best Practices

### File Organization

- Group related files together
- Use descriptive names that indicate content
- Keep folder structures shallow (max 3-4 levels)
- Use index files for complex sections

### Content Standards

- Write clear, concise headings
- Use consistent formatting
- Include table of contents for long documents
- Add internal links between related documents

### Maintenance

- Review and update documentation regularly
- Archive outdated content instead of deleting
- Use status tags to indicate document readiness
- Keep naming conventions consistent across the project

## Migration Guide

### Renaming Existing Files

When renaming existing files:

1. Update all internal links
2. Update any references in code
3. Consider adding redirects for web-published docs
4. Update the table of contents
5. Notify team members of changes

### Quality Checklist

- [ ] File name follows kebab-case convention
- [ ] Name is descriptive and concise
- [ ] File is in correct category folder
- [ ] Front matter is complete
- [ ] Internal links use correct naming
- [ ] Related files are properly grouped

---

**Last Updated:** 2024-10-23 **Maintained by:** Documentation Team **Review
Frequency:** Quarterly
