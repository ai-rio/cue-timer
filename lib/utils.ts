import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Import TableOfContentsItem type for the utility functions
 */
type TableOfContentsItem = {
  id: string;
  text: string;
  level: number;
  children: TableOfContentsItem[];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Simple dedent function that removes leading whitespace from each line
 */
export function dedent(input: string): string {
  return processSingleString(input);
}

/**
 * Enhanced dedent function that handles MDX frontmatter
 * This function removes leading whitespace from template strings while preserving
 * frontmatter structure and preventing common indentation issues in MDX content.
 */
export function dedentFrontmatter(
  templateStrings: TemplateStringsArray | string,
  ...values: unknown[]
): string {
  // Handle case where function is called with a single string argument
  if (typeof templateStrings === 'string') {
    return processSingleString(templateStrings);
  }

  // Process template string with values
  const raw = templateStrings.raw[0];
  if (!raw) return '';

  const lines = raw.split('\n');

  // Find the line with the least amount of leading whitespace
  // (ignoring empty lines and lines that only contain whitespace)
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  if (nonEmptyLines.length === 0) return raw;

  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => {
      const match = line.match(/^(\s*)/);
      return match?.[1]?.length ?? 0;
    })
  );

  // Remove that amount of whitespace from every line
  const dedentedLines = lines.map((line) => {
    if (line.trim().length === 0) return line; // Keep empty lines as-is
    return line.slice(minIndent);
  });

  const dedented = dedentedLines.join('\n');

  // Insert values if they exist
  if (values.length > 0) {
    const parts = [dedented];
    for (let i = 0; i < values.length; i++) {
      parts.push(String(values[i]), templateStrings.raw[i + 1] || '');
    }
    return parts.join('');
  }

  return dedented;
}

/**
 * Process a single string input
 */
function processSingleString(input: string): string {
  const lines = input.split('\n');
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length === 0) return input;

  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => {
      const match = line.match(/^(\s*)/);
      return match?.[1]?.length ?? 0;
    })
  );

  return lines
    .map((line) => {
      if (line.trim().length === 0) return line;
      return line.slice(minIndent);
    })
    .join('\n');
}

/**
 * Strips the first H1 heading from MDX content to prevent title duplication
 * when the frontmatter title is already being used as the page title.
 */
export function stripFirstH1(content: string): string {
  // Match the first H1 heading at the start of the content or after frontmatter
  const h1Regex = /^(?:---[\s\S]*?---\s*)?#\s+.+$/m;

  // If we find an H1, remove it along with any surrounding whitespace
  return content.replace(h1Regex, '').trim();
}

/**
 * Complete MDX processing function that applies both dedenting and H1 stripping
 */
export function processMdxContent(content: string): string {
  let processedContent = content;

  // First, apply the dedenting logic
  processedContent = dedentFrontmatter(processedContent);

  // Then, strip the first H1 to prevent title duplication
  processedContent = stripFirstH1(processedContent);

  return processedContent;
}

// Alias for processMdxContent for backward compatibility
export const processBlogContent = processMdxContent;

/**
 * Extract headings from MDX content with proper slug generation
 * This function generates heading IDs using the same logic as remark-slug
 */
export function extractHeadingsFromMdx(content: string): TableOfContentsItem[] {
  // Import here to avoid circular dependencies
  // This matches the heading extraction logic but uses slugified IDs
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TableOfContentsItem[] = [];
  const stack: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]?.length || 0;
    const text = match[2]?.trim() || '';

    // Generate slug using the same algorithm as remark-slug
    const id = generateSlug(text);

    const heading: TableOfContentsItem = {
      id,
      text,
      level,
      children: [],
    };

    // Pop items from stack that are at the same level or deeper
    while (stack.length > 0) {
      const lastItem = stack[stack.length - 1];
      if (lastItem && lastItem.level >= level) {
        stack.pop();
      } else {
        break;
      }
    }

    // Add to parent or root
    if (stack.length === 0) {
      headings.push(heading);
    } else {
      const lastItem = stack[stack.length - 1];
      if (lastItem) {
        lastItem.children.push(heading);
      }
    }

    stack.push(heading);
  }

  return headings;
}

/**
 * Generate URL-friendly slug from text (matches remark-slug algorithm)
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}
