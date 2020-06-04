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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../../models/User"));
const userOneId = new mongoose_1.default.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'John Jacobs',
    email: 'testy@test.com',
    password: 'jhvjhv1122',
    token: jsonwebtoken_1.default.sign({ _id: userOneId }, String(process.env.PASSPORT_SECRET))
};
const userTwoId = new mongoose_1.default.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Bob Doe',
    email: 'crazyTalk@test.com',
    password: 'myhouse2018',
    token: jsonwebtoken_1.default.sign({ _id: userTwoId }, String(process.env.PASSPORT_SECRET))
};
const setupDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.deleteOne({ email: 'testy@test.com' });
    yield User_1.default.deleteOne({ email: 'crazyTalk@test.com' });
    yield new User_1.default(userOne).save();
    yield new User_1.default(userTwo).save();
});
exports.default = {
    userOne,
    userOneId,
    setupDatabase,
    userTwo,
    userTwoId,
};
