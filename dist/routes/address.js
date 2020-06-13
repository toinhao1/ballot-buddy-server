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
const passport_1 = require("passport");
const smarty_streets_1 = require("../controllers/smarty-streets");
const Address_1 = require("../models/Address");
const User_1 = __importDefault(require("../models/User"));
const addressRouter = express_1.Router();
addressRouter.post('/set-address', passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { street, city, state, zipcode, secondary } = req.body;
    const { _id } = req.user;
    const address = {
        street: street,
        secondary: secondary || '',
        city: city,
        state: state,
        zipcode: zipcode,
    };
    try {
        // make request to get full address
        const smartyStreetsData = yield smarty_streets_1.getFullZipCode(address);
        // combine user provided data with data from smartysteets
        const combinedAddress = Object.assign(Object.assign({}, address), smartyStreetsData);
        // create the new address
        const currentAddress = new Address_1.Address(combinedAddress);
        const userToSave = yield User_1.default.findOne({ _id });
        if (!userToSave) {
            throw new Error("User not found");
        }
        // set address to user and save.
        userToSave.address = currentAddress;
        const user = yield userToSave.save();
        res.status(200).send({ message: "Address has been updated!", user });
    }
    catch (err) {
        res.status(400).send('There was an error please try again later.');
    }
}));
exports.default = addressRouter;
