import { Request, Response } from 'express';

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
  