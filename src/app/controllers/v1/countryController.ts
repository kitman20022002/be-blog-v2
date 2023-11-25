/* eslint-disable no-secrets/no-secrets */
import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/helper';
import axios from 'axios';
import status from 'http-status';

export const index = asyncHandler(async (req: Request, res: Response) => {
  const result = await axios.get(
    'http://api.geonames.org/countryInfoJSON?username=kitman200220022002',
  );
  res.status(status.OK).send({ data: result.data });
});


export const states = asyncHandler(async (req: Request, res: Response) => {
  const { geonameId } = req.query;
  const result = await axios.get(
    `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=kitman200220022002`,
  );
  res.status(status.OK).send({ data: result.data });
});