

import { Request, Response } from 'express';

export const index = async (req: Request, res: Response) => {
  const fakeData = [
    { 'id':'1', label: 'Ice Skating: Dockland' }, 
    { 'id':'2', label: 'Zoo: Dockland' },
    { 'id':'3', label: 'Boding: ABC' }, 
    { 'id':'4', label: 'KTV: Melbourne' },
  ];
  res.send(fakeData);
};