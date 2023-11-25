export {};

const EventLimit = require('../model/eventLimit');
const Event = require('../model/event');

const getLatestEventLimit = async (user: any) => {
  const latestEventLimit = await EventLimit.find({ userId: user._id }).sort({ createdAt: -1 }).exec();
  const hasNoPreviousEvent = latestEventLimit;

  if (!hasNoPreviousEvent) {
    return new EventLimit({ eventLimit: 2, userId: user._id });  
  }
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const userCreatedDay = new Date(user.createdAt).getDate();
  if (currentDay > userCreatedDay) {
    return new EventLimit({ eventLimit: 2, userId: user._id });
  } 
  return latestEventLimit[0];
};

const getTotalJoinedEvent = async (user:any) => {
  const currentDate = new Date();
  const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, new Date(user.createdAt).getDate());
  
  //this need to be fixed
  const events = await Event.find({ 'attendees.attendee_id': user._id, 'attendees.join_time': { $gte: previousMonth, $lte: currentDate } }).exec();
  return events.length;
};

export const init = (user: any) => {
  const eventLimit = new EventLimit({ eventLimit: 2, userId: user._id });
  eventLimit.save();
};

export const hasReachLimit = async (user: any) => {
  const latestEventLimit = await getLatestEventLimit(user);
  const userJoinedEvent = await getTotalJoinedEvent(user);
  return userJoinedEvent >= latestEventLimit.eventLimit;
};
// export const computeEventLimit = async (user: any, eventId: string) => {
//   const event = await Event.find({ _id: eventId, 'attendees.attendee_id': user._id }).exec();
//   if (event.length !== 0) {
//     return;
//   }
//   const eventLimit = await getLatestEventLimit(user);
//   eventLimit.save();
// };