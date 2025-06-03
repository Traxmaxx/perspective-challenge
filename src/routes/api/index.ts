// routes/api/v1/index.ts
import { Router } from 'express';
import { router as usersRoutes } from './v1/user.router.js';

const router = Router();

router.use('/api/v1', usersRoutes);

export default { v1: router };
