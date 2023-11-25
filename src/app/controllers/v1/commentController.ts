
import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/helper';
import { validationResult } from 'express-validator';
const mongoose = require('mongoose');
const Comment = require('../../model/comment');
const Event = require('../../model/event');
import User from '../../model/user';
const status = require('http-status');


export const store = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  
  const newComment = new Comment(req.body);
  const savedComment = await newComment.save();
  const comment =  await Comment.findById(savedComment._id)
    .populate({ path: 'event', model: Event })
    .populate({ path: 'user', model: User })
    .exec();

  res.status(status.CREATED).send(comment);
});

export const show = asyncHandler(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
    
  const comments = await Comment.find({ event: mongoose.Types.ObjectId(eventId) }).populate({
    path: 'event',
    model: Event,
  }).populate({
    path: 'user',
    model: User,
  }).sort({ createdAt: -1 });
  res.status(status.OK).send(comments);
});
  
export const update = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { $set: { comment: req.body.comment } },
    { new: true },
  ).populate({
    path: 'event',
    model: Event,
  }).populate({
    path: 'user',
    model: User,
  });

  return comment ?  res.send(comment) :  res.sendStatus(status.INTERNAL_SERVER_ERROR);
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const comment = await Comment.findOneAndDelete({
    _id: mongoose.Types.ObjectId(id),
  });
  if (!comment) return res.status(404).send();
  return res.status(status.OK).json({});
});