# Blog Index Navigation Examples

This document demonstrates how to use the **BLOG-INDEX.json** for LLM-friendly
navigation of blog-related functionality.

## 🚀 Quick Navigation Examples

### Example 1: Finding Blog Components

**Task:** Find blog search components

```json
{
  "navigation_request": "I need blog search functionality",
  "relevant_chunks": [3, 5, 8, 9],
  "components": [
    "AccessibleBlogSearch.tsx (chunk 3) - For accessibility compliance",
    "AdvancedBlogSearchAndFilter.tsx (chunk 5) - Full-featured search with Fuse.js",
    "BlogSearchAndFilter.tsx (chunk 8) - Standard search component",
    "BlogSearchAndFilterSimple.tsx (chunk 9) - Simple search for mobile"
  ],
  "file_paths": [
    "chunks/components-components/chunk_003.md",
    "chunks/components-components/chunk_005.md",
    "chunks/components-components/chunk_008.md",
    "chunks/components-components/chunk_009.md"
  ]
}
```

### Example 2: Creating a Blog Post

**Task:** Create a new blog post

```json
{
  "navigation_request": "I want to create a timing guide blog post",
  "workflow": [
    "Use scripts/blog-create.ts (chunk 83) to generate post",
    "Select template from lib/blog-scripts/templates/ (chunks 76-78)",
    "Customize content using content-creator.ts (chunk 75)",
    "Validate with scripts/blog-seo-check.ts (chunk 85)"
  ],
  "relevant_chunks": [83, 75, 76, 77, 78, 85],
  "templates_available": {
    "timing_guide": "chunk_078.md",
    "feature_announce": "chunk_077.md",
    "presentation_tips": "chunk_078.md",
    "case_study": "chunk_076.md"
  }
}
```

### Example 3: Debugging Blog Issues

**Task:** Debug blog content rendering

```json
{
  "navigation_request": "Blog content not rendering properly",
  "debug_resources": [
    "docs/blog-management/TROUBLESHOOTING.md (chunk 35)",
    "components/blog/BlogErrorBoundary.tsx (chunk 7)",
    "components/blog/AccessibleMDXRenderer.tsx (chunk 4)",
    "tests/integration/blog-content-manager.test.tsx (chunk 100)"
  ],
  "relevant_chunks": [35, 7, 4, 100],
  "file_patterns": {
    "components": "components/blog/**/*",
    "tests": "tests/**/blog*.ts",
    "docs": "docs/blog-management/**/*.md"
  }
}
```

## 📁 Category Navigation

### Components Category Breakdown

```json
{
  "components": {
    "search_and_filtering": {
      "chunks": [3, 5, 8, 9],
      "total_files": 4,
      "main_features": ["fuzzy search", "accessibility", "real-time filtering"]
    },
    "content_rendering": {
      "chunks": [4, 9, 10],
      "total_files": 3,
      "main_features": ["MDX rendering", "syntax highlighting", "accessibility"]
    },
    "blog_layouts": {
      "chunks": [8],
      "total_files": 6,
      "main_features": ["responsive grids", "card layouts", "navigation"]
    },
    "blog_features": {
      "chunks": [5, 10, 11],
      "total_files": 6,
      "main_features": ["author bios", "related posts", "language switching"]
    }
  }
}
```

### Library Code Breakdown

```json
{
  "library_code": {
    "blog_utilities": {
      "chunks": [74, 79],
      "files": ["blog-utils.ts", "blog.ts", "blog-seo.ts"],
      "purposes": ["helpers", "content processing", "SEO optimization"]
    },
    "blog_scripts": {
      "chunks": [75, 58],
      "files": ["content-creator.ts", "types.ts", "templates"],
      "purposes": ["content generation", "template processing"]
    },
    "blog_templates": {
      "chunks": [76, 77, 78, 79],
      "files": ["case-study.ts", "feature-announce.ts", "timing-guide.ts"],
      "purposes": ["pre-built templates for content types"]
    }
  }
}
```

## 🔍 Search Patterns

### By File Pattern

```json
{
  "search_request": "Find all blog component files",
  "pattern": "components/blog/**/*",
  "matches": {
    "chunks": [3, 4, 5, 6, 7, 8, 9, 10, 11],
    "file_count": 20,
    "examples": [
      "components/blog/AccessibleBlogSearch.tsx",
      "components/blog/BlogContent.tsx",
      "components/blog/BlogGrid.tsx"
    ]
  }
}
```

### By Functionality

```json
{
  "search_request": "Find blog testing infrastructure",
  "functionality": "testing",
  "matches": {
    "unit_tests": {
      "chunks": [63, 93, 98, 106, 107],
      "files": 5,
      "description": "Unit tests for blog scripts and functionality"
    },
    "integration_tests": {
      "chunks": [96, 100, 101],
      "files": 4,
      "description": "Integration tests for blog workflows"
    },
    "performance_tests": {
      "chunks": [105],
      "files": 1,
      "description": "Performance testing for blog system"
    }
  }
}
```

## 🎯 Quick Task Reference

### Common Tasks with Chunk Mapping

| Task                    | Relevant Chunks   | Files to Modify                     |
| ----------------------- | ----------------- | ----------------------------------- |
| **Create Blog Post**    | 83, 75, 76-78, 85 | `scripts/blog-create.ts`, templates |
| **Add Search Feature**  | 3, 5, 8, 9        | Search components                   |
| **Fix Rendering Issue** | 4, 7, 100         | MDX renderers, error boundaries     |
| **Add Author Section**  | 5                 | `AuthorBio.tsx`                     |
| **Implement SEO**       | 85, 79            | `blog-seo-check.ts`, SEO utilities  |
| **Deploy Blog System**  | 87, 30, 29        | Deployment scripts, docs            |

### LLM Prompt Examples

**Prompt for implementing blog search:**

```
"I need to implement blog search functionality. Based on the BLOG-INDEX.json, I should look at chunks 3, 5, 8, and 9. The AdvancedBlogSearchAndFilter.tsx (chunk 5) seems most comprehensive with Fuse.js fuzzy matching. Let me examine that component and implement it for my use case."
```

**Prompt for debugging blog issues:**

```
"Blog content is not rendering properly. According to the blog index, I should check: 1) BlogErrorBoundary.tsx (chunk 7) for error handling, 2) AccessibleMDXRenderer.tsx (chunk 4) for rendering issues, and 3) docs/blog-management/TROUBLESHOOTING.md (chunk 35) for common solutions. I'll start by examining the error boundary component."
```

**Prompt for creating blog content:**

```
"I want to create a timing guide blog post. The blog index shows I should use scripts/blog-create.ts (chunk 83) with the timing-guide template (chunk 78). I also need content-creator.ts (chunk 75) for customization and blog-seo-check.ts (chunk 85) for validation. Let me examine these files to understand the workflow."
```

## 📊 Usage Statistics

The BLOG-INDEX.json provides:

- **51 blog-related chunks** containing **89 files**
- **8 main categories** with logical subcategories
- **100% description coverage** for LLM understanding
- **Quick navigation tasks** with step-by-step workflows
- **File patterns** for systematic searching
- **Chunk-to-file mapping** for direct navigation

This structure enables LLMs to quickly locate and understand blog system
components, documentation, and workflows without scanning the entire codebase.
