import express, { Request, Response } from 'express';
import { generateToken } from '../utils';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';

const authRouter = express.Router();

authRouter.get('/', (req: Request, res: Response) => {
  res.send('Hello, Auth Pages!');
});

authRouter.post('/signin', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server Error' });
  }
});

authRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).send({ message: 'Error creating user' });
  }
});

export default authRouter;