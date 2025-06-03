import { Router } from 'express';

import { createUser, getUsers } from '../../../controllers/user.controller.js';

const router = Router();
// @ts-expect-error
router.get('/users', getUsers);
// @ts-expect-error
router.post('/users/', createUser);

export { router };
