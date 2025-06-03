import { validateEmail } from '../../../src/utils/validators/email';
import { ValidationError } from '../../../src/types/errors/common';

describe('validateEmail', () => {
  it('should return true for a valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should throw ValidationError for empty email', () => {
    expect(() => validateEmail('')).toThrow(ValidationError);
    expect(() => validateEmail('')).toThrow('Email cannot be empty or null.');
  });

  it('should throw ValidationError for invalid email format', () => {
    expect(() => validateEmail('not-an-email')).toThrow(ValidationError);
    expect(() => validateEmail('not-an-email')).toThrow('Email is not a properly formatted email.');
  });

  it('should throw ValidationError if email is undefined', () => {
    expect(() => validateEmail(undefined)).toThrow(ValidationError);
    expect(() => validateEmail(undefined)).toThrow('Email cannot be empty or null.');
  });
});