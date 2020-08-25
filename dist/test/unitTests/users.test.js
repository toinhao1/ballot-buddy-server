"use strict";
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
const models_1 = require("../../models");
chai_1.default.use(chai_http_1.default);
const requester = chai_1.default.request(server_1.default).keepOpen();
let createdUserId = '';
describe('Testing all auth routes.', function () {
    before('Open everything', function () {
        // return mongoose.createConnection(String(process.env.))
    });
    after('Close all connectuons', function (done) {
        models_1.User.findByIdAndDelete(createdUserId).then(() => {
            requester.close();
        });
        done();
    });
    describe('POST /sign-up', function () {
        it('try to sign up with no input.', function () {
            return requester.post('/sign-up').then((res) => {
                chai_1.expect(res).to.have.status(500);
            });
        });
        it('try to sign up with only one input.', function () {
            return requester
                .post('/sign-up')
                .send({ email: 'tester@testers.com' })
                .then((res) => {
                chai_1.expect(res).to.have.status(500);
            });
        });
        it('try to sign up with only one input.', function () {
            return requester
                .post('/sign-up')
                .send({ password: 'password' })
                .then((res) => {
                chai_1.expect(res).to.have.status(500);
            });
        });
        it('try to sign up with correct input.', function () {
            return requester
                .post('/sign-up')
                .send({ email: 'tester@testers.com', password: 'password' })
                .then((res) => {
                createdUserId = res.body._id;
                chai_1.expect(res.body._id).to.not.be.null;
                chai_1.expect(res).to.have.status(201);
            });
        });
        it('try to sign up with credentials that are already in use.', function () {
            return requester
                .post('/sign-up')
                .send({ email: 'tester@testers.com', password: 'password' })
                .then((res) => {
                chai_1.expect(res).to.have.status(400);
            });
        });
    });
});
