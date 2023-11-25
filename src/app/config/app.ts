/* eslint-disable no-secrets/no-secrets */
const dotenv = require('dotenv');
const stripeAPI = require('stripe');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config();

//---------------------------v2--------------------------
const DEFAULT_USER_CONNECTION =
  // eslint-disable-next-line no-secrets/no-secrets
  `mongodb+srv://dbuser:${process.env.DB_PASSWORD}@cluster0.c7jps.mongodb.net/users?retryWrites=true&w=majority`;

module.exports = {
  name: process.env.NAME || 'techscrumapp',
  port: process.env.PORT || 8000,
  api: {
    prefix: process.env.API_PREFIX || '/api/v1',
  },
  version: '1.0.0',
  db: process.env.MONGODB_URL,
  companyAddress: process.env.COMPANY_ADDRESS || 'su93031093@gmail.com',
  emailSecret: process.env.EMAIL_SECRET || '123456',
  forgotSecret: process.env.FORGET_SECRET || '321654',
  stripe: stripeAPI(process.env.STRIPE_PRIVATE_KEY),
  stripeSecret: process.env.STRIPE_WEBHOOK_SECRET,
  //---------------------------v2--------------------------
  userConnection: process.env.USER_URL || DEFAULT_USER_CONNECTION,
  googleAPIKey: process.env.GOOGLE_API_KEY,
};
