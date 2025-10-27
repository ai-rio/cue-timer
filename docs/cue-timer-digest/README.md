# Sharded Digest Output

This directory contains the intelligently sharded output from `digest.txt`.

## Structure

```
.
├── README.md                 # This file
├── INDEX.md                  # Human-readable chunk index
├── INDEX.json                # Machine-readable chunk metadata
└── chunks/                   # Organized chunks
    ├── 000-overview/         # Project overview
    ├── documentation-*/      # Documentation files
    ├── components-*/         # Component files
    ├── pages-*/              # Page files
    ├── api-*/                # API files
    └── ...                   # Other categorized groups
```

## Usage

### For LLM Context

1. **Start with overview**: Read `chunks/000-overview/chunk_000.md` first
2. **Navigate by category**: Browse `INDEX.md` to find relevant chunks
3. **Load specific chunks**: Each chunk is optimized for LLM context windows
   (~6-8K tokens)

### For Analysis

Use `INDEX.json` for programmatic access to chunk metadata.

## Statistics

- **Total Chunks**: 111
- **Total Files**: 325
- **Average Chunk Size**: 21,473 characters

## Chunk Organization

Chunks are organized by:

1. **Category**: Type of files (docs, components, pages, etc.)
2. **Location**: Top-level directory in original project
3. **Size**: Each chunk stays under 32K characters (~8K tokens)

## Navigation Tips

- Each chunk includes metadata about its contents
- File paths are preserved for reference
- Related files are grouped together when possible
- Check `INDEX.md` for the complete chunk map

---

Generated with `shard_digest.py`
