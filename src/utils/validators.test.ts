import { describe, it, expect } from 'vitest';
import { formatSlug, isValidSlugLength } from './validators';

describe('Slug Format Validator', () => {
  it('converts uppercase to lowercase', () => {
    expect(formatSlug('Math101')).toBe('math101');
  });

  it('replaces spaces with hyphens', () => {
    expect(formatSlug('grade 10 physics')).toBe('grade-10-physics');
  });

  it('removes special characters but keeps hyphens', () => {
    expect(formatSlug('hello@world! 2026')).toBe('helloworld-2026');
  });

  it('handles multiple consecutive spaces correctly', () => {
    expect(formatSlug('mr   ahmed')).toBe('mr-ahmed');
  });
});

describe('Slug Length Validator', () => {
  it('rejects slugs under 3 characters', () => {
    expect(isValidSlugLength('ab')).toBe(false);
  });

  it('accepts valid slugs', () => {
    expect(isValidSlugLength('abc')).toBe(true);
    expect(isValidSlugLength('math-class')).toBe(true);
  });

  it('rejects slugs over 50 characters', () => {
    const longSlug = 'a'.repeat(51);
    expect(isValidSlugLength(longSlug)).toBe(false);
  });
});
