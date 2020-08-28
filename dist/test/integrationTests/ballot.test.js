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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importStar(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const server_1 = __importDefault(require("../../server"));
const userData_1 = require("../helpers/userData");
const seeds_1 = require("../helpers/seeds");
const models_1 = require("../../models");
chai_1.default.use(chai_http_1.default);
const requester = chai_1.default.request(server_1.default).keepOpen();
let currentUserToken = '';
describe('Testing all ballot routes.', function () {
    before('Open everything', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield userData_1.getOldUserToken(requester);
            currentUserToken = token;
        });
    });
    after('Close all connectuons', function (done) {
        models_1.Ballot.findOneAndDelete({ user: seeds_1.userId }).then(() => {
            requester.close();
        });
        done();
    });
    it('Should return a users ballot and save to the DB with status 201.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield requester.get('/current-ballot').set('Authorization', currentUserToken);
            chai_1.expect(res).to.have.status(201);
            const ballot = yield models_1.Ballot.findOne({ _id: res.body.savedBallot._id });
            chai_1.expect(ballot === null || ballot === void 0 ? void 0 : ballot.ballot).to.haveOwnProperty('races');
            chai_1.expect(ballot === null || ballot === void 0 ? void 0 : ballot.ballot).to.haveOwnProperty('ballotMeasures');
        });
    });
});
