"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'John Jacobs',
    email: 'test@tes.com',
    password: 'jhvjhv1122',
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
        }
    ]
};
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Bob Doe',
    email: 'crazyTalk@test.com',
    password: 'myhouse2018',
    tokens: [
        {
            token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
        }
    ]
};
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Make cookies',
    complete: false,
    owner: userOneId
};
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Clean house',
    completed: true,
    owner: userOneId
};
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Workout',
    owner: userTwoId
};
const setupDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield User.deleteMany();
    yield new User(userOne).save();
    yield new User(userTwo).save();
});
module.exports = {
    userOne,
    userOneId,
    setupDatabase,
    userTwo,
    userTwoId,
};
