import { Request, Response } from 'express';
const status = require('http-status');
// const Event = require('../../model/event');
import axios from 'axios';

const nominatimEndpoint = 'https://nominatim.openstreetmap.org/search';

function findPlacesByText(query:string) {
  const header = {
    headers: {
      'accept-language': 'en',
    },
  };
  return axios.get(`${nominatimEndpoint}?q=${encodeURIComponent(query)}&format=json&limit=10&layer=address&addressdetails=1&featureType=city`, header);
}

const getSimplifiedLocations = (locationData: any) => {
  const uniqueLocations = new Set();
  return locationData.filter((item:any) => item.addresstype !== 'municipality').map((result:any) => {
    const { country, state, city = null, village = null, town = null } = result.address;
    const cityOrVillage = city || town || village || null;
    const locationKey = cityOrVillage ? `${cityOrVillage}, ${state}, ${country}` : `${state}, ${country}` ;
    
    if (!uniqueLocations.has(locationKey)) {
      uniqueLocations.add(locationKey);
      return {
        city: cityOrVillage,
        state,
        country,
        lat: result.lat,
        lon: result.lon,
      };
    }
    return null;
  }).filter((location:any) => location !== null);
};


export const index = async (req: Request, res: Response) => {
  const { location  = '' } = req.query;
  if (location === '') {
    return res.sendStatus(status.OK);
  }
  const result = await findPlacesByText(location as string);

  res.send({ data:getSimplifiedLocations(result.data) });
};
  
