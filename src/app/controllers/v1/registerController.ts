/* eslint-disable no-console */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import status from 'http-status';
import User from '../../model/user';
import { sendValidateEmail } from '../../utils/emailSenderV2'; 
import jwt from 'jsonwebtoken';
const config = require('../../config/app');
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

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(status.UNPROCESSABLE_ENTITY);
    }

    const user = await User.findOrCreate(req.body);
    if (user.verify) {
      return res.sendStatus(status.CONFLICT);
    }
    const validationToken = jwt.sign({ id: user.id }, config.emailSecret);
    sendValidateEmail(
      user.email,
      `token=${validationToken}`,
      req.headers.origin ?? 'http://localhost:3000',
    );
    user.validationToken = validationToken;
    user.save();
    return res.status(status.CREATED).send(user);
  } catch (e) {
    logger.error(e);
    console.error(e);
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
};


export const verify = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token as string, config.emailSecret) as { id: string };
    const userId = decoded?.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(status.FORBIDDEN).send();
    }
    if (user.verify) {
      res.status(status.BAD_REQUEST).send();
    }
    user.validationToken = '';
    user.verify = true;
    user.isActive = true;
    user.save();
    res.status(status.OK).send();
  } catch (e) {
    logger.error(e);
    console.error(e);
    res.sendStatus(status.FORBIDDEN);
  }
};