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
const express_1 = require("express");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const passport_1 = require("passport");
const User_1 = __importDefault(require("../models/User"));
const userRouter = express_1.Router();
// route to SignUp a new user
userRouter.post('/sign-up', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const userAlreadyExists = yield User_1.default.findOne({ email: email });
        if (userAlreadyExists) {
            return res.status(400).send("Email is already in use, please sign in.");
        }
        const newUser = new User_1.default({
            email: email,
            name: req.body.name,
            password: password,
        });
        const user = yield newUser.save();
        res.status(201).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
// route to sign in
userRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            return res.send({ status: 400, error: "Email not found." });
        }
        const isMatch = yield bcrypt_1.compare(password, user.password);
        if (isMatch) {
            let token = jsonwebtoken_1.sign({ id: user.id, email: user.email }, String(process.env.PASSPORT_SECRET), { expiresIn: "7d" });
            res.json({ success: true, token: token, userId: user._id, address: user.address });
        }
        else {
            return res.send({ status: 400, error: "Incorrect password" });
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
// update the user email
userRouter.put("/update", passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.user) {
        const updates = {
            email: req.body.email
        };
        try {
            let updatedUser = yield User_1.default.findOneAndUpdate({ _id: req.user._id }, { $set: updates }, { new: true });
            yield ((_a = updatedUser) === null || _a === void 0 ? void 0 : _a.save());
            res.json(updatedUser);
        }
        catch (err) {
            res.send(err);
        }
    }
    else {
        res.status(400).send("Please sign in to update your email");
    }
}));
userRouter.get("/user-profile", passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        try {
            const user = yield User_1.default.findOne({ _id: req.user._id });
            res.status(200).send({ message: "Here is your profile", user });
        }
        catch (err) {
            res.status(400).send(err);
        }
    }
    else {
        res.send("Please login!");
    }
}));
exports.default = userRouter;
