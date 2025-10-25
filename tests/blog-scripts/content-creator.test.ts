import { promises as fs } from 'fs';

import { ContentCreator } from '../../lib/blog-scripts/content-creator';

describe('ContentCreator', () => {
  let contentCreator: ContentCreator;

  beforeEach(() => {
    contentCreator = new ContentCreator();
  });

  test('should create blog post from template', async () => {
    const template = {
      id: 'timing-guide',
      name: 'Timing Guide Template',
      category: 'timing-guide' as const,
      languages: ['en', 'pt-br'],
      variables: [
        {
          name: 'title',
          type: 'string' as const,
          required: true,
          description: 'Post title',
        },
        {
          name: 'difficulty',
          type: 'string' as const,
          required: false,
          description: 'Difficulty level',
          defaultValue: 'beginner',
        },
      ],
      contentStructure: [
        {
          id: 'intro',
          title: 'Introduction',
          type: 'paragraph' as const,
          required: true,
          order: 1,
        },
        {
          id: 'steps',
          title: 'Steps',
          type: 'list' as const,
          required: true,
          order: 2,
        },
      ],
    };

    const variables = { title: 'Test Timing Guide', difficulty: 'advanced' };

    const result = await contentCreator.createPost(template, variables, 'en');

    expect(result.slug).toBe('test-timing-guide');
    expect(result.title).toBe('Test Timing Guide');
    expect(result.category).toBe('timing-guide');
    expect(result.difficulty).toBe('advanced');
    expect(result.content).toMatch('# Test Timing Guide');
  });

  test('should validate required template variables', async () => {
    const template = {
      id: 'timing-guide',
      name: 'Timing Guide Template',
      category: 'timing-guide' as const,
      languages: ['en'],
      variables: [
        {
          name: 'title',
          type: 'string' as const,
          required: true,
          description: 'Post title',
        },
      ],
      contentStructure: [],
    };

    await expect(contentCreator.createPost(template, {}, 'en')).rejects.toThrow(
      'Required variable "title" is missing'
    );
  });
});
