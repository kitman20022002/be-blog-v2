import { Request, Response } from 'express';
import {  getConceptByStack, getStacksByCategory } from '../../database/seeders/seedPost';

export const index = async (req: Request, res: Response) => {
  const { category, stack, slug } = req.params;

  const stacks = getStacksByCategory(category);
  if (!stacks) {
    return res.send([]);
  }
  
  return res.send(getConceptByStack(stacks, stack, slug));
};