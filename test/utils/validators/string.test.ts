import { validateString } from '../../../src/utils/validators/string';
import { ValidationError } from '../../../src/types/errors/common';

describe('validateString', () => {
    it('should return true for a valid non-empty string', () => {
        expect(validateString('hello', 'Username')).toBe(true);
    });

    it('should throw ValidationError for an empty string', () => {
        expect(() => validateString('', 'Username')).toThrow(ValidationError);
        expect(() => validateString('', 'Username')).toThrow('Username cannot be empty or null.');
    });

    it('should throw ValidationError for undefined string', () => {
        expect(() => validateString(undefined, 'Password')).toThrow(ValidationError);
        expect(() => validateString(undefined, 'Password')).toThrow(
            'Password cannot be empty or null.',
        );
    });
});
