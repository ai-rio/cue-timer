import { runBlogInternalLinksCommand } from '../../scripts/blog-internal-links';

describe('blog-internal-links CLI', () => {
  it('should analyze internal linking opportunities', async () => {
    const mockArgs = ['analyze', '--slug', 'test-post', '--limit', '5'];
    const result = await runBlogInternalLinksCommand(mockArgs);

    expect(result.success).toBe(true);
    expect(result.output).toContain('Link Suggestions');
  });

  it('should handle stats command', async () => {
    const mockArgs = ['stats', '--locale', 'en'];
    const result = await runBlogInternalLinksCommand(mockArgs);

    expect(result.success).toBe(true);
    expect(result.output).toContain('Internal Linking Statistics');
  });

  it('should handle errors gracefully', async () => {
    const mockArgs = ['invalid-command'];
    const result = await runBlogInternalLinksCommand(mockArgs);

    expect(result.success).toBe(false);
    expect((result as any).error).toBeDefined();
  });
});
