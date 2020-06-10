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
const passport_1 = __importDefault(require("passport"));
const smarty_streets_1 = require("../controllers/smarty-streets");
const addressRouter = express_1.Router();
addressRouter.post('/address', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { street, city, state, zipcode, secondary } = req.body;
    const { _id } = req.user;
    if (!req.user) {
        res.status(400).send("Please sign in!");
    }
    const address = {
        street: street,
        secondary: secondary || '',
        city: city,
        state: state,
        zipcode: zipcode,
    };
    console.log(req.user);
    try {
        const currentAddress = yield smarty_streets_1.getFullZipCode(address);
        console.log(currentAddress);
        // const userToSave = await User.findOneAndUpdate(_id, { address: { street } })
        // userToSave.save()
        res.status(200).send("Address has been updated!");
    }
    catch (err) {
        console.log(err);
    }
}));
exports.default = addressRouter;
