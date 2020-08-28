import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../server';
import { getOldUserToken } from '../helpers/userData';
import { userId } from '../helpers/seeds';
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
	it('Should return a users ballot and save to the DB with status 201.', async function () {
		const res = await requester.get('/current-ballot').set('Authorization', currentUserToken);

		expect(res).to.have.status(201);

		const ballot = await Ballot.findOne({ _id: res.body.savedBallot._id });

		expect(ballot?.ballot).to.haveOwnProperty('races');
		expect(ballot?.ballot).to.haveOwnProperty('ballotMeasures');
	});
});
