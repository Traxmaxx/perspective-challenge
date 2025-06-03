import { Router, Request, Response } from 'express';
import { getSwaggerUIIndexHTML } from '../swagger-ui.config.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const indexHTML = await getSwaggerUIIndexHTML();
    res.status(200).send(indexHTML);
});

export { router };
