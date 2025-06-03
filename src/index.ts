'use strict';

import cors from 'cors';
import dotenv from 'dotenv';
import { MikroORM } from '@mikro-orm/sqlite';

import config, { DI } from './mikro-orm.config.js';
import { app } from './app.js';

dotenv.config();

const port = process.env.PORT || 3111;

var corsOptions = {
    origin: process.env.CORS_ORIGIN,
};

// Start server
const init = async () => {
    DI.orm = await MikroORM.init(config);

    if (process.env.NODE_ENV === 'production') {
        // Run Migrations on server start in production
        // TODO: this is suboptimal, consider running migrations in a separate process
        await DI.orm.getMigrator().up();
    }

    // Enable CORS
    app.use(cors(corsOptions));

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
};

init().catch((err) => {
    console.error(err);
});
