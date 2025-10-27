# Quick Start Guide

## Installation (1 minute)

```bash
# 1. Download or clone the tool to your WSL environment
cd ~
# (place the files here)

# 2. Make the run script executable
chmod +x run.sh

# 3. You're ready! No dependencies needed - uses standard Python 3
```

## Usage (30 seconds)

```bash
# Basic usage
./run.sh your_digest.txt

# Output will be in ./sharded_output/
```

## What You Get

```
sharded_output/
├── README.md              # How to use the output
├── INDEX.md               # Navigate all chunks (human-readable)
├── INDEX.json             # Metadata (machine-readable)
└── chunks/                # Your organized chunks
    ├── 000-overview/      # ⭐ START HERE
    │   └── chunk_000.md   # Project directory structure
    ├── documentation-*/   # All documentation files
    ├── components-*/      # UI components
    ├── pages-*/           # Application pages
    ├── api-*/             # API routes
    └── ...
```

## Next Steps

1. **Open** `sharded_output/README.md` for output guide
2. **Check** `sharded_output/INDEX.md` for chunk navigation
3. **Start** with `chunks/000-overview/chunk_000.md`

## Windows Paths (WSL)

```bash
# If your digest is on Windows drive
./run.sh /mnt/c/Users/YourName/Documents/digest.txt

# Or D: drive
./run.sh /mnt/d/projects/digest.txt ./output
```

## Tips

- Each chunk is ~6-8K tokens (perfect for LLM context)
- Files are grouped by category and location
- Complete files are never split
- Use INDEX.md to navigate chunks

## Need Help?

- See `README.md` for detailed documentation
- See `EXAMPLES.md` for usage examples
- Run `./run.sh` with no args to see usage

---

**That's it!** The tool has no dependencies and works with standard Python 3.
