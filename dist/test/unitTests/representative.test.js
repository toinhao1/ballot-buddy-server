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
let repToDelete = '15723';
describe('Testing all rep routes.', function () {
    before('Open everything', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield userData_1.getOldUserToken(requester);
            currentUserToken = token;
        });
    });
    after('Close all connectuons', function (done) {
        models_1.Politicians.findOneAndDelete({ candidateId: repToDelete }).then(() => {
            requester.close();
        });
        done();
    });
    it('Should return an object of representatives.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield requester
                .get('/current-representatives')
                .set('Authorization', currentUserToken);
            chai_1.expect(res.body.message).to.equal('Here are your reps!');
            chai_1.expect(res.body.data.length).to.be.greaterThan(1);
            chai_1.expect(res).to.have.status(200);
        });
    });
    it('Should throw an error with status code 401.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield requester.get('/current-representatives');
            chai_1.expect(res).to.have.status(401);
        });
    });
    it('Should get all data about a certain rep with status 200.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield requester
                .post('/current-representative/office-data')
                .set('Authorization', currentUserToken)
                .send({ isForBallot: true, data: { candidate_id: seeds_1.candidateId, office: seeds_1.office } });
            chai_1.expect(res.body).to.haveOwnProperty('addressData');
            chai_1.expect(res.body).to.haveOwnProperty('additionalData');
            chai_1.expect(res.body).to.haveOwnProperty('newsArticles');
            chai_1.expect(res).to.have.status(200);
        });
    });
    it('Should get all data about a certain rep with status 201.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield requester
                .post('/current-representative/office-data')
                .set('Authorization', currentUserToken)
                .send({ isForBallot: false, data: { candidate_id: repToDelete, office: seeds_1.office } });
            chai_1.expect(res.body).to.haveOwnProperty('addressData');
            chai_1.expect(res.body).to.haveOwnProperty('additionalData');
            chai_1.expect(res.body).to.haveOwnProperty('newsArticles');
            chai_1.expect(res).to.have.status(201);
        });
    });
    it('Should be rejected with status 401.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield requester
                .post('/current-representative/office-data')
                .send({ isForBallot: false, data: { candidate_id: repToDelete, office: seeds_1.office } });
            chai_1.expect(res.body).to.not.haveOwnProperty('addressData');
            chai_1.expect(res).to.have.status(401);
        });
    });
    it('Should throw an error with status 400.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield requester
                .post('/current-representative/office-data')
                .set('Authorization', currentUserToken)
                .send({ isForBallot: false });
            chai_1.expect(res).to.have.status(400);
        });
    });
    it('Should throw an error with status 400.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield requester
                .post('/current-representative/office-data')
                .set('Authorization', currentUserToken)
                .send({});
            chai_1.expect(res).to.have.status(400);
        });
    });
});
