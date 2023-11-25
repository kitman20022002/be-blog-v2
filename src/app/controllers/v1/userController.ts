import { Request, Response } from 'express';
const status = require('http-status');
import User from '../../model/user';
const Event = require('../../model/event');
import axios from 'axios';
import { getCountryCodeBy, getStateCodeBy } from '../../utils/countryUtils';

export const index = async (req: Request, res: Response) => {
  res.send(JSON.stringify(req));
};

export const show = async (req: Request, res: Response) => {
  res.send(JSON.stringify(req));
};

export const updateMe = async (req: Request, res: Response) => {
  delete req.body.subscribeEvents;
  delete req.body.bookmarkEvents;
  delete req.body.referrer;
  delete req.body.verify;
  delete req.body.active;
  let updateData = req.body;
  if (req.body.country) {
    updateData = { ...updateData,  country:await getCountryCodeBy(req.body.country),  state:await getStateCodeBy(req.body.state, req.body.country) };
  }

  const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, { new: true }).populate('bookmarkEvents').populate('hobbies');
  res.send(updatedUser);
};

export const destroy = async (req: Request, res: Response) => {
  res.send(JSON.stringify(req));
};

export const showMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.userId).populate({
    path: 'bookmarkEvents',
    model: Event,
  });
  res.status(status.OK).send(user);
};

export const bookmark = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;
  const userId = req.userId;
  User.findByIdAndUpdate(userId, { $addToSet: { bookmarkEvents: eventId } }, { new: true }, async (err:any, updateUser: any) => {
    if (err) {
      res.status(status.INTERNAL_SERVER_ERROR);
    }
    const user = await updateUser.populate({
      path: 'bookmarkEvents',
      model: Event,
    });
    return res.status(status.OK).json(user);
  });
};

export const removeBookmark = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;
  const userId = req.userId;
  User.findByIdAndUpdate(userId, { $pull: { bookmarkEvents: eventId } }, { new: true }, async (err:any, updateUser: any) => {
    if (err) {
      res.status(status.INTERNAL_SERVER_ERROR);
    }
    const user = await updateUser.populate({
      path: 'bookmarkEvents',
      model: Event,
    });
    return res.status(status.OK).json(user);
  });
};


export const updateHobbies = async (req: Request, res: Response) => {
  const { hobbies }  = req.body;
  const user = await User.findById(req.userId);
  user.hobbies = hobbies;
  user.save();
  return res.status(status.OK).json(hobbies);
};

export const updateRange = async (req: Request, res: Response) => {
  const { range }  = req.body;
  const user = await User.findById(req.userId);
  user.preferRange = range;
  user.save();
  return res.sendStatus(status.OK);
};

const nominatimEndpoint = 'https://nominatim.openstreetmap.org/reverse';

const getLocationByGeolocationCoordinates = (lng: number, lat: number) => {
  const header = {
    headers: {
      'accept-language': 'en',
    },
  };
  return axios.get(`${nominatimEndpoint}?format=jsonv2&lat=${lat}&lon=${lng}`, header);

};

export const updateLocations = async (req: Request, res: Response) => {
  const { lng, lat, range }  = req.body.center;
  const user = await User.findById(req.userId);
  const result = await getLocationByGeolocationCoordinates(lng, lat);
  const { country, state, city = null, village = null, town = null } = result.data.address;
  const cityOrVillage = city || town || village || null;
  user.country = await getCountryCodeBy(country);
  user.state = await getStateCodeBy(state, country);
  user.city = cityOrVillage;
  user.preferRange = range;
  user.preferLng = lng;
  user.preferLat = lat;
  user.save();
  return res.status(status.OK).json(user);
};
