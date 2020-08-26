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
const userData_1 = require("../helpers/userData");
chai_1.default.use(chai_http_1.default);
const requester = chai_1.default.request(server_1.default).keepOpen();
let currentUserToken = '';
describe('Testing all rep routes.', function () {
    before('Open everything', function () {
        return userData_1.getOldUserToken(requester).then((token) => {
            currentUserToken = token;
        });
    });
    after('Close all connectuons', function (done) {
        requester.close();
        done();
    });
    it('Should return an object of representatives.', function () {
        return requester
            .get('/current-representatives')
            .set('Authorization', currentUserToken)
            .then((res) => {
            chai_1.expect(res.body.message).to.equal('Here are your reps!');
            chai_1.expect(res.body.data.length).to.be.greaterThan(1);
            chai_1.expect(res).to.have.status(200);
        });
    });
    it('Should get all data about a certain rep.', function () {
        return requester
            .post('/current-representative/office-data')
            .set('Authorization', currentUserToken)
            .send();
    });
});
