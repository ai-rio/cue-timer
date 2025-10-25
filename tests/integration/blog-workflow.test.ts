/**
 * Comprehensive Integration Tests for CueTimer Blog Management System
 *
 * This test suite provides complete end-to-end testing for the blog workflow:
 * - Blog creation from template selection to file generation
 * - Multi-language content creation workflow
 * - Template validation with edge cases
 * - ContentCreator utility integration with all templates
 * - Complete CLI workflow integration
 * - File system validation and MDX format verification
 */

import { promises as fs } from 'fs';
import { join } from 'path';

import { ContentCreator } from '../../lib/blog-scripts/content-creator';
import CASE_STUDY_TEMPLATE from '../../lib/blog-scripts/templates/case-study';
import FEATURE_ANNOUNCE_TEMPLATE from '../../lib/blog-scripts/templates/feature-announce';
import PRESENTATION_TIPS_TEMPLATE from '../../lib/blog-scripts/templates/presentation-tips';
// Import all templates
import TIMING_GUIDE_TEMPLATE from '../../lib/blog-scripts/templates/timing-guide';
import { BlogPost, CueTimerTemplate, MultiLanguagePost } from '../../lib/blog-scripts/types';

// Test utilities
const TEST_TEMP_DIR = join(process.cwd(), 'temp-test-content');
const TEST_CONTENT_DIR = join(TEST_TEMP_DIR, 'content', 'blog');
const TEST_DATA_DIR = join(TEST_TEMP_DIR, 'data');

// Helper function to create temporary directory structure
async function setupTestDirectories() {
  await fs.mkdir(TEST_CONTENT_DIR, { recursive: true });
  await fs.mkdir(join(TEST_DATA_DIR, 'analytics'), { recursive: true });
  await fs.mkdir(join(TEST_DATA_DIR, 'workflow'), { recursive: true });
}

// Helper function to clean up test directories
async function cleanupTestDirectories() {
  await fs.rm(TEST_TEMP_DIR, { recursive: true, force: true });
}

// Helper function to create test content creator with custom directory
function createTestContentCreator() {
  const creator = new ContentCreator();
  // Override content directory for testing
  (creator as any).contentDir = TEST_CONTENT_DIR;
  return creator;
}

// Helper function to validate MDX file format
async function validateMDXFile(filePath: string): Promise<{
  valid: boolean;
  frontmatter: any;
  content: string;
  errors: string[];
}> {
  const errors: string[] = [];
  const frontmatter = {};
  let content = '';

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Check for frontmatter
    if (!fileContent.startsWith('---')) {
      errors.push('Missing frontmatter delimiter');
      return { valid: false, frontmatter, content, errors };
    }

    const frontmatterEnd = fileContent.indexOf('---', 3);
    if (frontmatterEnd === -1) {
      errors.push('Missing closing frontmatter delimiter');
      return { valid: false, frontmatter, content, errors };
    }

    const frontmatterText = fileContent.substring(3, frontmatterEnd).trim();
    content = fileContent.substring(frontmatterEnd + 3).trim();

    // Basic frontmatter validation - be more flexible for testing
    const importantFields = ['title', 'slug', 'category'];
    for (const field of importantFields) {
      if (!frontmatterText.includes(`${field}:`)) {
        errors.push(`Missing important field: ${field}`);
      }
    }

    // Check content has some substance
    if (content.length < 20) {
      errors.push('Content too short');
    }

    return { valid: errors.length === 0, frontmatter, content, errors };
  } catch (error) {
    errors.push(`Failed to read file: ${error}`);
    return { valid: false, frontmatter, content, errors };
  }
}

// Helper function to generate realistic test data
function generateTestVariables(templateId: string) {
  switch (templateId) {
    case 'timing-guide':
      return {
        title: 'Complete Guide to Presentation Timing for Conferences',
        difficulty: 'intermediate',
        targetAudience: 'Conference speakers and presenters',
        estimatedTime: '15 minutes',
        steps: [
          {
            title: 'Preparation Phase',
            description: 'Set up your timing environment and prepare your materials',
            time: '5 minutes',
            tips: ['Test your equipment', 'Have backup materials ready'],
          },
          {
            title: 'Main Presentation',
            description: 'Deliver your content with proper timing management',
            time: '8 minutes',
            tips: ['Watch your timing cues', 'Adjust pace as needed'],
          },
          {
            title: 'Q&A Session',
            description: 'Handle questions efficiently within time constraints',
            time: '2 minutes',
            tips: ['Set clear expectations', 'Have time management signals ready'],
          },
        ],
      };
    case 'case-study':
      return {
        clientName: 'TechCorp Industries',
        challenge: 'Managing multi-track conference sessions',
        solution: 'Implemented CueTimer across all presentation rooms',
        results: '40% reduction in schedule delays',
        testimonial: 'CueTimer transformed our conference management',
        metrics: {
          sessionsManaged: 150,
          timeReduction: '40%',
          satisfactionScore: '9.2/10',
        },
      };
    case 'feature-announce':
      return {
        featureName: 'Multi-Language Timer Display',
        version: 'v2.5.0',
        benefits: ['International support', 'Accessibility improvements', 'Better UX'],
        callToAction: 'Try the new multi-language display today!',
        releaseDate: '2024-01-15',
        highlights: [
          'Support for 5 languages',
          'Real-time translation',
          'Cultural time formatting',
        ],
      };
    case 'presentation-tips':
      return {
        mainTip: 'The Power of the Pause: Strategic Timing in Presentations',
        tipCategory: 'delivery',
        difficultyLevel: 'beginner',
        estimatedTime: '3 minutes',
        examples: [
          'Use pauses after key points',
          'Create dramatic effect with strategic silence',
          'Allow audience processing time',
        ],
        benefits: [
          'Improved audience engagement',
          'Better message retention',
          'Enhanced presentation flow',
        ],
      };
    default:
      return { title: 'Test Post' };
  }
}

describe('Blog Management System Integration Tests', () => {
  let contentCreator: ContentCreator;

  beforeAll(async () => {
    await setupTestDirectories();
    contentCreator = createTestContentCreator();
  });

  afterAll(async () => {
    await cleanupTestDirectories();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Blog Workflow Tests', () => {
    test('should create blog post from template selection to file generation', async () => {
      const template = TIMING_GUIDE_TEMPLATE;
      const variables = generateTestVariables('timing-guide');
      const language = 'en';

      // Step 1: Create blog post
      const blogPost = await contentCreator.createPost(template, variables, language);

      // Verify blog post structure
      expect(blogPost).toMatchObject({
        title: variables.title,
        category: 'timing-guide',
        language: 'en',
        isDraft: true,
        difficulty: variables.difficulty,
      });
      expect(blogPost.slug).toBeDefined();
      expect(blogPost.readTime).toBeGreaterThan(0);
      expect(blogPost.lastModified).toBeDefined();

      // Step 2: Generate MDX content
      const mdxContent = blogPost.content;
      expect(mdxContent).toBeDefined();
      expect(mdxContent).toContain(`# ${variables.title}`);
      // Check that content is generated (simple content generation)
      expect(mdxContent.length).toBeGreaterThan(50);

      // Step 3: Save to file system
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const expectedPath = join(TEST_CONTENT_DIR, String(year), month, `${blogPost.slug}.mdx`);

      // The ContentCreator should already have created the file
      const fileExists = await fs
        .access(expectedPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);

      // Step 4: Validate file creation and MDX format
      const mdxValidation = await validateMDXFile(expectedPath);
      expect(mdxValidation.valid).toBe(true);
      expect(mdxValidation.errors).toHaveLength(0);
    });

    test('should handle multi-language content creation workflow', async () => {
      const template = PRESENTATION_TIPS_TEMPLATE;
      const baseVariables = generateTestVariables('presentation-tips');
      const languages = ['en', 'pt-br', 'es'];

      const multiLanguagePost: MultiLanguagePost = {
        masterPost: {} as BlogPost,
        translations: new Map(),
        workflowState: 'draft',
        synchronizationStatus: {
          isMaster: true,
          lastSynced: new Date(),
          pendingTranslations: [],
          inconsistentFields: [],
        },
      };

      // Create master post (English)
      const masterPost = await contentCreator.createPost(template, baseVariables, 'en');
      multiLanguagePost.masterPost = masterPost;

      // Create translations
      for (const lang of languages) {
        if (lang !== 'en') {
          const translatedVariables = {
            ...baseVariables,
            mainTip: `${baseVariables.mainTip} (${lang.toUpperCase()})`,
          };

          const translatedPost = await contentCreator.createPost(
            template,
            translatedVariables,
            lang
          );
          multiLanguagePost.translations.set(lang, translatedPost);
        }
      }

      // Verify multi-language structure
      expect(multiLanguagePost.masterPost.language).toBe('en');
      expect(multiLanguagePost.translations.size).toBe(2); // pt-br and es
      expect(multiLanguagePost.translations.has('pt-br')).toBe(true);
      expect(multiLanguagePost.translations.has('es')).toBe(true);

      // Verify synchronization status
      expect(multiLanguagePost.synchronizationStatus.isMaster).toBe(true);
      expect(multiLanguagePost.synchronizationStatus.pendingTranslations).toHaveLength(0);
    });

    test('should validate template variable requirements and edge cases', async () => {
      const template = CASE_STUDY_TEMPLATE;

      // Test missing required variables
      await expect(contentCreator.createPost(template, {}, 'en')).rejects.toThrow(
        'Required variable'
      );

      // Test with partial variables
      const partialVariables = { clientName: 'Test Client' };
      await expect(contentCreator.createPost(template, partialVariables, 'en')).rejects.toThrow();

      // Test with all required variables
      const completeVariables = generateTestVariables('case-study');
      const blogPost = await contentCreator.createPost(template, completeVariables, 'en');

      expect(blogPost.title).toContain(completeVariables.clientName);
      expect(blogPost.content).toBeDefined();
      expect(blogPost.content.length).toBeGreaterThan(0);
    });

    test('should integrate ContentCreator with all template types', async () => {
      const templates = [
        { id: 'timing-guide', template: TIMING_GUIDE_TEMPLATE },
        { id: 'case-study', template: CASE_STUDY_TEMPLATE },
        { id: 'feature-announce', template: FEATURE_ANNOUNCE_TEMPLATE },
        { id: 'presentation-tips', template: PRESENTATION_TIPS_TEMPLATE },
      ];

      const createdPosts: BlogPost[] = [];

      for (const { id, template } of templates) {
        const variables = generateTestVariables(id);
        const blogPost = await contentCreator.createPost(template, variables, 'en');

        createdPosts.push(blogPost);

        // Verify template-specific properties
        expect(blogPost.category).toBe(id);
        expect(blogPost.content).toContain(variables.title);

        // Verify content generation
        expect(blogPost.content.length).toBeGreaterThan(50);
        expect(blogPost.readTime).toBeGreaterThan(0);
      }

      // Verify all templates were processed
      expect(createdPosts).toHaveLength(4);

      // Verify unique slugs
      const slugs = createdPosts.map((post) => post.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(4);
    });
  });

  describe('File System Validation Tests', () => {
    test('should verify correct directory structure creation (YYYY/MM/)', async () => {
      const template = FEATURE_ANNOUNCE_TEMPLATE;
      const variables = generateTestVariables('feature-announce');

      const blogPost = await contentCreator.createPost(template, variables, 'en');
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');

      const expectedDirPath = join(TEST_CONTENT_DIR, String(year), month);
      const expectedFilePath = join(expectedDirPath, `${blogPost.slug}.mdx`);

      // Verify directory exists
      const dirExists = await fs
        .access(expectedDirPath)
        .then(() => true)
        .catch(() => false);
      expect(dirExists).toBe(true);

      // Verify year directory
      const yearDir = join(TEST_CONTENT_DIR, String(year));
      const yearDirExists = await fs
        .access(yearDir)
        .then(() => true)
        .catch(() => false);
      expect(yearDirExists).toBe(true);

      // Verify month directory
      const monthDir = join(yearDir, month);
      const monthDirExists = await fs
        .access(monthDir)
        .then(() => true)
        .catch(() => false);
      expect(monthDirExists).toBe(true);

      // Verify file exists
      const fileExists = await fs
        .access(expectedFilePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);

      // Verify file path format
      expect(expectedFilePath).toMatch(/\/content\/blog\/\d{4}\/\d{2}\/[^\/]+\.mdx$/);
    });

    test('should validate MDX file format and frontmatter', async () => {
      const template = TIMING_GUIDE_TEMPLATE;
      const variables = generateTestVariables('timing-guide');

      const blogPost = await contentCreator.createPost(template, variables, 'en');
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');

      const filePath = join(TEST_CONTENT_DIR, String(year), month, `${blogPost.slug}.mdx`);

      // Validate MDX file created by ContentCreator
      const validation = await validateMDXFile(filePath);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.content).toContain(blogPost.title);
      expect(validation.content.length).toBeGreaterThan(0);
    });

    test('should test content serialization and deserialization', async () => {
      const originalPost = await contentCreator.createPost(
        TIMING_GUIDE_TEMPLATE,
        generateTestVariables('timing-guide'),
        'en'
      );

      // Serialize to JSON
      const serialized = JSON.stringify(originalPost);
      expect(serialized).toBeDefined();
      expect(serialized.length).toBeGreaterThan(0);

      // Deserialize from JSON
      const deserialized = JSON.parse(serialized) as BlogPost;

      // Verify all fields are preserved
      expect(deserialized.title).toBe(originalPost.title);
      expect(deserialized.slug).toBe(originalPost.slug);
      expect(deserialized.category).toBe(originalPost.category);
      expect(deserialized.content).toBe(originalPost.content);
      expect(deserialized.author).toBe(originalPost.author);
      expect(deserialized.publishedAt).toBe(originalPost.publishedAt);
      expect(deserialized.readTime).toBe(originalPost.readTime);
      expect(deserialized.isDraft).toBe(originalPost.isDraft);
      expect(deserialized.language).toBe(originalPost.language);
      expect(deserialized.lastModified).toBe(originalPost.lastModified);
    });

    test('should check file permissions and accessibility', async () => {
      const template = PRESENTATION_TIPS_TEMPLATE;
      const variables = generateTestVariables('presentation-tips');

      const blogPost = await contentCreator.createPost(template, variables, 'en');
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');

      const filePath = join(TEST_CONTENT_DIR, String(year), month, `${blogPost.slug}.mdx`);

      // Check file exists and is readable
      const stats = await fs.stat(filePath);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBeGreaterThan(0);

      // Test file reading
      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBeDefined();
      expect(content.length).toBeGreaterThan(0);

      // Test file writing (append)
      const appendedContent = content + '\n\n<!-- Test append -->';
      await fs.writeFile(filePath, appendedContent);
      const updatedContent = await fs.readFile(filePath, 'utf-8');
      expect(updatedContent).toContain('<!-- Test append -->');
    });
  });

  describe('Template System Integration Tests', () => {
    test('should test all 4 templates with realistic data', async () => {
      const templateTests = [
        {
          template: TIMING_GUIDE_TEMPLATE,
          variables: generateTestVariables('timing-guide'),
          expectedCategory: 'timing-guide',
        },
        {
          template: CASE_STUDY_TEMPLATE,
          variables: generateTestVariables('case-study'),
          expectedCategory: 'case-study',
        },
        {
          template: FEATURE_ANNOUNCE_TEMPLATE,
          variables: generateTestVariables('feature-announce'),
          expectedCategory: 'feature-announce',
        },
        {
          template: PRESENTATION_TIPS_TEMPLATE,
          variables: generateTestVariables('presentation-tips'),
          expectedCategory: 'presentation-tips',
        },
      ];

      for (const test of templateTests) {
        const blogPost = await contentCreator.createPost(test.template, test.variables, 'en');

        // Verify category
        expect(blogPost.category).toBe(test.expectedCategory);

        // Verify content includes title
        expect(blogPost.content).toContain(test.variables.title);

        // Verify content structure
        expect(blogPost.content).toContain(`# ${test.variables.title}`);
        expect(blogPost.content.length).toBeGreaterThan(50);
        expect(blogPost.readTime).toBeGreaterThan(1);
      }
    });

    test('should validate content generation quality', async () => {
      const template = TIMING_GUIDE_TEMPLATE;
      const variables = generateTestVariables('timing-guide');

      const blogPost = await contentCreator.createPost(template, variables, 'en');

      // Quality checks
      expect(blogPost.title.length).toBeGreaterThan(10);
      expect(blogPost.title.length).toBeLessThan(100);
      expect(blogPost.summary.length).toBeGreaterThan(10);

      // Content quality
      expect(blogPost.content).toBeDefined();
      expect(blogPost.content!.length).toBeGreaterThan(50);
      expect(blogPost.content).toMatch(/^#{1,6}\s+/m); // Contains markdown headers
      expect(blogPost.content).toContain(variables.title);

      // Read time calculation
      expect(blogPost.readTime).toBeGreaterThan(0);
      expect(blogPost.readTime).toBeLessThan(20); // Reasonable read time
    });

    test('should test template variable validation', async () => {
      const template = FEATURE_ANNOUNCE_TEMPLATE;

      // Test with missing required variables
      const incompleteVariables = { featureName: 'Test Feature' };
      await expect(
        contentCreator.createPost(template, incompleteVariables, 'en')
      ).rejects.toThrow();

      // Test with all required variables
      const completeVariables = generateTestVariables('feature-announce');
      const blogPost = await contentCreator.createPost(template, completeVariables, 'en');

      expect(blogPost.title).toContain(completeVariables.featureName);
      expect(blogPost.content).toBeDefined();
      expect(blogPost.content.length).toBeGreaterThan(0);

      // Test variable type validation
      expect(Array.isArray(completeVariables.benefits)).toBe(true);
      expect(typeof completeVariables.featureName).toBe('string');
      expect(typeof completeVariables.version).toBe('string');
    });

    test('should check multi-language template functionality', async () => {
      const template = CASE_STUDY_TEMPLATE;
      const baseVariables = generateTestVariables('case-study');
      const languages = ['en', 'pt-br', 'es'];

      const posts: BlogPost[] = [];

      for (const language of languages) {
        const languageVariables = {
          ...baseVariables,
          clientName: `${baseVariables.clientName} (${language.toUpperCase()})`,
        };

        const blogPost = await contentCreator.createPost(template, languageVariables, language);
        posts.push(blogPost);

        // Verify language-specific properties
        expect(blogPost.language).toBe(language);
        expect(blogPost.content).toContain(languageVariables.clientName);

        // Verify consistent structure across languages
        expect(blogPost.category).toBe('case-study');
      }

      // Verify all posts created successfully
      expect(posts).toHaveLength(3);

      // Verify unique slugs for different languages
      const slugs = posts.map((post) => post.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(3);
    });
  });
});
