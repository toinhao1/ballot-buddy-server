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
const userData_1 = require("../helpers/userData");
chai_1.default.use(chai_http_1.default);
const requester = chai_1.default.request(server_1.default).keepOpen();
let createdUserId = '';
let userToken = '';
describe('All integrated user routes.', function () {
    before('Open everything', function () { });
    after('Close all connectuons', function (done) {
        models_1.User.findByIdAndDelete(createdUserId).then(() => {
            requester.close();
        });
        done();
    });
    describe('Create a user and check the DB.', function () {
        it('Should create a user and then retrieve user from the DB.', function () {
            return requester
                .post('/sign-up')
                .send({ email: userData_1.userEmail, password: userData_1.userPassword })
                .then((res) => {
                createdUserId = res.body._id;
                chai_1.expect(res).to.have.status(201);
            })
                .then(() => {
                models_1.User.findOne({ _id: createdUserId }).then((user) => {
                    if (user) {
                        chai_1.expect(user.email).to.equal(userData_1.userEmail);
                        chai_1.expect(user.id).to.equal(createdUserId);
                    }
                });
            });
        });
    });
});
