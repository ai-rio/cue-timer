import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Remove leading whitespace from each line of a string.
 * Useful for dedenting template literals and fixing indented frontmatter.
 *
 * @param str - The string to dedent
 * @returns The dedented string
 */
export function dedent(str: string): string {
  // Split into lines and find the minimum indentation (excluding empty lines)
  const lines = str.split('\n');
  const nonEmptyLines = lines.filter((line) => line.trim() !== '');

  if (nonEmptyLines.length === 0) {
    return str;
  }

  // Find the minimum indentation
  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => {
      const match = line.match(/^(\s*)/);
      return match?.[1]?.length || 0;
    })
  );

  // Remove the minimum indentation from each line
  return lines
    .map((line) => {
      if (line.trim() === '') {
        return line; // Preserve empty lines
      }
      return line.slice(minIndent);
    })
    .join('\n');
}

/**
 * Specific utility to dedent frontmatter blocks in MDX content.
 * Only dedents the content between the --- delimiters.
 *
 * @param content - The MDX content to process
 * @returns The content with dedented frontmatter
 */
export function dedentFrontmatter(content: string): string {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (frontmatterMatch && frontmatterMatch[1]) {
    const frontmatter = frontmatterMatch[1];
    const dedentedFrontmatter = dedent(frontmatter);

    return content.replace(/^---\n[\s\S]*?\n---/, `---\n${dedentedFrontmatter}\n---`);
  }

  return content;
}
