import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../server';
import { getOldUserToken } from '../helpers/userData';
import { userId } from '../helpers/seeds';
import { CurrentReps } from '../../models';

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

let currentUserToken = '';
let repToDelete = '15723';

describe('All rep integration tests.', function () {
	before('Open everything', async function () {
		const token = await getOldUserToken(requester);
		currentUserToken = token;
	});

	after('Close all connectuons', function (done) {
		CurrentReps.findOneAndDelete({ user: userId }).then(() => {
			requester.close();
		});
		done();
	});

	it('Should return all reps and save them in the DB.', async function () {
		const res = await requester
			.get('/current-representatives')
			.set('Authorization', currentUserToken);

		expect(res.body.message).to.equal('Here are your reps!');
		expect(res.body.data.length).to.be.greaterThan(1);
		expect(res).to.have.status(201);

		const currentReps = await CurrentReps.findOne({ user: userId });

		expect(currentReps?.reps.length).to.be.greaterThan(1);
	});
});
