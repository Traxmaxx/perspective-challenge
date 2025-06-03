import request from 'supertest';

import { DI, app } from '../../src/setupTestEnv';
import { Users } from '../../src/entities/users.entity';

describe('/api/v1/users/ routes', () => {
    let userId: string;
    const mockCreatedAt = new Date();

    beforeEach((doneCallback) => {
        const em = DI.orm.em.fork();

        const user = em.create(Users, {
            name: 'alex controller test 1',
            email: 'alex+testcontroller1@netzok.net',
            updated_at: mockCreatedAt,
        });

        em.persistAndFlush(user).then(() => {
            userId = user.id;
            doneCallback();
        });
    });

    afterEach(async () => {
        const em = DI.orm.em.fork();
        await em.nativeDelete(Users, { id: userId });
    });

    it('should return all users on GET', async () => {
        const res = await request(app).get('/api/v1/users');
        expect(res.status).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should sort all users on GET', async () => {
        const em = DI.orm.em.fork();
        const oneWeekAgo = new Date();
        const twoWeeksAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const user1 = em.create(Users, {
            name: 'alex controller test 2',
            email: 'alex+testcontroller2@netzok.net',
            updated_at: oneWeekAgo,
        });

        await em.persistAndFlush(user1).then(async () => {
            const user2 = em.create(Users, {
                name: 'alex controller test 2',
                email: 'alex+testcontroller3@netzok.net',
                updated_at: twoWeeksAgo,
            });

            await em.persistAndFlush(user2).then(async () => {
                const res = await request(app).get('/api/v1/users?create=desc');
                expect(res.status).toEqual(200);
                expect(res.body.length).toBeGreaterThan(2);
                expect(res.body[0].email).toEqual('alex+testcontroller3@netzok.net');
            });
        });
    });

    it('should create a user when validation passes', async () => {
        const res = await request(app).post(`/api/v1/users`).send({
            name: 'Updated User',
            email: 'fakemail@netzok.net',
        });
        expect(res.status).toEqual(201);
        expect(res.body.message).toEqual('Successfully created user!');
    });

    it('should throw an validation error if the email is invalid', async () => {
        const res = await request(app).post(`/api/v1/users`).send({
            name: 'Updated User',
            email: 'fakemailatnetzok',
        });
        expect(res.status).toEqual(422);
        expect(res.body.message).toEqual('Email is not a properly formatted email.');
    });

    it('should throw an validation error if the email is missing', async () => {
        const res = await request(app).post(`/api/v1/users`).send({
            name: 'Updated User',
            email: undefined,
        });
        expect(res.status).toEqual(422);
        expect(res.body.message).toEqual('Email cannot be empty or null.');
    });

    it('should throw an validation error if the name is missing', async () => {
        const res = await request(app).post(`/api/v1/users`).send({
            email: 'fakemail@netzok.net',
        });
        expect(res.status).toEqual(422);
        expect(res.body.message).toEqual('Name cannot be empty or null.');
    });
});
