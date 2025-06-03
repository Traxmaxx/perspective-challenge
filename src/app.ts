'use strict';

import { RequestContext } from '@mikro-orm/sqlite';
import express from 'express';
// @ts-expect-error Swagger dist is just static files and untyped
import { absolutePath as getSwaggerPath } from 'swagger-ui-dist';

import type { Application, NextFunction, Request, Response } from 'express';

import { router as healthRoutes } from './routes/health.router.js';
import { router as swaggerRouter } from './routes/swagger.router.js';
import apiRoutes from './routes/api/index.js';

import { AppRequestContext, DI } from './mikro-orm.config.js';

const app: Application = express();

// Generic error handler to catch everything not handled already
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }

    return res.status(500).send({ error: err });
}

app.use(express.json());
app.use((req, _, next) => {
    (req as AppRequestContext).DI = DI;
    next();
});

// Test uses a memory instance of the database and we want to connect on demand
if (process.env.NODE_ENV !== 'test') {
    app.use((_, __, next) => {
        if (DI.orm) {
            RequestContext.create(DI.orm.em, next);
        } else {
            console.error('Attention: MikroORM is not attached!');
            next();
        }
    });
}

// #swagger.ignore = true
app.use('/swagger-assets', express.static(getSwaggerPath()));
app.use('/swagger', swaggerRouter);
app.use('/health', healthRoutes);

//////////////////////////////////////////
// ADD NEW API VERSIONS AFTER THIS LINE //
//////////////////////////////////////////
app.use(apiRoutes.v1);

// Generic 404 handler to catch eveything not handled already
app.use((_, res) => {
    res.status(404).json({
        message: 'Nothing here, read the API documentation to find your way back home : )',
    });
});

// @ts-expect-error This error shouldn't happen according to docs
app.use(errorHandler);

export { app };
