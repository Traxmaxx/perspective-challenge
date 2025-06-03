import { Router } from 'express';

import { createUser, getUsers } from '../../../controllers/user.controller.js';

const router = Router();
// @ts-expect-error TS cannot infer the type properly
router.get('/users', getUsers);
// @ts-expect-error TS cannot infer the type properly
router.post('/users/', createUser);

export { router };
