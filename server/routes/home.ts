import express, { Request, Response } from 'express';

const homeRouter = express.Router();

homeRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});
export default homeRouter;