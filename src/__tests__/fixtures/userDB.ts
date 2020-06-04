import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../../models/User'

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'John Jacobs',
  email: 'testy@test.com',
  password: 'jhvjhv1122',
  token: jwt.sign({ _id: userOneId }, String(process.env.PASSPORT_SECRET))

};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'Bob Doe',
  email: 'crazyTalk@test.com',
  password: 'myhouse2018',
  token: jwt.sign({ _id: userTwoId }, String(process.env.PASSPORT_SECRET))
};

const setupDatabase = async () => {
  await User.deleteOne({ email: 'testy@test.com' });
  await User.deleteOne({ email: 'crazyTalk@test.com' });
  await new User(userOne).save();
  await new User(userTwo).save();
};

export default {
  userOne,
  userOneId,
  setupDatabase,
  userTwo,
  userTwoId,
};