import express,{Response,Request,Express} from 'express';

const app:Express = express();

const portFromEnv = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const port = Number.isNaN(portFromEnv) ? 3000 : portFromEnv;

app.use(express.json());

app.get('/', (req:Request, res:Response) => {
    res.json({ 
        message: 'Hello from your new Express.js API!',
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});