#!/bin/bash
# Quick-start script for digest sharding in WSL

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Digest Sharding Tool${NC}"
echo ""

# Check for input file argument
if [ $# -eq 0 ]; then
    echo -e "${RED}❌ Error: No input file specified${NC}"
    echo ""
    echo "Usage:"
    echo "  ./run.sh <digest_file> [output_directory]"
    echo ""
    echo "Examples:"
    echo "  ./run.sh digest.txt"
    echo "  ./run.sh /mnt/c/Users/YourName/digest.txt ./output"
    echo ""
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_DIR="${2:-./sharded_output}"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${RED}❌ Error: File not found: $INPUT_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}📥 Input file:${NC} $INPUT_FILE"
echo -e "${GREEN}📤 Output directory:${NC} $OUTPUT_DIR"
echo ""

# Run the sharding tool (using Python directly - no dependencies needed!)
echo -e "${BLUE}🔨 Starting sharding process...${NC}"
echo ""

python3 shard_digest.py "$INPUT_FILE" -o "$OUTPUT_DIR"

echo ""
echo -e "${GREEN}✨ Done!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Open: $OUTPUT_DIR/README.md"
echo "  2. Check: $OUTPUT_DIR/INDEX.md for chunk navigation"
echo "  3. Start with: $OUTPUT_DIR/chunks/000-overview/chunk_000.md"
echo ""
