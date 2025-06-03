import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.set('Content-Type', 'text/plain');
    res.status(200).send('ok');
});

export { router };
