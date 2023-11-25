export {};
const mongoose = require('mongoose');
const { Types } = require('mongoose');

const eventTemplateSchema = new mongoose.Schema(
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
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    meetupLat: {
      type: Number,
    },
    meetupLng: {
      type: Number,
    },
    hobby: {
      type: Types.ObjectId,
      ref: 'Hobby',
      required: true,
    },   
    state: {
      type: Number,
      required: true,
    },
    country: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'user',
    },
    price: {
      type: Number,
      default: 0,
    },
    approved: {
      type: Boolean,
      required: true,
    },    
  },
  { timestamps: true },
);

const EventTemplate = mongoose.model('EventTemplate', eventTemplateSchema);
export default EventTemplate;


