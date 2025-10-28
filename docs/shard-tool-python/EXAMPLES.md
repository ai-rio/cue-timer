# Usage Examples

## Basic Examples

### Example 1: Simple Sharding

```bash
# Shard a digest file to default output directory
./run.sh digest.txt

# Output will be in ./sharded_output/
```

### Example 2: Custom Output Directory

```bash
# Specify where to put the sharded output
./run.sh digest.txt ./my_analysis

# Output will be in ./my_analysis/
```

### Example 3: Windows Path (WSL)

```bash
# If your digest is in Windows filesystem
./run.sh /mnt/c/Users/YourName/Documents/digest.txt

# Or relative to a mounted drive
./run.sh /mnt/d/projects/digest.txt ./output
```

## Advanced Examples

### Example 4: Process Multiple Digests

```bash
# Create a script to process multiple digests
for file in digests/*.txt; do
    basename=$(basename "$file" .txt)
    ./run.sh "$file" "./output_${basename}"
done
```

### Example 5: Analysis Workflow

```bash
# 1. Shard the digest
./run.sh project_digest.txt ./analysis

# 2. Review the overview
cat ./analysis/chunks/000-overview/chunk_000.md

# 3. Check the index for navigation
cat ./analysis/INDEX.md

# 4. Analyze specific categories
ls ./analysis/chunks/documentation-*
ls ./analysis/chunks/components-*
```

### Example 6: Extract Specific Category

```bash
# After sharding, extract only documentation chunks
./run.sh digest.txt ./full_output

# Copy just documentation
mkdir ./docs_only
cp -r ./full_output/chunks/documentation-* ./docs_only/
```

## LLM Integration Examples

### Example 7: Sequential Processing

```bash
# For feeding to an LLM in sequence
./run.sh digest.txt ./llm_chunks

# Then in your LLM workflow:
# 1. Load chunk_000 (overview)
# 2. Load chunks by category
# 3. Process in order within each category
```

### Example 8: Context Window Management

```python
# Python script to feed chunks to LLM
import json
from pathlib import Path

# Load the index
with open('sharded_output/INDEX.json') as f:
    index = json.load(f)

# Process chunks that fit in context
max_tokens = 100000  # Your LLM's context window
current_tokens = 0
chunks_to_load = []

for chunk in index['chunks']:
    chunk_tokens = chunk['total_chars'] // 4  # Rough estimate
    if current_tokens + chunk_tokens < max_tokens:
        chunks_to_load.append(chunk['id'])
        current_tokens += chunk_tokens
    else:
        break

print(f"Can load {len(chunks_to_load)} chunks in context")
```

## Customization Examples

### Example 9: Custom Chunk Size

```python
# Edit shard_digest.py and modify these lines:
MAX_CHUNK_SIZE = 16000  # Smaller chunks for tighter context
IDEAL_CHUNK_SIZE = 12000

# Then run normally
./run.sh digest.txt
```

### Example 10: Custom Categories

```python
# Edit shard_digest.py, modify _categorize_file method:
def _categorize_file(self, path: str) -> str:
    path_lower = path.lower()

    # Add custom categories
    if 'hooks/' in path_lower:
        return 'hooks'
    elif 'utils/' in path_lower:
        return 'utilities'
    # ... rest of categories
```

## Real-World Scenarios

### Scenario 1: Code Review Preparation

```bash
# 1. Shard the codebase digest
./run.sh codebase_digest.txt ./review

# 2. Review in priority order
cat ./review/INDEX.md | grep "documentation-"  # Review docs first
cat ./review/INDEX.md | grep "tests-"          # Check test coverage
cat ./review/INDEX.md | grep "api-"            # Review API endpoints
cat ./review/INDEX.md | grep "components-"     # Review UI components
```

### Scenario 2: AI-Assisted Refactoring

```bash
# 1. Create initial digest and shard
./run.sh project_v1.txt ./v1_sharded

# 2. After refactoring, create new digest and shard
./run.sh project_v2.txt ./v2_sharded

# 3. Compare structures
diff ./v1_sharded/INDEX.md ./v2_sharded/INDEX.md
```

### Scenario 3: Documentation Generation

```bash
# 1. Shard the project
./run.sh project.txt ./docs_gen

# 2. Extract documentation chunks
find ./docs_gen/chunks/documentation-* -name "*.md" > doc_chunks.txt

# 3. Feed to LLM to generate comprehensive docs
# (Process each chunk and aggregate)
```

### Scenario 4: Onboarding New Team Members

```bash
# 1. Create sharded overview
./run.sh project_digest.txt ./onboarding

# 2. Create learning path
echo "Learning Path:" > LEARNING_PATH.md
echo "1. Start here: ./onboarding/chunks/000-overview/chunk_000.md" >> LEARNING_PATH.md
echo "2. Then read: ./onboarding/INDEX.md" >> LEARNING_PATH.md
echo "3. Focus areas:" >> LEARNING_PATH.md
echo "   - Documentation: chunks/documentation-*" >> LEARNING_PATH.md
echo "   - Key components: chunks/components-*" >> LEARNING_PATH.md
```

## Performance Examples

### Example 11: Benchmarking

```bash
# Time the sharding process
time ./run.sh large_digest.txt ./output

# Check output size
du -sh ./output
ls ./output/chunks/ | wc -l  # Count chunk directories
```

### Example 12: Memory Profiling

```python
# Add memory profiling to shard_digest.py
import tracemalloc

tracemalloc.start()

# ... run sharding ...

current, peak = tracemalloc.get_traced_memory()
print(f"Current memory: {current / 1024 / 1024:.2f} MB")
print(f"Peak memory: {peak / 1024 / 1024:.2f} MB")
tracemalloc.stop()
```

## Integration Examples

### Example 13: CI/CD Pipeline

```yaml
# .github/workflows/shard-docs.yml
name: Shard Documentation

on:
  push:
    paths:
      - 'docs/**'

jobs:
  shard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install uv
        run: curl -LsSf https://astral.sh/uv/install.sh | sh

      - name: Create digest
        run: |
          # Your digest creation logic
          ./create_digest.sh > project_digest.txt

      - name: Shard digest
        run: |
          uv run shard_digest.py project_digest.txt ./sharded

      - name: Upload artifacts
        uses: actions/upload-artifact@v2
        with:
          name: sharded-docs
          path: ./sharded
```

### Example 14: Makefile Integration

```makefile
# Makefile
.PHONY: shard clean

shard:
	@echo "Creating project digest..."
	@./create_digest.sh > digest.txt
	@echo "Sharding digest..."
	@./run.sh digest.txt ./sharded_output
	@echo "Done! Check ./sharded_output/"

clean:
	rm -rf ./sharded_output
	rm -f digest.txt

analyze: shard
	@echo "Opening index..."
	@cat ./sharded_output/INDEX.md
```

## Troubleshooting Examples

### Example 15: Debug Mode

```bash
# Add verbose output to run.sh
set -x  # Enable debug mode
./run.sh digest.txt

# Or run Python directly to see errors
uv run python -u shard_digest.py digest.txt -o ./output 2>&1 | tee sharding.log
```

### Example 16: Validate Output

```bash
# After sharding, validate the output
./run.sh digest.txt ./output

# Check that all chunks were created
expected_chunks=$(jq '.total_chunks' ./output/INDEX.json)
actual_chunks=$(find ./output/chunks -name "chunk_*.md" | wc -l)

if [ "$expected_chunks" -eq "$actual_chunks" ]; then
    echo "✅ All chunks created successfully"
else
    echo "❌ Chunk count mismatch"
fi
```

## Tips & Tricks

### Quick Navigation

```bash
# Alias for quick sharding
alias shard='./run.sh'

# Usage
shard digest.txt
shard another.txt ./other_output
```

### Batch Processing

```bash
# Process all digests in a directory
find ./digests -name "*.txt" -exec ./run.sh {} ./outputs/{} \;
```

### Search Across Chunks

```bash
# Search for a term across all chunks
grep -r "searchTerm" ./sharded_output/chunks/

# Search in specific category
grep -r "componentName" ./sharded_output/chunks/components-*/
```
