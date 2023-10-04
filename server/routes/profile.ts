import express, { Request, Response } from 'express';
import { generateToken, isAuth } from '../utils';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';

const profileRouter = express.Router();

profileRouter.put('/profile', isAuth, async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

export default profileRouter;