import type { NextFunction, Response } from 'express';

import { Users } from '../entities/users.entity.js';
import type { AppRequestContext } from '../mikro-orm.config.js';
import { validateEmail } from '../utils/validators/email.js';
import { validateString } from '../utils/validators/string.js';

type GetUsersResponse = Response<
    Omit<Users, 'id'>[] | { message: string },
    Record<string, unknown>
>;
export const getUsers = async (
    req: AppRequestContext<{}, unknown>,
    res: GetUsersResponse,
    next: NextFunction,
) => {
    try {
        const sort = req.query?.created === 'asc' ? 'asc' : 'desc';

        const users = await req.DI.orm.em.find(
            Users,
            {},
            {
                orderBy: {
                    created_at: sort,
                },
            },
        );

        return res.json(users);
    } catch (err) {
        return next(err);
    }
};

type CreateUserResponse = Response<
    Omit<Users, 'created_at' | 'updated_at' | 'id'> | { message: string },
    Record<string, unknown>
>;

interface CreateUserBody {
    name: string;
    email: string;
}

type CreateUserRequest = AppRequestContext<{}, CreateUserBody>;
export const createUser = async (
    req: CreateUserRequest,
    res: CreateUserResponse,
    next: NextFunction,
) => {
    try {
        validateEmail(req.body?.email);
        validateString(req.body?.name, 'Name');

        const user = req.DI.orm.em.create(Users, {
            name: req.body.name,
            email: req.body.email.trim(),
        });

        req.DI.orm.em
            .persistAndFlush(user)
            .then(() => {
                // TODO: Maybe send an email confirmation here?
                return res.status(201).json({ message: 'Successfully created user!' });
            })
            .catch((err: unknown) => {
                return next(err);
            });
    } catch (err) {
        return next(err);
    }
};
