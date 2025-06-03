import request from 'supertest';

import { app } from '../../src/setupTestEnv.js';

describe('Health routes', () => {
    it('Health Check Endpoint', async () => {
        const res = await request(app).get('/health');
        expect(res.text).toEqual('ok');
        expect(res.status).toEqual(200);
    });
});
