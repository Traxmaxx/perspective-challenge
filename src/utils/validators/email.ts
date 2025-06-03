import { ValidationError } from '../../types/errors/common.js';

export const validateEmail = (email?: string) => {
    const regex = new RegExp(
        "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])",
    );

    if (!email || email.length < 1) {
        throw new ValidationError('Email cannot be empty or null.');
    }

    if (!regex.test(email)) {
        throw new ValidationError('Email is not a properly formatted email.');
    }

    return true;
};
