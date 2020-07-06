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
    let firstExtractedData = {};
    if (firstRes.data.error) {
        firstExtractedData = {};
    }
    else if (Array.isArray(firstRes.data.address.office)) {
        firstExtractedData['office'] = firstRes.data.address.office[0];
    }
    else {
        firstExtractedData = firstRes.data.address;
    }
    const secondExtractedData = secondRes.data;
    return Object.assign(Object.assign({}, firstExtractedData), secondExtractedData);
});
exports.getRepDetailedBio = (candidateId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const response = yield axios_1.default.get(`http://api.votesmart.org/CandidateBio.getDetailedBio?key=${String(process.env.VOTE_SMART_API_KEY)}&o=JSON&candidateId=${candidateId}`);
    const extractedData = {
        professional: (_a = response.data.bio) === null || _a === void 0 ? void 0 : _a.candidate.profession,
        political: (_b = response.data.bio) === null || _b === void 0 ? void 0 : _b.candidate.political,
    };
    return extractedData;
});
exports.getCandidateOfficeData = (candidateId) => __awaiter(void 0, void 0, void 0, function* () {
    const firstRes = yield axios_1.default.get(`http://api.votesmart.org/Address.getCampaign?key=${String(process.env.VOTE_SMART_API_KEY)}&o=JSON&candidateId=${candidateId}`);
    const secondRes = yield axios_1.default.get(`http://api.votesmart.org/Address.getCampaignWebAddress?key=${String(process.env.VOTE_SMART_API_KEY)}&o=JSON&candidateId=${candidateId}`);
    let firstExtractedData = {};
    if (firstRes.data.error) {
        firstExtractedData = {};
    }
    else if (Array.isArray(firstRes.data.address.office)) {
        firstExtractedData['office'] = firstRes.data.address.office[0];
    }
    else {
        firstExtractedData = firstRes.data.address;
    }
    // let correctWebAddress: any = {}
    // if (!Array.isArray(secondRes.data.webaddress.address)) {
    //   correctWebAddress["webaddress"]["address"] = [secondRes.data.webaddress.address]
    // }
    const secondExtractedData = secondRes.data;
    return Object.assign(Object.assign({}, firstExtractedData), secondExtractedData);
});
exports.getRepsForBallot = (zip5, zip4) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://votesmart.org/x/search?s=${zip5}${zip4}`);
    const currentReps = response.data.results.filter((rep) => rep.electioncandidatestatus === "Running" || rep.electioncandidatestatus === "Announced");
    let ballotObject = {};
    currentReps.forEach((rep) => {
        let repArray = [];
        if (ballotObject.hasOwnProperty(rep.office)) {
            ballotObject[rep.office].push(rep);
        }
        else {
            repArray.push(rep);
            ballotObject[rep.office] = repArray;
        }
    });
    return ballotObject;
});
