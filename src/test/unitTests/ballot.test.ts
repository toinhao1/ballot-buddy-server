import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../server';
import { getOldUserToken } from '../helpers/userData';
import { userId, measureId } from '../helpers/seeds';
import { Ballot } from '../../models';

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

let currentUserToken = '';

describe('Testing all ballot routes.', function () {
	before('Open everything', async function () {
		const token = await getOldUserToken(requester);
		currentUserToken = token;
	});

	after('Close all connectuons', function (done) {
		Ballot.findOneAndDelete({ user: userId }).then(() => {
			requester.close();
		});
		done();
	});
	describe('GET /current-ballot', function () {
		it('Should return a users current ballot with a status code of 201.', async function () {
			const res = await requester.get('/current-ballot').set('Authorization', currentUserToken);

			expect(res.body.savedBallot).to.haveOwnProperty('ballot');
			expect(res.body.savedBallot.ballot).to.haveOwnProperty('races');
			expect(res.body.savedBallot.ballot).to.haveOwnProperty('ballotMeasures');
			expect(res).to.have.status(201);
		});

		it('Should return a users current ballot with a status code of 200.', async function () {
			const res = await requester.get('/current-ballot').set('Authorization', currentUserToken);

			expect(res.body.ballot).to.haveOwnProperty('races');
			expect(res.body.ballot).to.haveOwnProperty('ballotMeasures');
			expect(res).to.have.status(200);
		});

		it('Should throw an error with status 401.', async function () {
			const res = await requester.get('/current-ballot');

			expect(res).to.have.status(401);
		});
	});
	describe('POST /selected-measure', function () {
		it('Should return data about a specific measure with status 200.', async function () {
			const res = await requester
				.post('/selected-measure')
				.set('Authorization', currentUserToken)
				.send({ measureId });

			expect(res.body.message).to.equal('Here is the measure data!');
			expect(res.body.specificMeasure).to.haveOwnProperty('title');
			expect(res).to.have.status(200);
		});

		it('Should throw an error with status 400.', async function () {
			const res = await requester.post('/selected-measure').set('Authorization', currentUserToken);

			expect(res).to.have.status(400);
		});

		it('Should throw an error with status 401.', async function () {
			const res = await requester.post('/selected-measure');

			expect(res).to.have.status(401);
		});
	});
});
