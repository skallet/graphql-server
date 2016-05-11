import mongoose from 'mongoose';

const UserModel = mongoose.model('User', {

  sessionId: String,

  name: String,

  likes: Array,

});

export default UserModel;
