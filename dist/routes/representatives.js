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
const vote_smart_1 = require("../controllers/vote-smart");
const representativeRouter = express_1.Router();
representativeRouter.get('/current-representatives', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { zipcode, zipcode4 } = req.body;
    const data = yield vote_smart_1.getCurrentRepresentatives(zipcode, zipcode4);
    res.send({ message: "Here are your reps!", data });
}));
exports.default = representativeRouter;
