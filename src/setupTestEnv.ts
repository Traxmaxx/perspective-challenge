import dotenv from 'dotenv';
import http from 'http';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';

import { app } from './app.js';
import config, { DI as appDI } from './mikro-orm.config.js';

dotenv.config({ path: '.env.test' });

const DI = appDI;

const getAvailablePort = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        const server = http.createServer();
        server.listen(0, () => {
            const port = (server.address() as any).port;
            server.close(() => {
                resolve(port);
            });
        });
        server.on('error', reject);
    });
};

beforeAll((doneCallback) => {
    MikroORM.init({
        ...config,
        connect: false,
        debug: false,
    }).then((orm) => {
        DI.orm = orm;
        // Create the schema
        DI.orm.em = DI.orm.em.fork();
        DI.orm
            .getSchemaGenerator()
            .createSchema()
            .then(() => {
                getAvailablePort().then((port) => {
                    DI.port = port;
                    DI.server = app.listen(DI.port, () => {
                        console.log(
                            `[server]: Server is running at http://localhost:${DI.port} in ${process.env.NODE_ENV}`,
                        );
                    });
                    doneCallback();
                });
            });
    });
});

beforeEach(() => {
    RequestContext.create(DI.orm.em, () => {});
});

afterEach(() => {
    RequestContext.getEntityManager()?.clear();
});

afterAll(async () => {
    await DI.orm.getSchemaGenerator().dropSchema();
    await DI.server.close();
    await DI.orm.close(true);
});

export { app, DI };
