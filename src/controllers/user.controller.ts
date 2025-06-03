import type { NextFunction, Request, Response } from 'express';

import { Users } from '../entities/users.entity.js';
import { UniqueConstraintViolationException } from '@mikro-orm/sqlite';
import type { AppRequestContext } from '../mikro-orm.config.js';
import { validateEmail } from '../utils/validators/email.js';
import { ValidationError } from '../types/errors/common.js';
import { validateString } from '../utils/validators/string.js';

type GetUsersResponse = Response<Omit<Users, 'id'>[] | { message: string }, Record<string, any>>;
export const getUsers = async (
    req: AppRequestContext<void, any>,
    res: GetUsersResponse,
    next: NextFunction,
) => {
    // #swagger.description = 'Get all users'
    /*  #swagger.parameters['created'] = {
        in: 'query',
        description: 'Sort by created_at date (asc or desc)',
        schema: {
            '@enum': ['asc', 'desc']
        }
    } */
    /* #swagger.responses[200] = {
        description: "Returns users array",
        content: {
            "application/json": {
                schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/user" }
                }
            }
        }
    }*/
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
    Record<string, any>
>;
type CreateUserRequest = AppRequestContext<{ id: string }>;
export const createUser = async (
    req: CreateUserRequest,
    res: CreateUserResponse,
    next: NextFunction,
) => {
    // #swagger.description = 'Create a new user'

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User creation form details',
        required: true,
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
            },
            required: ['email', 'name']
        }
    } */
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

                /* #swagger.responses[201] = {
                    description: 'Successfully created the user!',
                    content: {
                        "application/json": {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string' }
                                }
                            }
                        }
                    }
                } */
                return res.status(201).json({ message: 'Successfully created user!' });
            })
            .catch((err: any) => {
                if (err instanceof UniqueConstraintViolationException) {
                    /* #swagger.responses[409] = {
                        description: 'Conflict error',
                        content: {
                            "application/json": {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    } */
                    return res.status(409).json({ message: err.message });
                }

                return next(err);
            });
    } catch (err) {
        if (err instanceof ValidationError) {
            /* #swagger.responses[422] = {
                        description: 'Validation error',
                        content: {
                            "application/json": {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    } */
            return res.status(422).json({ message: err.message });
        } else {
            return next(err);
        }
    }
};
