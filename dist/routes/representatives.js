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
const vote_smart_1 = require("../controllers/vote-smart");
const news_api_1 = require("../controllers/news-api");
const CurrentReps_1 = require("../models/CurrentReps");
const Ballot_1 = require("../models/Ballot");
const User_1 = require("../models/User");
const representativeRouter = express_1.Router();
representativeRouter.get('/current-representatives', passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.user) {
        try {
            // check if user already has their reps in DB
            const arrayOfReps = yield CurrentReps_1.CurrentReps.findOne({ user: req.user.id });
            // return this as no need to make an api call
            console.log(arrayOfReps);
            if (arrayOfReps) {
                console.log("In here");
                const { reps } = arrayOfReps;
                res.status(200).send({ message: "Here are your reps!", data: reps });
            }
            else {
                const user = yield User_1.User.findById(req.user.id);
                const { zipcode, plusFourZip } = (_a = user) === null || _a === void 0 ? void 0 : _a.address;
                // get the current reps from votesmart
                const data = yield vote_smart_1.getCurrentRepresentatives(zipcode, plusFourZip);
                const repsToSave = new CurrentReps_1.CurrentReps({ user: req.user.id, reps: data });
                yield repsToSave.save();
                res.status(200).send({ message: "Here are your reps!", data });
            }
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ message: err });
        }
    }
    else {
        res.send("You must sign in to request this.");
    }
}));
representativeRouter.post('/current-representative/office-data', passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        try {
            let addressData;
            const { isForBallot, data } = req.body;
            if (!isForBallot) {
                // get specific rep office address, phone number, and website.
                addressData = yield vote_smart_1.getRepOfficeData(data.candidate_id);
            }
            else {
                addressData = yield vote_smart_1.getCandidateOfficeData(data.candidate_id);
            }
            const additionalData = yield vote_smart_1.getRepDetailedBio(data.candidate_id);
            const { candidate } = addressData.webaddress ? addressData.webaddress : addressData;
            const newsArticles = yield news_api_1.getNewsForRepresentative(candidate.nickName || candidate.firstName, candidate.lastName, data.office);
            res.status(200).send({ message: "Here is your reps contact info!", addressData, additionalData, newsArticles });
        }
        catch (err) {
            res.status(400).send({ message: "There was an error!", err });
        }
    }
    else {
        res.send("You must sign in to request this.");
    }
}));
representativeRouter.get('/current-representatives/ballot', passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (req.user) {
        try {
            const ballot = yield Ballot_1.Ballot.findOne({ user: req.user.id });
            if (ballot) {
                res.status(200).send({ message: "Here are your reps!", data: ballot });
            }
            else {
                // get the user
                const user = yield User_1.User.findById(req.user.id);
                // extract zipcode
                const { zipcode, plusFourZip } = (_b = user) === null || _b === void 0 ? void 0 : _b.address;
                // get the current reps from votesmart
                const data = yield vote_smart_1.getRepsForBallot(zipcode, plusFourZip);
                const saveBallot = new Ballot_1.Ballot({ user: req.user.id, ballot: data });
                yield saveBallot.save();
                res.status(200).send({ message: "Here are your reps!", data });
            }
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ message: "There was an error!" });
        }
    }
    else {
        res.send("You must sign in to request this.");
    }
}));
exports.default = representativeRouter;
