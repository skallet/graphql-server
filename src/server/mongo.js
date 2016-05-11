import mongoose from 'mongoose';
import config from './config.js';
import UserModel from './mongo/user.js';

mongoose.connect(config.mongoDb);

export default {
  user: UserModel,
};
