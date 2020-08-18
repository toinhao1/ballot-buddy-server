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
const Ballot_1 = require("../models/Ballot");
const vote_smart_1 = require("../controllers/vote-smart");
const statesToIgnore_1 = require("../utils/statesToIgnore");
const ballotRouter = express_1.Router();
ballotRouter.get('/current-ballot', passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        try {
            const lastBallot = yield Ballot_1.Ballot.findOne({ user: req.user.id });
            if (lastBallot) {
                const { ballot } = lastBallot;
                res.status(200).send({ message: 'Here is your current ballot!', ballot });
            }
            else {
                // extract zipcode
                const { zipcode, plusFourZip } = req.user.address;
                // get the current reps from votesmart
                const races = yield vote_smart_1.getRepsForBallot(zipcode, plusFourZip);
                // get ballot measures for ballot if users state allows for it
                let ballotMeasures;
                if (!statesToIgnore_1.statesToIgnore.hasOwnProperty(req.user.address.state)) {
                    // then we get the ballot measures
                    ballotMeasures = yield vote_smart_1.getBallotMeasures(req.user.address.state);
                }
                const ballotWithMeasure = { races, ballotMeasures };
                const ballotWithoutMeasures = { races };
                const ballot = statesToIgnore_1.statesToIgnore.hasOwnProperty(req.user.address.state)
                    ? ballotWithoutMeasures
                    : ballotWithMeasure;
                const saveBallot = new Ballot_1.Ballot({
                    user: req.user.id,
                    ballot: ballot,
                });
                yield saveBallot.save();
                res.status(200).send({ message: 'Here is your current ballot!', ballot });
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
ballotRouter.post('/selected-measure', passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const specificMeasure = yield vote_smart_1.getSpecificBallotMeasure(req.body.measureId);
        res.status(200).send({ message: 'Here is the measure data!', specificMeasure });
    }
    catch (err) {
        res.status(400).send({ message: 'There was an error!' });
    }
}));
exports.default = ballotRouter;
