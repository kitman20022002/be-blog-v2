
export {};
const mongooseLoader = require('../../loaders/mongoose');
import { seedPost } from '../database/seeders/seedPost';
const dotenv = require('dotenv');
dotenv.config();

const init = async () => {
  await mongooseLoader();
  await seedPost();
};


init();