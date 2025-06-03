import { Router, Request, Response } from 'express';

const router = Router();

// /health/*
router.get('/', async (req: Request, res: Response) => {
    // #swagger.ignore = true
    res.set('Content-Type', 'text/plain');
    res.status(200).send('ok');
});

export { router };
