import express, { Request, Response } from 'express';
import { isAdmin, isAuth } from '../utils';
import User from '../models/userModel';

const userRouter = express.Router();

userRouter.get('/', isAuth, isAdmin, async (req: Request, res: Response) => {
  const users = await User.find({});
  res.send(users);
});

userRouter.get('/:id', isAuth, isAdmin, async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

userRouter.put('/:id', isAuth, isAdmin, async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    const updatedUser = await user.save();
    res.send({ message: 'User Updated', user: updatedUser });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'user1@user.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await User.deleteOne({ _id: req.params.id });
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }
);

export default userRouter;