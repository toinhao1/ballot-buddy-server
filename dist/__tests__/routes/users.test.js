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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const User_1 = __importDefault(require("../../models/User"));
const userDB_1 = __importDefault(require("../fixtures/userDB"));
describe("All user related tests", () => {
    beforeEach(() => {
        userDB_1.default.setupDatabase();
    });
    it('Should signup a new user', (done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield supertest_1.default(app_1.default)
                .post('/user/sign-up')
                .expect(201);
            // Assert that DB was changed correctly
            const user = yield User_1.default.findById(response.body.user._id);
            expect(user).not.toBeNull();
            if (!user) {
                throw new Error('No user was returned.');
            }
            expect(user.password).not.toBe('skdnekudfui324');
            done();
        }
        catch (err) {
            done(err);
        }
    }));
});
