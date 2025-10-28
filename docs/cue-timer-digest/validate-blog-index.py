#!/usr/bin/env python3
"""
Blog Index Validation Script

Validates the BLOG-INDEX.json file for:
- Correct chunk file mapping
- Accessibility of referenced files
- Completeness of blog system coverage
- LLM-friendly navigation structure
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any

def load_blog_index() -> Dict[str, Any]:
    """Load the blog index JSON file"""
    try:
        with open('BLOG-INDEX.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ ERROR: BLOG-INDEX.json not found")
        return {}
    except json.JSONDecodeError as e:
        print(f"❌ ERROR: Invalid JSON in BLOG-INDEX.json: {e}")
        return {}

def validate_chunk_file_mapping(index: Dict[str, Any]) -> bool:
    """Validate that all chunk file mappings exist"""
    print("\n🔍 Validating chunk file mappings...")
    mapping = index.get('chunk_file_mapping', {})
    missing_files = []

    for chunk_id, file_path in mapping.items():
        full_path = Path(file_path)
        if not full_path.exists():
            missing_files.append(f"Chunk {chunk_id}: {file_path}")

    if missing_files:
        print(f"❌ Found {len(missing_files)} missing chunk files:")
        for missing in missing_files:
            print(f"   - {missing}")
        return False
    else:
        print(f"✅ All {len(mapping)} chunk file mappings are valid")
        return True

def validate_quick_navigation(index: Dict[str, Any]) -> bool:
    """Validate quick navigation structure"""
    print("\n🧭 Validating quick navigation structure...")

    quick_nav = index.get('quick_navigation', {})
    if not quick_nav:
        print("❌ ERROR: No quick_navigation section found")
        return False

    # Check common tasks
    common_tasks = quick_nav.get('common_tasks', {})
    if not common_tasks:
        print("❌ ERROR: No common_tasks found in quick_navigation")
        return False

    required_tasks = ['create_blog_post', 'implement_blog_search', 'add_blog_component', 'debug_blog_issue']
    missing_tasks = [task for task in required_tasks if task not in common_tasks]

    if missing_tasks:
        print(f"❌ Missing common tasks: {missing_tasks}")
        return False

    # Check component categories
    comp_categories = quick_nav.get('component_categories', {})
    if not comp_categories:
        print("❌ ERROR: No component_categories found in quick_navigation")
        return False

    print(f"✅ Quick navigation structure is valid with {len(common_tasks)} tasks and {len(comp_categories)} categories")
    return True

def validate_file_patterns(index: Dict[str, Any]) -> bool:
    """Validate file patterns structure"""
    print("\n📁 Validating file patterns...")

    file_patterns = index.get('quick_navigation', {}).get('file_patterns', {})
    if not file_patterns:
        print("❌ ERROR: No file_patterns found")
        return False

    required_patterns = [
        'blog_pages',
        'blog_components',
        'blog_utilities',
        'blog_scripts',
        'blog_types',
        'blog_content',
        'blog_tests'
    ]

    missing_patterns = [pattern for pattern in required_patterns if pattern not in file_patterns]

    if missing_patterns:
        print(f"❌ Missing file patterns: {missing_patterns}")
        return False

    print(f"✅ All {len(required_patterns)} file patterns are defined")
    return True

def validate_categories_structure(index: Dict[str, Any]) -> bool:
    """Validate the main categories structure"""
    print("\n📂 Validating categories structure...")

    categories = index.get('categories', {})
    if not categories:
        print("❌ ERROR: No categories section found")
        return False

    required_main_categories = [
        'pages', 'components', 'content', 'localization',
        'documentation', 'library_code', 'scripts', 'testing'
    ]

    missing_categories = [cat for cat in required_main_categories if cat not in categories]

    if missing_categories:
        print(f"❌ Missing main categories: {missing_categories}")
        return False

    # Check components subcategories
    components_subcats = categories.get('components', {}).get('subcategories', {})
    required_component_subcats = [
        'search_and_filtering', 'content_rendering', 'content_display',
        'blog_layouts', 'blog_features'
    ]

    missing_subcats = [subcat for subcat in required_component_subcats if subcat not in components_subcats]

    if missing_subcats:
        print(f"❌ Missing component subcategories: {missing_subcats}")
        return False

    print(f"✅ Categories structure is valid with {len(categories)} main categories")
    return True

def count_blog_files(index: Dict[str, Any]) -> Dict[str, int]:
    """Count blog files by category"""
    print("\n📊 Counting blog files by category...")

    categories = index.get('categories', {})
    file_counts = {}

    for main_cat_name, main_cat_data in categories.items():
        if main_cat_name == 'components':
            # Special handling for components subcategories
            subcats = main_cat_data.get('subcategories', {})
            for subcat_name, subcat_data in subcats.items():
                chunk_count = len(subcat_data.get('chunks', []))
                file_count = sum(len(chunk.get('files', [])) for chunk in subcat_data.get('chunks', []))
                file_counts[f"{main_cat_name}.{subcat_name}"] = file_count
        else:
            # Regular categories
            if 'chunks' in main_cat_data:
                chunk_count = len(main_cat_data['chunks'])
                file_count = sum(len(chunk.get('files', [])) for chunk in main_cat_data['chunks'])
                file_counts[main_cat_name] = file_count
            elif isinstance(main_cat_data, dict) and 'subcategories' in main_cat_data:
                # Handle categories with subcategories like documentation
                for subcat_name, subcat_data in main_cat_data['subcategories'].items():
                    chunk_count = len(subcat_data.get('chunks', []))
                    file_count = sum(len(chunk.get('files', [])) for chunk in subcat_data.get('chunks', []))
                    file_counts[f"{main_cat_name}.{subcat_name}"] = file_count

    total_files = sum(file_counts.values())
    print(f"📈 Total blog files: {total_files}")

    for category, count in sorted(file_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"   - {category}: {count} files")

    return file_counts

def validate_llm_friendly_features(index: Dict[str, Any]) -> bool:
    """Validate LLM-friendly navigation features"""
    print("\n🤖 Validating LLM-friendly features...")

    required_features = [
        'quick_navigation',
        'chunk_file_mapping',
        'categories',
        'total_blog_chunks',
        'total_blog_files'
    ]

    missing_features = [feature for feature in required_features if feature not in index]

    if missing_features:
        print(f"❌ Missing LLM-friendly features: {missing_features}")
        return False

    # Check for descriptions in chunks
    categories = index.get('categories', {})
    chunks_with_descriptions = 0
    total_chunks = 0

    for main_cat_data in categories.values():
        if 'chunks' in main_cat_data:
            for chunk in main_cat_data['chunks']:
                total_chunks += 1
                if 'description' in chunk:
                    chunks_with_descriptions += 1
        elif isinstance(main_cat_data, dict) and 'subcategories' in main_cat_data:
            for subcat_data in main_cat_data['subcategories'].values():
                for chunk in subcat_data.get('chunks', []):
                    total_chunks += 1
                    if 'description' in chunk:
                        chunks_with_descriptions += 1

    description_coverage = (chunks_with_descriptions / total_chunks * 100) if total_chunks > 0 else 0
    print(f"✅ Chunk description coverage: {description_coverage:.1f}%")

    return description_coverage > 80  # Require at least 80% coverage

def generate_summary_report(index: Dict[str, Any], file_counts: Dict[str, int]) -> None:
    """Generate a summary report"""
    print("\n📋 BLOG INDEX VALIDATION SUMMARY")
    print("=" * 50)

    print(f"📊 Total Blog Chunks: {index.get('total_blog_chunks', 'N/A')}")
    print(f"📁 Total Blog Files: {index.get('total_blog_files', 'N/A')}")
    print(f"📅 Last Updated: {index.get('last_updated', 'N/A')}")
    print(f"📝 Version: {index.get('version', 'N/A')}")

    # Top categories by file count
    print(f"\n🏆 Top Categories by File Count:")
    for category, count in sorted(file_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"   {category}: {count}")

    # Quick navigation summary
    quick_nav = index.get('quick_navigation', {})
    common_tasks = quick_nav.get('common_tasks', {})
    print(f"\n🎯 Quick Navigation Tasks: {len(common_tasks)}")
    for task_name, task_data in common_tasks.items():
        chunks = len(task_data.get('relevant_chunks', []))
        print(f"   - {task_name}: {chunks} relevant chunks")

    print(f"\n✅ BLOG-INDEX.json is ready for LLM navigation!")

def main():
    """Main validation function"""
    print("🔍 VALIDATING BLOG-INDEX.json")
    print("=" * 50)

    # Load the index
    index = load_blog_index()
    if not index:
        return False

    # Run validations
    validations = [
        validate_chunk_file_mapping(index),
        validate_quick_navigation(index),
        validate_file_patterns(index),
        validate_categories_structure(index),
        validate_llm_friendly_features(index)
    ]

    # Count files
    file_counts = count_blog_files(index)

    # Generate summary
    if all(validations):
        generate_summary_report(index, file_counts)
        return True
    else:
        print(f"\n❌ VALIDATION FAILED: {sum(validations)}/{len(validations)} checks passed")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)