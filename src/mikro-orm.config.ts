import { Migrator } from '@mikro-orm/migrations';
import { Options, SqliteDriver, EntityManager, MikroORM, Utils } from '@mikro-orm/sqlite';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import type { Request } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';

export const DI = {} as {
    orm: MikroORM;
    em: EntityManager;
    port?: number;
    server: {
        close: () => void;
    };
};

export type AppRequestContext<
    Params extends ParamsDictionary = ParamsDictionary,
    Body = unknown,
    ResBody = unknown,
    ReqQuery extends Query = Query,
> = Request<Params, ResBody, Body, ReqQuery> & {
    DI: typeof DI;
    /////////////////////////////////////////////////////////////////
    // Add more custom request context properties after this block //
    /////////////////////////////////////////////////////////////////
};

const config: Options = {
    driver: SqliteDriver,
    dbName: process.env.MIKRO_ORM_DB_NAME,
    driverOptions: {
        // connection: { ssl: process.env.NODE_ENV === 'production' }, // uncomment when using postgresql adapter
    },
    // folder-based discovery setup, using common filename suffix
    entities: ['dist/entities/*.entity.js'],
    entitiesTs: ['src/entities/*.entity.ts'],
    migrations: {
        tableName: 'mikro_orm_migrations',
        path: Utils.detectTsNode() ? 'src/migrations' : 'dist/migrations',
        glob: '!(*.d).{js,ts}',
        snapshot: false,
    },
    // I used the ts-morph reflection, an alternative to the default reflect-metadata provider
    // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
    metadataProvider: TsMorphMetadataProvider,
    // enable debug mode to log SQL queries and discovery information
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development' ? console.log.bind(console) : undefined,
    connect: process.env.NODE_ENV !== 'test',
    extensions: [Migrator],
};

export default config;
