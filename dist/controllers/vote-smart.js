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
const axios_1 = __importDefault(require("axios"));
exports.getCurrentRepresentatives = (zip5, zip4) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://votesmart.org/x/search?s=${zip5}${zip4}`);
    const currentReps = response.data.results.filter((rep) => rep.incumbent === true);
    return currentReps;
});
exports.getRepOfficeData = (candidateId) => __awaiter(void 0, void 0, void 0, function* () {
    const firstRes = yield axios_1.default.get(`http://api.votesmart.org/Address.getOffice?key=${String(process.env.VOTE_SMART_API_KEY)}&o=JSON&candidateId=${candidateId}`);
    const secondRes = yield axios_1.default.get(`http://api.votesmart.org/Address.getOfficeWebAddress?key=${String(process.env.VOTE_SMART_API_KEY)}&o=JSON&candidateId=${candidateId}`);
    const firstExtractedData = firstRes.data.address.office;
    const secondExtractedData = secondRes.data;
    return Object.assign(Object.assign({}, firstExtractedData), secondExtractedData);
});