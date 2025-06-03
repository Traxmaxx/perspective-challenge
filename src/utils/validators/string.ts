import { ValidationError } from '../../types/errors/common.js';

export const validateString = (str?: string, label?: string) => {
    if (!str || str.length < 1) {
        throw new ValidationError(`${label} cannot be empty or null.`);
    }

    return true;
};
