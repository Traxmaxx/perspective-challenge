import request from 'supertest';

import { app } from '../src/setupTestEnv.js';

describe('Test app.ts', () => {
    it('Throws 404 on all undefined routes', async () => {
        const res = await request(app)
            .get('/undefined-test-route')
            .set('Authorization', 'Bearer test-api-key');
        expect(res.status).toEqual(404);
    });
});
