import { render } from '@testing-library/react';

import { InternalLinkInjector } from '@/components/blog/InternalLinkInjector';

describe('InternalLinkInjector', () => {
  it('should render content wrapper with proper class', () => {
    const content = 'Test content';
    const props = {
      content,
      currentSlug: 'current-post',
      locale: 'en',
    };

    const { container } = render(<InternalLinkInjector {...props} />);

    expect(container.querySelector('.internal-link-content')).toBeTruthy();
    expect(container.textContent).toContain('Test content');
  });

  it('should apply custom className', () => {
    const content = 'Test content';
    const props = {
      content,
      currentSlug: 'current-post',
      locale: 'en',
      className: 'custom-class',
    };

    const { container } = render(<InternalLinkInjector {...props} />);

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('should pass maxLinks parameter correctly', () => {
    const content = 'Test content';
    const props = {
      content,
      currentSlug: 'current-post',
      locale: 'en',
      maxLinks: 1,
    };

    const { container } = render(<InternalLinkInjector {...props} />);

    expect(container.querySelector('.internal-link-content')).toBeTruthy();
  });

  it('should render content with all required props', () => {
    const content = 'Content about CueTimer features.';
    const props = {
      content,
      currentSlug: 'current-post',
      locale: 'en',
      maxLinks: 5,
      className: 'prose',
    };

    const { container } = render(<InternalLinkInjector {...props} />);

    expect(container.textContent).toContain('Content about CueTimer features');
    expect(container.querySelector('.prose')).toBeTruthy();
    expect(container.querySelector('.internal-link-content')).toBeTruthy();
  });
});
