import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../server';
import { getOldUserToken } from '../helpers/userData';

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

let currentUserToken = '';

describe('Testing all rep routes.', function () {
	before('Open everything', function () {
		return getOldUserToken(requester).then((token) => {
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
				expect(res.body.message).to.equal('Here are your reps!');
				expect(res.body.data.length).to.be.greaterThan(1);
				expect(res).to.have.status(200);
			});
	});

	it('Should get all data about a certain rep.', function () {
		return requester
			.post('/current-representative/office-data')
			.set('Authorization', currentUserToken)
			.send();
	});
});
