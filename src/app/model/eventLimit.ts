export {};

const mongoose = require('mongoose');
const { Types }  = require('mongoose');

const eventLimitModel = new mongoose.Schema({
  eventLimit: {
    type: Number,
    required: true,
  },
  userId: {
    type: Types.ObjectId, 
    ref: 'user', 
    require:true,
  },
}, { timestamps: true });

const EventLimit = mongoose.model('EventLimit', eventLimitModel);
module.exports = EventLimit;