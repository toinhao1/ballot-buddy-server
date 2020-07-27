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
const Politicians_1 = require("../models/Politicians");
const representativeRouter = express_1.Router();
representativeRouter.get('/current-representatives', passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        try {
            // check if user already has their reps in DB
            const arrayOfReps = yield CurrentReps_1.CurrentReps.findOne({ user: req.user.id });
            // return this as no need to make an api call
            if (arrayOfReps) {
                const { reps } = arrayOfReps;
                res.status(200).send({ message: 'Here are your reps!', data: reps });
            }
            else {
                const { zipcode, plusFourZip } = req.user.address;
                // get the current reps from votesmart
                const data = yield vote_smart_1.getCurrentRepresentatives(zipcode, plusFourZip);
                const repsToSave = new CurrentReps_1.CurrentReps({ user: req.user.id, reps: data });
                yield repsToSave.save();
                res.status(200).send({ message: 'Here are your reps!', data });
            }
        }
        catch (err) {
            res.status(400).send({ message: err });
        }
    }
    else {
        res.send({ message: 'You must sign in to request this.' });
    }
}));
representativeRouter.post('/current-representative/office-data', passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        try {
            const { isForBallot, data } = req.body;
            const requestedRep = yield Politicians_1.Politicians.findOne({
                candidateId: data.candidate_id,
            });
            if (requestedRep) {
                const { contactInfo, detailedBio } = requestedRep;
                const { candidate } = contactInfo.webaddress
                    ? contactInfo.webaddress
                    : contactInfo;
                const newsArticles = yield news_api_1.getNewsForRepresentative(candidate.nickName || candidate.firstName, candidate.lastName, data.office);
                res
                    .status(200)
                    .send({
                    message: 'Here is your reps contact info!',
                    addressData: contactInfo,
                    additionalData: detailedBio,
                    newsArticles,
                });
            }
            else {
                let addressData;
                if (!isForBallot) {
                    // get specific rep office address, phone number, and website.
                    addressData = yield vote_smart_1.getRepOfficeData(data.candidate_id);
                }
                else {
                    addressData = yield vote_smart_1.getCandidateOfficeData(data.candidate_id);
                }
                const additionalData = yield vote_smart_1.getRepDetailedBio(data.candidate_id);
                const { candidate } = addressData.webaddress
                    ? addressData.webaddress
                    : addressData;
                const newsArticles = yield news_api_1.getNewsForRepresentative(candidate.nickName || candidate.firstName, candidate.lastName, data.office);
                const politicianToSave = new Politicians_1.Politicians({
                    candidateId: data.candidate_id,
                    contactInfo: addressData,
                    detailedBio: additionalData,
                });
                yield politicianToSave.save();
                res
                    .status(200)
                    .send({
                    message: 'Here is your reps contact info!',
                    addressData,
                    additionalData,
                    newsArticles,
                });
            }
        }
        catch (err) {
            res.status(400).send({ message: 'There was an error!', err });
        }
    }
    else {
        res.send({ message: 'You must sign in to request this.' });
    }
}));
representativeRouter.get('/current-representatives/ballot', passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        try {
            const lastBallot = yield Ballot_1.Ballot.findOne({ user: req.user.id });
            if (lastBallot) {
                const { ballot } = lastBallot;
                res
                    .status(200)
                    .send({ message: 'Here are your reps!', data: ballot });
            }
            else {
                // extract zipcode
                const { zipcode, plusFourZip } = req.user.address;
                // get the current reps from votesmart
                const data = yield vote_smart_1.getRepsForBallot(zipcode, plusFourZip);
                const saveBallot = new Ballot_1.Ballot({ user: req.user.id, ballot: data });
                yield saveBallot.save();
                res.status(200).send({ message: 'Here are your reps!', data });
            }
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ message: 'There was an error!' });
        }
    }
    else {
        res.send({ message: 'You must sign in to request this.' });
    }
}));
exports.default = representativeRouter;
