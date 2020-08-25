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
chai_1.default.use(chai_http_1.default);
const requester = chai_1.default.request(server_1.default).keepOpen();
describe('Testing all auth routes.', function () {
    before('Open everything', function () { });
    after('Close all connectuons', function (done) {
        requester.close();
        done();
    });
    it('try to sign up with no input.', function () {
        return requester.post('/sign-up').then((res) => {
            chai_1.expect(res).to.have.status(500);
        });
    });
});
