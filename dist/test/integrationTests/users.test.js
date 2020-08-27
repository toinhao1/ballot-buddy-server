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
const models_1 = require("../../models");
const userData_1 = require("../helpers/userData");
const seeds_1 = require("../helpers/seeds");
chai_1.default.use(chai_http_1.default);
const requester = chai_1.default.request(server_1.default).keepOpen();
let createdUserId = '';
let fakeUserId = '';
let userToken = '';
describe('All integrated user routes.', function () {
    before('Open everything', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield userData_1.getNewUserToken(requester);
            userToken = token;
        });
    });
    after('Close all connectuons', function (done) {
        const deleteFirstUser = models_1.User.findByIdAndDelete({ _id: createdUserId });
        const deleteSecondUser = models_1.User.findByIdAndDelete({ _id: fakeUserId });
        Promise.all([deleteFirstUser, deleteSecondUser])
            .then(() => {
            requester.close();
        })
            .catch((err) => {
            console.log(err);
        });
        done();
    });
    describe('Create a user and check the DB.', function () {
        it('Should create a user and then retrieve user from the DB.', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield requester
                    .post('/sign-up')
                    .send({ email: seeds_1.userEmail, password: seeds_1.userPassword });
                createdUserId = res.body._id;
                chai_1.expect(res).to.have.status(201);
                const user = yield models_1.User.findOne({ _id: createdUserId });
                if (user) {
                    chai_1.expect(user.email).to.equal(seeds_1.userEmail);
                    chai_1.expect(user.id).to.equal(createdUserId);
                }
            });
        });
        it('should update the user in the db and verify on the DB.', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield requester
                    .put('/update')
                    .set('Authorization', userToken)
                    .send({ email: 'updated@email.com' });
                fakeUserId = res.body.updatedUser._id;
                chai_1.expect(res).to.have.status(201);
                const user = yield models_1.User.findOne({ _id: fakeUserId });
                if (user) {
                    chai_1.expect(user.email).to.equal('updated@email.com');
                    chai_1.expect(user.id).to.equal(fakeUserId);
                }
            });
        });
    });
});
