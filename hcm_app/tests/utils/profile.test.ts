import { describe, expect, it } from 'vitest';

import { getDisplayName } from '../../src/utils/profile';

describe('getDisplayName', () => {
  it('should use nickname and last name if includeLastName is true and nickname is present', () => {
    const user = { first_name: 'John', last_name: 'Doe', nickname: 'Johnny' };
    const result = getDisplayName(user, true);
    expect(result).toBe('Johnny Doe');
  });

  it('should use only nickname if includeLastName is false and nickname is present', () => {
    const user = { first_name: 'John', last_name: 'Doe', nickname: 'Johnny' };
    const result = getDisplayName(user, false);
    expect(result).toBe('Johnny');
  });

  it('should use first name and last name if nickname is not present and includeLastName is true', () => {
    const user = { first_name: 'Jane', last_name: 'Smith' };
    const result = getDisplayName(user, true);
    expect(result).toBe('Jane Smith');
  });

  it('should use only first name if nickname is not present and includeLastName is false', () => {
    const user = { first_name: 'Jane', last_name: 'Smith' };
    const result = getDisplayName(user, false);
    expect(result).toBe('Jane');
  });

  it('should handle empty or whitespace-only strings appropriately', () => {
    const user = { first_name: '  ', last_name: 'Doe', nickname: '' };
    const result = getDisplayName(user, true);
    expect(result).toBe('Doe');
  });
});
