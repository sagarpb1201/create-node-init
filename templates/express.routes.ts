import express,{Response,Request,Express,Router} from 'express';

const router:Router = express.Router();

router.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', service: 'healthy' });
});

export default router;