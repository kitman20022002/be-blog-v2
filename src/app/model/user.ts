/* eslint-disable @typescript-eslint/no-use-before-define */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { Document, Types } from 'mongoose'; 

const DEFAULT_IMG_URL =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png';



interface IUser extends Document {
  email: string;
  password: string;
  isAdmin: boolean;
  refreshToken: string;
  active: boolean;
  firstName?: string;
  lastName?: string;
  avatarURL?: string;
  userName?: string;
  age?: string;
  country: string;
  state: string;
  sex: string;
  verify: boolean;
  subscribeEvents: { ref: string, type: Types.ObjectId }[];
  bookmarkEvents: { ref: string, type: Types.ObjectId }[];
  referrer: string;
  isModified: (path: string) => boolean;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      trim: true,
      required: true,
      default: false,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    avatarURL: {
      type: String,
      default: DEFAULT_IMG_URL,
    },
    userName: {
      type: String,
      trim: true,
      require:true,
    },
    dob:{
      type:String,
    },
    country:{
      type: Number,
    },
    state:{
      type: Number,
    },
    city:{
      type:String,
    },
    sex: {
      type:String,
      required: true,
    },
    verify:{
      type:Boolean,
      default:false,
    },
    subscribeEvents:[
      {
        ref: 'Event',
        type: Types.ObjectId,
      },
    ],
    bookmarkEvents:[
      {
        ref: 'Event',
        type: Types.ObjectId,
      },
    ],
    referrer: {
      type:String,
      require: true,
    },
    hobbies: [
      {
        ref: 'Hobby',
        type: Types.ObjectId,
      },
    ],
    minAge: {
      type: Number,
    },
    maxAge: {
      type: Number,
    },
    preferRange: {
      type: String,
    },
    preferLocations: [
      {
        ref: 'location',
        type: Types.ObjectId,
      },
    ],
    preferTime: {
      type: String,
    },
    token: {
      type: String, 
    },
    isActive: {
      type:Boolean,
      require: true,
    },
    validationToken: {
      type: String, 
    },
  },
  { timestamps: true },
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse', { expiresIn: '48h' });
  user.token = token;
  await user.save();
  return token;
};

userSchema.pre('save', async function (this: IUser, next:(err?: any) => void) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});


userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  const id = userObject._id;
  userObject.id = id;
  delete userObject._id;
  delete userObject?.password;
  delete userObject?.isActive;
  delete userObject?.__v;
  delete userObject?.verify;
  delete userObject?.validationToken;
  return userObject;
};

userSchema.statics.findByCredentials = async (email:string, password:string) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const user = await User.findOne({ email }).populate('bookmarkEvents').populate('hobbies');
  if (!user) {
    throw new Error('401');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('401');
  }
  return user;
};

userSchema.statics.findOrCreate = async (data:any) => {
  const { email } = data;
  let user = await User.findOne({ email });
  return user ? user : new User(data);
};

const User = mongoose.model('User', userSchema);

export default User;
