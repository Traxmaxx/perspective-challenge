// routes/api/v1/index.ts
import { NextFunction, Router, Response, Request } from 'express';
import { router as usersRoutes } from './v1/user.router.js';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { ValidationError } from '../../types/errors/common.js';

const router = Router();

// Generic error handler to catch everything not handled already
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof ValidationError) {
        return res.status(422).json({ message: err.message });
    } else if (err instanceof UniqueConstraintViolationException) {

        return res.status(409).json({ message: err.message });
    }

    return res.status(500).send({ error: err });
}

router.use('/api/v1', 
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
        /* #swagger.responses[500] = {
        description: 'Internal server error',
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
    usersRoutes);

// @ts-expect-error Not sure why the router seems to take an error object but the types says no. Need more time to investigate
router.use(errorHandler);
router.use((req, res, next) => {
    res.status(404).json({
        message: 'Nothing here, read the API documentation to find your way back home : )',
    });
});

export default { v1: router };
