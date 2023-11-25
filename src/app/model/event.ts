export {};
const mongoose = require('mongoose');
const { Types } = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
    },
    meetupLocation: {
      type: String,
    },
    hobby: {
      type: Types.ObjectId,
      ref: 'Hobby',
      required: true,
    },   
    minAge: {
      type: Number,
      required: true,
    },
    maxAge: {
      type: Number,
      required: true,
    },
    attendees: [{ 
      attendee_id: { type: Types.ObjectId, ref: 'user' }, 
      join_time: { type: Date },
      isActive: { type:Boolean },
    }],   
    host: {
      type: Types.ObjectId,
      ref: 'user',
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    repeatFrequency:{
      type: String,
      require: true,
    },
    comments: {
      type: Types.ObjectId,
      ref: 'comment',
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'user',
      require: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    activityAfterEvent: {
      type: Boolean,
      require: true,
      default: false,
    },      
  },
  { timestamps: true },
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;