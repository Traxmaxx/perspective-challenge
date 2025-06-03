import { Router } from 'express';

import { createUser, getUsers } from '../../../controllers/user.controller.js';

const router = Router();

router.get('/users', 
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
    // @ts-expect-error TS cannot infer the type properly
    getUsers);

router.post('/users',
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
    // @ts-expect-error TS cannot infer the type properly
    createUser);

export { router };
