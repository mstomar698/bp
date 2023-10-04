import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export const generateToken = (user: UserPayload): string => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '7d',
    }
  );
};
