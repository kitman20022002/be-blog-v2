import { Request, Response } from 'express';
import User from '../../model/user';
const status = require('http-status');

export const show = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: 'bookmarkEvents',
    model: Event,
  });
  res.status(status.OK).send(user);
};