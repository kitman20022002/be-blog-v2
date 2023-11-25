/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/helper';

const status = require('http-status');
const Event = require('../../model/event');
const { addDays, startOfWeek } = require('date-fns');
import User from '../../model/user';
import EventTemplate from '../../model/eventTemplate';
import { getRandomTimeInBetweenRange } from '../../utils/timeUtils';
import mongoose from 'mongoose';


const getUpcomingSaturday = () =>  {
  const today = new Date();
  let daysUntilSaturday = 6 - (today.getDay() % 7) + 7; // Calculate the number of days until the next Saturday
  const nextSaturday = startOfWeek(addDays(today, daysUntilSaturday));
  return nextSaturday;
};

const getUserInterests = (user: any, interests: string[] | undefined = undefined) => {
  return interests ? interests : user.hobbies.map((item:any) => item.label);
};

const getRandomUserDate = (user: any, date: Date | undefined = undefined) => {
  const defaultTime = {  'Saturday': ['14:00-20:00'], 'Sunday': ['14:00-20:00'] };
  if (!date) {
    const jsonInput = JSON.parse(user?.preferTime) || defaultTime;
    return getRandomTimeInBetweenRange(jsonInput);
  }
  return date;
};

const getMinAge = (user: any, minA: any = undefined) => {
  return !minA ? user.age - 5 : minA;
};

const getMaxAge = (user: any, maxA: any = undefined) =>{ 
  return !maxA ? user.age + 5 :  maxA;
};

const getCountry = (user: any, defaultCountry: string  | undefined = undefined) => {
  return !defaultCountry ? user.country : defaultCountry;
};

const getState = (user: any, defaultState: string  | undefined = undefined) => {
  return !defaultState ? user.state : defaultState;
};

const getUserHobbies = (user:any) => {
  return !user ? [] : user.hobbies;
};

interface BaseQuery {
  country: any;
  state: any;
  hobby?: any; // This allows additional string-keyed properties of any type
}

const hackLogic2 = async (userId:string | undefined, minAge: number, maxAge: number, country:any, state:any) =>{

  if (!userId) {
    return;
  }
  const user = await User.findById(userId).exec();
  const minimalAge = getMinAge(user, minAge);
  const maximalAge = getMaxAge(user, maxAge);
  const defaultCountry = getCountry(user, country);
  const defaultState = getState(user, state);
  const userHobbies = getUserHobbies(user);

  const baseQuery:BaseQuery = { country: defaultCountry, state: defaultState  };
  if (userHobbies.length > 0) {
    baseQuery.hobby =  { $in : userHobbies };
  }

  const eventTemp = await EventTemplate.find(baseQuery);
  if (eventTemp.length === 0) {
    return [];
  }
  //Search event template based on hobby and location 
  //If not event comes up 
  //Then random grab 5
  //create 5 of them
  const events = [];
  for (let i = 0; i < eventTemp.length ; i++) {
    if (!eventTemp[i]?.hobby || !mongoose.Types.ObjectId.isValid(eventTemp[i].hobby)) {
      continue;
    }
    const event = await new Event({
      hobby: eventTemp[i]?.hobby?.toString(), 
      time: getRandomUserDate(user),
      title:eventTemp[i].title, 
      description: eventTemp[i].description,    
      minAge: minimalAge, 
      maxAge: maximalAge, 
      state: defaultState,
      country: defaultCountry, 
      repeatFrequency: 'Once',
      lat: eventTemp[i].lat, 
      lng: eventTemp[i].lng,
    });
    events.push(event);
  }
  // Event.insertMany(events);
  return events;
};

const generateQuery = (key: string, value: any, operator: '$gt' | '$gte' | '$lt' | '$lte' | '$eq') => {
  if (!value ||  value === '' || value === -1) {
    return {};
  }

  return {
    [key]: { [operator]: value },
  };
};

export const index = asyncHandler(async (req: Request, res: Response) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  // }

  const { startTime, endTime, minAge, maxAge, country, state, date } = req.query;
  const today = new Date();
  const searchQuery = { 
    ...generateQuery('startTime', startTime, '$gt'),
    ...generateQuery('endTime', endTime, '$lte'),
    ...generateQuery('minAge', parseInt(minAge as string, 10) || -1, '$lte'),
    ...generateQuery('maxAge',  parseInt(maxAge as string, 10) || -1, '$gte'),
    ...generateQuery('country', country, '$eq'),
    ...generateQuery('state', state, '$eq'),
    // ...generateQuery('time', date ? date : today, '$gt'),
  };
  const events = await Event.find(searchQuery);
  if (events.length > 0) {
    return res.status(status.OK).send(events);
  }
  
  try {
    const userId = req.userId;
    const resData  = await hackLogic2(userId, minAge as unknown as number, maxAge as unknown as number, country, state) || [];
    res.status(status.OK).send(resData);
  } catch (e) {
    console.error(e);
  }
});

// show
export const show = asyncHandler(async (req: Request, res: Response) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  // }
  const { eventId } = req.params;
  const events = await Event.findById(eventId);
  res.status(status.OK).send(events);
});
// create
export const store = asyncHandler(async (req: Request, res: Response) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.sendStatus(status.UNPROCESSABLE_ENTITY);
    // }

    const event = new Event({ ...req.body, ...{ createdBy: req.userId } });
    event.save();
    res.status(status.CREATED).send(event);
  } catch (e ) {
    console.error(e);
  }
});

// update
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await Event.getModel(req.dbConnection).findById(id);
  if (!event) return res.status(404).send();

  res.status(status.OK).json(event);
});


export const destroy = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) return res.status(404).send();
  return res.status(status.OK).json({});
});


export const subscribe = async (req: Request, res: Response) => {
  //same cannot subscribe if already started 
  const eventId = req.params.eventId;
  const attendeeId = req.userId;

  // const hasReachLimit = await EventLimitService.hasReachLimit(req.user);
  // if (hasReachLimit) {
  //   return res.status(status.BAD_REQUEST).json({});
  // }
  const updatedEvent = await Event.updateOne(
    { _id: eventId, 'attendees.attendee_id': attendeeId }, 
    { $set: { 'attendees.$.isActive': true } },
  ).exec();
  if (updatedEvent.modifiedCount !== 0) {
    const result = await Event.findById(eventId);
    return res.status(status.OK).json(result);
  }

  Event.findOneAndUpdate({ _id: eventId },
    {
      $push: {
        attendees: {
          attendee_id: attendeeId,
          join_time: new Date(),
          isActive: true,
        },
      },
    }, { new: true }, (err:any, updateEvent: any) => {
      if (err) {
        res.status(status.INTERNAL_SERVER_ERROR);
      }
      return res.status(status.OK).json(updateEvent);
    });

};
  
export const unsubscribe = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;
  const userId = req.userId;

  const updatedEvent = await Event.findOneAndUpdate({
    _id: eventId,
    'attendees.attendee_id': userId,
  }, 
  { $set: { 'attendees.$.isActive': false } },
  { new: true }).exec();

  if (String(updatedEvent.host) === userId) {
    updatedEvent.host = null;
  }
  updatedEvent.save();
  return res.status(status.OK).json(updatedEvent);
};

export const report = (req: Request, res: Response) => {
  return res.status(status.OK).json({});
};

export const generateEvent = async (req: Request, res: Response) => {
  const { minAge, maxAge, country, state } = req.query;
  // const events = await hackLogic(parseInt(minAge as string, 10), parseInt(maxAge as string, 10), country, state, req.userId);
  res.status(status.OK).send([]);
};

export const suggestEvent = async (req: Request, res: Response) => {
  // const userId = req.userId;
  // res.status(status.OK).send(await hackLogic2(userId));
};

