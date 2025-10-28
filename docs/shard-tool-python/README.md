# Digest Sharding Tool

Intelligently shard large project digests into LLM-friendly chunks with semantic
organization.

## Features

- 🧠 **Intelligent Parsing**: Automatically detects file boundaries in digest
  format
- 📁 **Semantic Organization**: Groups files by category and project structure
- 🎯 **LLM-Optimized**: Chunks sized for optimal LLM context windows (~6-8K
  tokens)
- 📊 **Rich Metadata**: JSON and Markdown indices for easy navigation
- 🔍 **Context Preservation**: Keeps complete files intact, never splits
  mid-content

## Quick Start

### Installation (using uv)

```bash
# Install uv if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone or download this tool
cd digest-sharding

# Run directly with uv (no installation needed!)
uv run shard_digest.py your_digest.txt
```

### Basic Usage

```bash
# Shard a digest file (output to ./sharded_output)
uv run shard_digest.py digest.txt

# Specify custom output directory
uv run shard_digest.py digest.txt -o ./my_output

# View help
uv run shard_digest.py --help
```

## How It Works

### 1. Parsing Phase

The tool parses your digest file by:

- Extracting the directory structure (stored as chunk 000)
- Identifying file boundaries using `====...====` separators
- Categorizing files by type (docs, components, API, tests, etc.)

### 2. Chunking Phase

Files are intelligently grouped by:

- **Category**: Documentation, components, pages, API routes, tests, config
- **Location**: Top-level directory in the project structure
- **Size**: Each chunk stays under 32K characters (~8K tokens)

### 3. Output Phase

Creates organized output:

```
sharded_output/
├── README.md              # Usage guide
├── INDEX.md               # Human-readable chunk map
├── INDEX.json             # Machine-readable metadata
└── chunks/
    ├── 000-overview/      # Project structure
    ├── documentation-docs/
    ├── components-components/
    ├── pages-app/
    └── ...
```

## Output Structure

### Chunk Files

Each chunk is a markdown file containing:

````markdown
# Chunk 001: documentation-docs

## Metadata

- **Files**: 5
- **Size**: 12,543 characters (~3,135 tokens)
- **Categories**: documentation

## Files in this chunk

- `docs/README.md`
- `docs/setup.md` ...

---

## File: `docs/README.md`

```markdown
[file content here]
```
````

...

````

### Index Files

**INDEX.md**: Human-readable with:
- Group overview with statistics
- Expandable file lists for each chunk
- Direct links to chunk files

**INDEX.json**: Machine-readable with:
- Complete chunk metadata
- Group statistics
- File listings

## Customization

### Chunk Size

Edit these constants in `shard_digest.py`:

```python
MAX_CHUNK_SIZE = 32000  # ~8K tokens (hard limit)
IDEAL_CHUNK_SIZE = 24000  # ~6K tokens (target)
````

### Categories

The tool auto-categorizes files. To modify categories, edit the
`_categorize_file` method:

```python
def _categorize_file(self, path: str) -> str:
    # Add your custom categorization logic
    if 'your_pattern' in path:
        return 'your_category'
    ...
```

## Use Cases

### For LLM Analysis

```bash
# Shard your project digest
uv run shard_digest.py project_digest.txt

# Feed chunks to LLM sequentially
# Start with: chunks/000-overview/chunk_000.md
# Then process relevant chunks based on your analysis needs
```

### For Code Review

```bash
# Shard the codebase digest
uv run shard_digest.py codebase.txt -o ./review_chunks

# Review category by category:
# - Documentation first (documentation-*)
# - Then tests (tests-*)
# - Then implementation (components-*, api-*)
```

### For Documentation

```bash
# Extract just documentation
uv run shard_digest.py project.txt

# Focus on chunks in documentation-* folders
# Use INDEX.md to navigate to specific topics
```

## Tips & Best Practices

### For LLM Context

1. **Start with overview**: Always load `chunk_000` first for project structure
2. **Navigate by category**: Use categories to find relevant code sections
3. **Sequential processing**: Process chunks in order within a category
4. **Cross-reference**: Use `INDEX.md` to find related chunks

### For Large Digests

1. **Memory efficient**: Tool processes files sequentially
2. **Fast parsing**: Regex-based parsing handles 100K+ line files
3. **Organized output**: Hierarchical folder structure for easy navigation

### For Team Collaboration

1. **Share the index**: Send `INDEX.md` for quick navigation
2. **Reference chunks**: Use chunk IDs in discussions ("See chunk 042")
3. **Category focus**: Different team members can focus on different categories

## Troubleshooting

### "File not found" error

```bash
# Ensure the path is correct
ls -la your_digest.txt

# Use absolute path if needed
uv run shard_digest.py /full/path/to/digest.txt
```

### Output directory exists

```bash
# Tool will overwrite existing output
# To preserve, use a new directory name
uv run shard_digest.py digest.txt -o ./output_v2
```

### Chunks too large/small

Edit the size constants in `shard_digest.py`:

```python
# For smaller chunks (more granular)
MAX_CHUNK_SIZE = 16000  # ~4K tokens

# For larger chunks (more context)
MAX_CHUNK_SIZE = 48000  # ~12K tokens
```

## Technical Details

### File Format Support

The tool expects digest files in this format:

```
Directory structure:
[directory tree here]

================================================
FILE: path/to/file.ext
================================================
[file content here]

================================================
FILE: path/to/another.ext
================================================
[file content here]
...
```

### Performance

- **Parsing**: ~1-2 seconds for 100K lines
- **Chunking**: ~0.5-1 seconds for 1000 files
- **Writing**: ~2-3 seconds for 50 chunks
- **Total**: ~5-10 seconds for typical project digests

### Memory Usage

- Loads entire digest into memory (efficient for files < 500MB)
- Processes files sequentially during chunking
- Minimal overhead (~2x file size in RAM)

## Advanced Usage

### Programmatic Use

```python
from pathlib import Path
from shard_digest import DigestSharding

# Create sharding instance
sharding = DigestSharding(
    input_file=Path('digest.txt'),
    output_dir=Path('./output')
)

# Run sharding
sharding.parse_digest()
sharding.create_chunks()
sharding.write_output()

# Access metadata
print(f"Created {len(sharding.chunks)} chunks")
print(f"Processed {len(sharding.files)} files")
```

### Custom Processing

```python
# After parsing, access files directly
for file_chunk in sharding.files:
    if file_chunk.category == 'documentation':
        # Custom processing for docs
        process_documentation(file_chunk)
```

## Contributing

This is a standalone tool. Feel free to modify `shard_digest.py` for your
specific needs!

### Common Modifications

1. **Add new categories**: Edit `_categorize_file()`
2. **Change chunk sizes**: Edit `MAX_CHUNK_SIZE` and `IDEAL_CHUNK_SIZE`
3. **Custom grouping**: Edit `create_chunks()` logic
4. **Output format**: Edit `_write_chunk_file()` for different formatting

## License

MIT License - Feel free to use and modify!

## Credits

Built for intelligent LLM-friendly document processing with semantic chunking.

---

**Need help?** Check the code comments in `shard_digest.py` for detailed
implementation notes.
