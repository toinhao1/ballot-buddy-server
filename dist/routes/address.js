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
const smarty_streets_1 = require("../controllers/smarty-streets");
const addressRouter = express_1.Router();
addressRouter.post('/address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const address = {
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
    };
    try {
        const currentAddress = yield smarty_streets_1.getFullZipCode(address);
        console.log(currentAddress);
        res.status(200).send("Address has been updated!");
    }
    catch (err) {
        console.log(err);
    }
}));
exports.default = addressRouter;
