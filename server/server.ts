import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import homeRouter from './routes/home';
import userRouter from './routes/user';
import authRouter from './routes/auth';
import profileRouter from './routes/profile';
import booksRouter from './routes/books';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('connected to DB');
  })
  .catch((err: Error) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      'http://localhost:3000',
    ],
    credentials: true,
  })
);

app.use('/', homeRouter);
app.use('/api/users', userRouter);
app.use('/auth', authRouter);
app.use('/user', profileRouter);
app.use('/api/books', booksRouter);

app.use((err: Error, req: Request, res: Response, next: Function) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`serving at http://localhost:${port}`);
});