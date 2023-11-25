import { Request, Response } from 'express';
const status = require('http-status');
import User from '../../model/user';

export const index = async (req: Request, res: Response) => {
  res.send(JSON.stringify(req));
};

export const show = async (req: Request, res: Response) => {
  res.send(JSON.stringify(req));
};
  
export const logout = async (req: Request, res: Response) => {
  const user = await User.findById(req.userId);
  if (user?.tokens) {
    user.tokens = []; 
    user.save();
  }
  res.sendStatus(status.OK);
};
  
// update

  