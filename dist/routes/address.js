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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = require("passport");
const smarty_streets_1 = require("../controllers/smarty-streets");
const CurrentReps_1 = require("../models/CurrentReps");
const Ballot_1 = require("../models/Ballot");
const Address_1 = require("../models/Address");
const User_1 = require("../models/User");
const addressRouter = express_1.Router();
addressRouter.post('/set-address', passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { street, city, state, zipCode, secondary } = req.body;
    const { _id } = req.user;
    const address = {
        street: street,
        secondary: secondary || '',
        city: city,
        state: state,
        zipcode: zipCode,
    };
    try {
        // make request to get full address
        const smartyStreetsData = yield smarty_streets_1.getFullZipCode(address);
        // combine user provided data with data from smartysteets
        const combinedAddress = Object.assign(Object.assign({}, address), smartyStreetsData);
        // create the new address
        const currentAddress = new Address_1.Address(combinedAddress);
        // when changing address remove current list of representatives
        yield CurrentReps_1.CurrentReps.findOneAndDelete({ user: _id });
        yield Ballot_1.Ballot.findOneAndDelete({ user: _id });
        const userToSave = yield User_1.User.findOne({ _id });
        if (!userToSave) {
            throw new Error('User not found');
        }
        // set address to user and save.
        userToSave.address = currentAddress;
        const user = yield userToSave.save();
        res.status(200).send({ message: 'Address has been updated!', user });
    }
    catch (err) {
        res.status(400).send({
            message: 'Your address is invalid, please input a correct address.',
        });
    }
}));
exports.default = addressRouter;
