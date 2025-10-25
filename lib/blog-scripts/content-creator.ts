import { promises as fs } from 'fs';
import { join } from 'path';
import { z } from 'zod';

import { CueTimerTemplate } from './types';

const BlogPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.enum(['timing-guide', 'case-study', 'feature-announce', 'presentation-tips']),
  summary: z.string(),
  author: z.string(),
  publishedAt: z.string(),
  readTime: z.number(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isDraft: z.boolean().default(true),
  difficulty: z.string().optional(),
  language: z.string().default('en'),
  lastModified: z.string().default(new Date().toISOString()),
  content: z.string(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

export class ContentCreator {
  private contentDir: string;
  private templatesDir: string;

  constructor() {
    this.contentDir = join(process.cwd(), 'content', 'blog');
    this.templatesDir = join(__dirname, 'templates');
  }

  async createPost(
    template: CueTimerTemplate,
    variables: Record<string, string | number | boolean | string[]>,
    language: string = 'en'
  ): Promise<BlogPost> {
    // Validate required variables
    this.validateTemplateVariables(template, variables);

    // Generate post data
    const postData = this.generatePostData(template, variables, language);

    // Create file path
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const fileName = `${postData.slug}.mdx`;
    const filePath = join(this.contentDir, year.toString(), month, fileName);

    // Ensure directory exists
    await fs.mkdir(join(this.contentDir, year.toString(), month), {
      recursive: true,
    });

    // Write file
    const content = this.serializePost(postData);
    await fs.writeFile(filePath, content, 'utf-8');

    return postData;
  }

  private validateTemplateVariables(
    template: CueTimerTemplate,
    variables: Record<string, string | number | boolean | string[]>
  ): void {
    for (const variable of template.variables) {
      if (variable.required && !variables[variable.name]) {
        throw new Error(`Required variable "${variable.name}" is missing`);
      }
    }
  }

  private generatePostData(
    template: CueTimerTemplate,
    variables: Record<string, string | number | boolean | string[]>,
    language: string
  ): BlogPost {
    const title = variables.title || 'Untitled Post';
    const slug = this.generateSlug(title, language);

    const postData: Partial<BlogPost> & Record<string, string | number | boolean | string[]> = {
      title,
      slug,
      category: template.category,
      summary:
        variables.summary ||
        `A ${template.category.replace('-', ' ')} about ${title.toLowerCase()}`,
      author: variables.author || 'CueTimer Team',
      publishedAt: variables.publishedAt || new Date().toISOString(),
      readTime: this.estimateReadingTime(variables.content || ''),
      isDraft: variables.isDraft !== false,
      language,
      lastModified: new Date().toISOString(),
      content: variables.content || `# ${title}\n\nThis is a blog post about ${title}.`,
      ...variables,
    };

    return BlogPostSchema.parse(postData);
  }

  private generateSlug(title: string, language: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    return language !== 'en' ? `${slug}-${language}` : slug;
  }

  private estimateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  private serializePost(post: BlogPost): string {
    const frontmatter = { ...post };
    delete (frontmatter as BlogPost & { content?: string }).content;

    const frontmatterYaml = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map((v) => `"${v}"`).join(', ')}]`;
        }
        return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`;
      })
      .join('\n');

    const content = post.content || `# ${post.title}\n\nThis is a blog post about ${post.title}.`;

    return `---\n${frontmatterYaml}\n---\n\n${content}`;
  }

  async validateContent(post: BlogPost): Promise<{ valid: boolean; errors: string[] }> {
    try {
      BlogPostSchema.parse(post);
      return { valid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        };
      }
      return { valid: false, errors: ['Unknown validation error'] };
    }
  }
}
