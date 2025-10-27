#!/usr/bin/env python3
"""
Intelligent Document Sharding Tool for LLM Processing

Shards large project digests into semantically meaningful, LLM-friendly chunks
while preserving file structure and context.
"""

import re
from pathlib import Path
from typing import List, Dict, Tuple
from dataclasses import dataclass
import json


@dataclass
class FileChunk:
    """Represents a parsed file from the digest"""
    path: str
    content: str
    line_start: int
    line_end: int
    size_chars: int
    category: str


class DigestSharding:
    """Main sharding orchestrator"""
    
    # Target sizes for chunks (in characters)
    MAX_CHUNK_SIZE = 32000  # ~8K tokens
    IDEAL_CHUNK_SIZE = 24000  # ~6K tokens
    
    # File separator pattern
    FILE_SEPARATOR = re.compile(r'^={48}\nFILE: (.+?)\n={48}$', re.MULTILINE)
    
    def __init__(self, input_file: Path, output_dir: Path):
        self.input_file = input_file
        self.output_dir = output_dir
        self.files: List[FileChunk] = []
        self.chunks: List[Dict] = []
        
    def parse_digest(self) -> None:
        """Parse the digest file into individual file chunks"""
        print("📖 Parsing digest file...")
        
        content = self.input_file.read_text(encoding='utf-8')
        
        # Split by file separators
        parts = self.FILE_SEPARATOR.split(content)
        
        # First part is the directory structure
        if parts[0].strip():
            directory_structure = parts[0].strip()
            self.files.append(FileChunk(
                path="__directory_structure__",
                content=directory_structure,
                line_start=1,
                line_end=directory_structure.count('\n'),
                size_chars=len(directory_structure),
                category="metadata"
            ))
        
        # Process remaining parts (alternating file paths and contents)
        line_counter = directory_structure.count('\n') + 1
        for i in range(1, len(parts), 2):
            if i + 1 < len(parts):
                file_path = parts[i].strip()
                file_content = parts[i + 1]
                
                # Remove leading/trailing newlines but preserve internal structure
                file_content = file_content.strip('\n')
                
                content_lines = file_content.count('\n')
                category = self._categorize_file(file_path)
                
                self.files.append(FileChunk(
                    path=file_path,
                    content=file_content,
                    line_start=line_counter,
                    line_end=line_counter + content_lines,
                    size_chars=len(file_content),
                    category=category
                ))
                
                line_counter += content_lines + 4  # Account for separator lines
        
        print(f"✅ Parsed {len(self.files)} files from digest")
    
    def _categorize_file(self, path: str) -> str:
        """Categorize file by its path and extension"""
        path_lower = path.lower()
        
        # Category mapping
        if 'docs/' in path_lower or path_lower.endswith('.md'):
            return 'documentation'
        elif any(x in path_lower for x in ['component', '/ui/', 'blog/']):
            return 'components'
        elif 'app/' in path_lower or 'pages/' in path_lower:
            return 'pages'
        elif 'api/' in path_lower:
            return 'api'
        elif any(x in path_lower for x in ['test', 'spec', '__tests__']):
            return 'tests'
        elif any(path_lower.endswith(x) for x in ['.json', '.yml', '.yaml', '.toml']):
            return 'config'
        elif any(path_lower.endswith(x) for x in ['.ts', '.tsx', '.js', '.jsx']):
            return 'source'
        elif any(path_lower.endswith(x) for x in ['.css', '.scss']):
            return 'styles'
        else:
            return 'other'
    
    def create_chunks(self) -> None:
        """Organize files into semantic chunks"""
        print("🔨 Creating semantic chunks...")
        
        # Group files by category and path depth
        grouped_files: Dict[str, List[FileChunk]] = {}
        
        for file_chunk in self.files:
            # Create grouping key based on category and top-level path
            if file_chunk.path == "__directory_structure__":
                key = "000_overview"
            else:
                # Extract top-level directory
                path_parts = file_chunk.path.split('/')
                if len(path_parts) > 1:
                    top_dir = path_parts[0]
                    key = f"{file_chunk.category}_{top_dir}"
                else:
                    key = f"{file_chunk.category}_root"
            
            if key not in grouped_files:
                grouped_files[key] = []
            grouped_files[key].append(file_chunk)
        
        # Create chunks from grouped files
        chunk_id = 0
        for group_key, files in sorted(grouped_files.items()):
            current_chunk = []
            current_size = 0
            
            for file_chunk in files:
                # If adding this file exceeds max size, save current chunk
                if current_size + file_chunk.size_chars > self.MAX_CHUNK_SIZE and current_chunk:
                    self._save_chunk(chunk_id, group_key, current_chunk)
                    chunk_id += 1
                    current_chunk = []
                    current_size = 0
                
                current_chunk.append(file_chunk)
                current_size += file_chunk.size_chars
            
            # Save remaining files in group
            if current_chunk:
                self._save_chunk(chunk_id, group_key, current_chunk)
                chunk_id += 1
        
        print(f"✅ Created {len(self.chunks)} chunks")
    
    def _save_chunk(self, chunk_id: int, group_key: str, files: List[FileChunk]) -> None:
        """Save a chunk with metadata"""
        chunk_info = {
            'id': chunk_id,
            'group': group_key,
            'file_count': len(files),
            'total_chars': sum(f.size_chars for f in files),
            'files': [f.path for f in files],
            'categories': list(set(f.category for f in files))
        }
        
        self.chunks.append(chunk_info)
    
    def write_output(self) -> None:
        """Write chunks to organized directory structure"""
        print("💾 Writing output files...")
        
        # Create output directory structure
        chunks_dir = self.output_dir / 'chunks'
        chunks_dir.mkdir(parents=True, exist_ok=True)
        
        # Group chunks by their group key
        grouped_chunks: Dict[str, List[int]] = {}
        for chunk_info in self.chunks:
            group = chunk_info['group']
            if group not in grouped_chunks:
                grouped_chunks[group] = []
            grouped_chunks[group].append(chunk_info['id'])
        
        # Create subdirectories and write chunks
        for group, chunk_ids in grouped_chunks.items():
            group_dir = chunks_dir / group.replace('_', '-')
            group_dir.mkdir(exist_ok=True)
            
            for chunk_id in chunk_ids:
                chunk_info = self.chunks[chunk_id]
                self._write_chunk_file(group_dir, chunk_id, chunk_info)
        
        # Write master index
        self._write_index()
        
        # Write README
        self._write_readme()
        
        print(f"✅ Output written to {self.output_dir}")
    
    def _write_chunk_file(self, group_dir: Path, chunk_id: int, chunk_info: Dict) -> None:
        """Write individual chunk file with content"""
        chunk_file = group_dir / f"chunk_{chunk_id:03d}.md"
        
        # Build chunk content
        lines = [
            f"# Chunk {chunk_id}: {chunk_info['group']}",
            "",
            "## Metadata",
            f"- **Files**: {chunk_info['file_count']}",
            f"- **Size**: {chunk_info['total_chars']:,} characters (~{chunk_info['total_chars']//4:,} tokens)",
            f"- **Categories**: {', '.join(chunk_info['categories'])}",
            "",
            "## Files in this chunk",
            ""
        ]
        
        for file_path in chunk_info['files']:
            lines.append(f"- `{file_path}`")
        
        lines.extend(["", "---", ""])
        
        # Add file contents
        for file_path in chunk_info['files']:
            # Find the file chunk
            file_chunk = next((f for f in self.files if f.path == file_path), None)
            if file_chunk:
                if file_path == "__directory_structure__":
                    lines.extend([
                        "## Directory Structure",
                        "",
                        "```",
                        file_chunk.content,
                        "```",
                        ""
                    ])
                else:
                    # Determine code fence language
                    lang = self._get_language(file_path)
                    
                    lines.extend([
                        f"## File: `{file_path}`",
                        "",
                        f"```{lang}",
                        file_chunk.content,
                        "```",
                        ""
                    ])
        
        chunk_file.write_text('\n'.join(lines), encoding='utf-8')
    
    def _get_language(self, file_path: str) -> str:
        """Determine language identifier for code fences"""
        ext_map = {
            '.ts': 'typescript',
            '.tsx': 'tsx',
            '.js': 'javascript',
            '.jsx': 'jsx',
            '.md': 'markdown',
            '.json': 'json',
            '.yml': 'yaml',
            '.yaml': 'yaml',
            '.css': 'css',
            '.scss': 'scss',
            '.sh': 'bash',
            '.py': 'python',
            '.toml': 'toml',
            '.cjs': 'javascript',
            '.mjs': 'javascript',
        }
        
        for ext, lang in ext_map.items():
            if file_path.endswith(ext):
                return lang
        return ''
    
    def _write_index(self) -> None:
        """Write master index file"""
        index_file = self.output_dir / 'INDEX.json'
        
        index_data = {
            'total_chunks': len(self.chunks),
            'total_files': len(self.files),
            'chunks': self.chunks,
            'groups': {}
        }
        
        # Group statistics
        for chunk_info in self.chunks:
            group = chunk_info['group']
            if group not in index_data['groups']:
                index_data['groups'][group] = {
                    'chunk_count': 0,
                    'file_count': 0,
                    'total_chars': 0
                }
            
            index_data['groups'][group]['chunk_count'] += 1
            index_data['groups'][group]['file_count'] += chunk_info['file_count']
            index_data['groups'][group]['total_chars'] += chunk_info['total_chars']
        
        index_file.write_text(json.dumps(index_data, indent=2), encoding='utf-8')
        
        # Also create markdown index
        self._write_markdown_index(index_data)
    
    def _write_markdown_index(self, index_data: Dict) -> None:
        """Write human-readable markdown index"""
        index_md = self.output_dir / 'INDEX.md'
        
        lines = [
            "# Digest Sharding Index",
            "",
            f"**Total Chunks**: {index_data['total_chunks']}  ",
            f"**Total Files**: {index_data['total_files']}",
            "",
            "## Groups Overview",
            ""
        ]
        
        for group, stats in sorted(index_data['groups'].items()):
            lines.extend([
                f"### {group.replace('_', ' ').title()}",
                "",
                f"- **Chunks**: {stats['chunk_count']}",
                f"- **Files**: {stats['file_count']}",
                f"- **Size**: {stats['total_chars']:,} characters (~{stats['total_chars']//4:,} tokens)",
                f"- **Location**: `chunks/{group.replace('_', '-')}/`",
                ""
            ])
        
        lines.extend([
            "## Chunk Details",
            ""
        ])
        
        for chunk_info in self.chunks:
            group_path = chunk_info['group'].replace('_', '-')
            lines.extend([
                f"### Chunk {chunk_info['id']:03d} - {chunk_info['group']}",
                "",
                f"**Location**: `chunks/{group_path}/chunk_{chunk_info['id']:03d}.md`  ",
                f"**Files**: {chunk_info['file_count']}  ",
                f"**Size**: {chunk_info['total_chars']:,} characters",
                "",
                "<details>",
                "<summary>Files in this chunk</summary>",
                ""
            ])
            
            for file_path in chunk_info['files']:
                lines.append(f"- `{file_path}`")
            
            lines.extend([
                "",
                "</details>",
                ""
            ])
        
        index_md.write_text('\n'.join(lines), encoding='utf-8')
    
    def _write_readme(self) -> None:
        """Write README for the sharded output"""
        readme = self.output_dir / 'README.md'
        
        content = f"""# Sharded Digest Output

This directory contains the intelligently sharded output from `{self.input_file.name}`.

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
3. **Load specific chunks**: Each chunk is optimized for LLM context windows (~6-8K tokens)

### For Analysis

Use `INDEX.json` for programmatic access to chunk metadata.

## Statistics

- **Total Chunks**: {len(self.chunks)}
- **Total Files**: {len(self.files)}
- **Average Chunk Size**: {sum(c['total_chars'] for c in self.chunks) // len(self.chunks):,} characters

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
"""
        
        readme.write_text(content, encoding='utf-8')


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Shard large project digests into LLM-friendly chunks'
    )
    parser.add_argument(
        'input_file',
        type=Path,
        help='Path to the digest file to shard'
    )
    parser.add_argument(
        '-o', '--output',
        type=Path,
        default=Path('./sharded_output'),
        help='Output directory (default: ./sharded_output)'
    )
    
    args = parser.parse_args()
    
    # Validate input
    if not args.input_file.exists():
        print(f"❌ Error: Input file not found: {args.input_file}")
        return 1
    
    print("🚀 Starting digest sharding...")
    print(f"📥 Input: {args.input_file}")
    print(f"📤 Output: {args.output}")
    print()
    
    # Run sharding
    sharding = DigestSharding(args.input_file, args.output)
    sharding.parse_digest()
    sharding.create_chunks()
    sharding.write_output()
    
    print()
    print("✨ Sharding complete!")
    print(f"📊 Created {len(sharding.chunks)} chunks from {len(sharding.files)} files")
    print(f"📂 Output location: {args.output}")
    
    return 0


if __name__ == '__main__':
    exit(main())
