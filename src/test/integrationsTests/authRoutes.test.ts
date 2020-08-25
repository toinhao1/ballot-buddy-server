import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

describe('Testing all auth routes.', function () {
	before('Open everything', function () {});
	after('Close all connectuons', function (done) {
		requester.close();
		done();
	});
	it('try to sign up with no input.', function () {
		return requester.post('/sign-up').then((res) => {
			expect(res).to.have.status(500);
		});
	});
});
