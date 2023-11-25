import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import status from 'http-status';
import User from '../../model/user';
import jwt from 'jsonwebtoken';
const config = require('../../config/app');
import { sendForgotPasswordEmail } from '../../utils/emailSenderV2';
import { logger } from '../../../loaders/logger';
export const index = async (req: Request, res: Response) => {
  res.send(JSON.stringify(req));
};

export const show = async (req: Request, res: Response) => {
  res.send(JSON.stringify(req));
};
  // create
export const store = async (req: Request, res: Response) => {
  res.send(JSON.stringify(req));
};
  
// update
export const update = async (req: Request, res: Response) => {
  res.send(JSON.stringify(req));
};
  
export const destroy = async (req: Request, res: Response) => {
  res.send(JSON.stringify(req));
};
  
export const changePassword = async (req: Request, res: Response) => {
  res.send(JSON.stringify(req));
};

export const forgotPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.sendStatus(status.OK);
    }
    const token = jwt.sign({ email }, config.forgotSecret, {
      expiresIn: '30m',
    });

    await sendForgotPasswordEmail(email, user?.name, token, req.headers.origin ?? '');
    return res.sendStatus(status.OK);
  } catch (e:any) {
    logger.log(e);
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  try {
    const { password, token } = req.body;
    const result:any = await jwt.verify(token, config.forgotSecret);
    const user = await User.findOne({ email:result?.email });
    if (!user) {
      res.status(status.FORBIDDEN).send();
      return;
    }
    user.password = password;
    user.active = true;
    await user.save();
    if (user) return res.send(user);
  } catch (e:any) {
    logger.error(e.message);
    if (e.message === 'jwt expired') {
      res.status(status.INTERNAL_SERVER_ERROR).send('Token expired');
    }
    res.status(status.INTERNAL_SERVER_ERROR).send();
  }
};
