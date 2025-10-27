# Architecture & Approach

## Overview

This tool intelligently shards large project digests into LLM-friendly chunks
while preserving semantic meaning and context.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT: digest.txt                        │
│                   (82,000+ lines)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  PARSING PHASE                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. Extract Directory Structure                       │   │
│  │    └─> Stored as chunk_000 (overview)               │   │
│  │                                                       │   │
│  │ 2. Split by File Separators                         │   │
│  │    Pattern: ===...=== FILE: path ===...===           │   │
│  │                                                       │   │
│  │ 3. Create FileChunk Objects                          │   │
│  │    - path: File path                                 │   │
│  │    - content: Complete file content                  │   │
│  │    - size_chars: Character count                     │   │
│  │    - category: Auto-categorized                      │   │
│  │    - line_start/end: Line numbers                    │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                CATEGORIZATION PHASE                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Automatic file categorization by:                    │   │
│  │                                                       │   │
│  │ • documentation  → .md files, /docs/ folder          │   │
│  │ • components     → /components/, /ui/, /blog/        │   │
│  │ • pages          → /app/, /pages/                    │   │
│  │ • api            → /api/ routes                      │   │
│  │ • tests          → test files, __tests__             │   │
│  │ • config         → .json, .yml, .toml files          │   │
│  │ • source         → .ts, .tsx, .js, .jsx              │   │
│  │ • styles         → .css, .scss                       │   │
│  │ • other          → Everything else                   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  CHUNKING PHASE                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Group files by:                                       │   │
│  │   category + top_level_directory                     │   │
│  │                                                       │   │
│  │ Examples:                                             │   │
│  │   • documentation_docs                                │   │
│  │   • components_app                                    │   │
│  │   • api_app                                           │   │
│  │                                                       │   │
│  │ Size constraints:                                     │   │
│  │   • MAX: 32,000 chars (~8K tokens)                   │   │
│  │   • IDEAL: 24,000 chars (~6K tokens)                 │   │
│  │                                                       │   │
│  │ Strategy:                                             │   │
│  │   • Keep complete files together                     │   │
│  │   • Never split files mid-content                    │   │
│  │   • Create new chunk when size exceeded              │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   OUTPUT PHASE                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Create organized structure:                           │   │
│  │                                                       │   │
│  │ sharded_output/                                       │   │
│  │ ├── README.md      ← Usage guide                     │   │
│  │ ├── INDEX.md       ← Human navigation                │   │
│  │ ├── INDEX.json     ← Machine metadata                │   │
│  │ └── chunks/                                           │   │
│  │     ├── 000-overview/                                 │   │
│  │     │   └── chunk_000.md  ← Directory structure      │   │
│  │     ├── documentation-docs/                           │   │
│  │     │   ├── chunk_001.md                              │   │
│  │     │   └── chunk_002.md                              │   │
│  │     ├── components-app/                               │   │
│  │     │   └── chunk_003.md                              │   │
│  │     └── ...                                           │   │
│  │                                                       │   │
│  │ Each chunk contains:                                  │   │
│  │   • Metadata (file count, size, categories)          │   │
│  │   • File listing                                      │   │
│  │   • Complete file contents with syntax highlighting  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Complete File Preservation

**Decision**: Never split a file across multiple chunks  
**Rationale**: Maintains context and prevents broken code/documentation

### 2. Semantic Grouping

**Decision**: Group by category + location  
**Rationale**: Related files stay together, easier navigation

### 3. Size Optimization

**Decision**: Target ~6K tokens per chunk (24K chars)  
**Rationale**: Fits comfortably in most LLM context windows with room for
prompts

### 4. Hierarchical Organization

**Decision**: Nested folder structure by group  
**Rationale**: Easy to find and focus on specific project areas

### 5. Rich Metadata

**Decision**: Both JSON and Markdown indices  
**Rationale**: Human-readable and machine-processable

## Chunking Algorithm

```python
def create_chunks():
    grouped_files = {}

    # 1. Group files by category + top directory
    for file in files:
        key = f"{file.category}_{file.top_dir}"
        grouped_files[key].append(file)

    # 2. Create chunks respecting size limits
    for group, files in grouped_files.items():
        current_chunk = []
        current_size = 0

        for file in files:
            # If adding file exceeds max, save current chunk
            if current_size + file.size > MAX_SIZE and current_chunk:
                save_chunk(current_chunk)
                current_chunk = []
                current_size = 0

            # Add file to current chunk
            current_chunk.append(file)
            current_size += file.size

        # Save remaining files
        if current_chunk:
            save_chunk(current_chunk)
```

## File Format

### Input Format

```
Directory structure:
[tree structure]

================================================
FILE: path/to/file.ext
================================================
[file content]

================================================
FILE: another/file.ext
================================================
[file content]
```

### Output Format (Chunk)

````markdown
# Chunk N: group-name

## Metadata

- **Files**: X
- **Size**: Y characters (~Z tokens)
- **Categories**: category1, category2

## Files in this chunk

- `path/to/file1`
- `path/to/file2`

---

## File: `path/to/file1`

```language
[file content]
```
````

## File: `path/to/file2`

```language
[file content]
```

````

## Performance Characteristics

| Metric | Typical Value |
|--------|---------------|
| Parse Speed | ~1-2 seconds per 100K lines |
| Chunk Creation | ~0.5-1 seconds per 1000 files |
| Write Speed | ~2-3 seconds per 50 chunks |
| Memory Usage | ~2x input file size |
| Typical Total Time | 5-10 seconds for project digest |

## Scalability

- **Small projects** (10-50 files): ~10 chunks
- **Medium projects** (100-500 files): ~50 chunks
- **Large projects** (500+ files): ~100+ chunks

## Extension Points

### Custom Categories
Modify `_categorize_file()` to add new categories:

```python
def _categorize_file(self, path: str) -> str:
    if 'hooks/' in path:
        return 'hooks'
    elif 'utils/' in path:
        return 'utilities'
    # ... existing categories
````

### Custom Chunk Sizes

Adjust constants for different target token counts:

```python
MAX_CHUNK_SIZE = 16000   # ~4K tokens (smaller)
MAX_CHUNK_SIZE = 48000   # ~12K tokens (larger)
```

### Custom Output Formats

Override `_write_chunk_file()` for different formats:

```python
def _write_chunk_file(self, ...):
    # Generate HTML instead of Markdown
    # Or JSON, or any other format
```

## Error Handling

The tool handles several edge cases:

1. **Missing files**: Validates input exists
2. **Invalid format**: Gracefully handles malformed separators
3. **Empty content**: Handles files with no content
4. **Unicode**: Full UTF-8 support
5. **Large files**: No size limits on individual files

## Future Enhancements

Potential improvements:

- [ ] Parallel chunking for massive digests
- [ ] Smart chunk splitting (respect code blocks/sections)
- [ ] Incremental updates (only re-shard changed files)
- [ ] Custom templates for chunk output
- [ ] Integration with vector databases
- [ ] Automatic keyword extraction per chunk
- [ ] Dependency graph visualization

## Philosophy

> **Goal**: Make large project digests accessible to LLMs by creating
> semantically meaningful, appropriately sized chunks that preserve context and
> enable efficient analysis.

The tool prioritizes:

1. **Context preservation** over size optimization
2. **Semantic grouping** over alphabetical ordering
3. **Complete files** over split content
4. **Human readability** alongside machine processing
