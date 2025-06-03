import { Migrator } from '@mikro-orm/migrations';
import { Options, SqliteDriver, EntityManager, MikroORM, Utils } from '@mikro-orm/sqlite';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import type { Request } from 'express';

export const DI = {} as {
    orm: MikroORM;
    em: EntityManager;
    port?: any;
    server?: any;
};

export type AppRequestContext<Params = any, Body = any> = Request<Params, any, Body | any> & {
    DI: typeof DI;
    // Add custom request context properties here
};

const config: Options = {
    driver: SqliteDriver,
    dbName: process.env.MIKRO_ORM_DB_NAME,
    driverOptions: {
        connection: { ssl: process.env.NODE_ENV === 'production' },
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
    // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
    // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
    metadataProvider: TsMorphMetadataProvider,
    // enable debug mode to log SQL queries and discovery information
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development' ? console.log.bind(console) : undefined,
    connect: process.env.NODE_ENV !== 'test',
    extensions: [Migrator],
};

export default config;
