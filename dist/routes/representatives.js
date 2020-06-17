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
const vote_smart_1 = require("../controllers/vote-smart");
const User_1 = __importDefault(require("../models/User"));
const representativeRouter = express_1.Router();
representativeRouter.get('/current-representatives', passport_1.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.user) {
        // get the user
        const user = yield User_1.default.findById(req.user.id);
        // extract zipcode
        const { zipcode, plusFourZip } = (_a = user) === null || _a === void 0 ? void 0 : _a.address;
        // get the current reps from votesmart
        const data = yield vote_smart_1.getCurrentRepresentatives(zipcode, plusFourZip);
        res.status(200).send({ message: "Here are your reps!", data });
    }
    else {
        res.send("Fuck off");
    }
}));
exports.default = representativeRouter;
