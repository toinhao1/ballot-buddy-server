import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../server';
import { getOldUserToken } from '../helpers/userData';
import { candidateId, office } from '../helpers/seeds';
import { Politicians } from '../../models';

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

let currentUserToken = '';
let repToDelete = '15723';

describe('Testing all rep routes.', function () {
	before('Open everything', async function () {
		const token = await getOldUserToken(requester);
		currentUserToken = token;
	});

	after('Close all connectuons', function (done) {
		Politicians.findOneAndDelete({ candidateId: repToDelete }).then(() => {
			requester.close();
		});
		done();
	});

	it('Should return an object of representatives.', async function () {
		const res = await requester
			.get('/current-representatives')
			.set('Authorization', currentUserToken);

		expect(res.body.message).to.equal('Here are your reps!');
		expect(res.body.data.length).to.be.greaterThan(1);
		expect(res).to.have.status(200);
	});

	it('Should throw an error with status code 401.', async function () {
		const res = await requester.get('/current-representatives');
		expect(res).to.have.status(401);
	});

	it('Should get all data about a certain rep with status 200.', async function () {
		const res = await requester
			.post('/current-representative/office-data')
			.set('Authorization', currentUserToken)
			.send({ isForBallot: true, data: { candidate_id: candidateId, office } });

		expect(res.body).to.haveOwnProperty('addressData');
		expect(res.body).to.haveOwnProperty('additionalData');
		expect(res.body).to.haveOwnProperty('newsArticles');
		expect(res).to.have.status(200);
	});

	it('Should get all data about a certain rep with status 201.', async function () {
		const res = await requester
			.post('/current-representative/office-data')
			.set('Authorization', currentUserToken)
			.send({ isForBallot: false, data: { candidate_id: repToDelete, office } });

		expect(res.body).to.haveOwnProperty('addressData');
		expect(res.body).to.haveOwnProperty('additionalData');
		expect(res.body).to.haveOwnProperty('newsArticles');
		expect(res).to.have.status(201);
	});

	it('Should be rejected with status 401.', async function () {
		const res = await requester
			.post('/current-representative/office-data')
			.send({ isForBallot: false, data: { candidate_id: repToDelete, office } });
		expect(res.body).to.not.haveOwnProperty('addressData');
		expect(res).to.have.status(401);
	});

	it('Should throw an error with status 400.', async function () {
		const res = await requester
			.post('/current-representative/office-data')
			.set('Authorization', currentUserToken)
			.send({ isForBallot: false });
		expect(res).to.have.status(400);
	});

	it('Should throw an error with status 400.', async function () {
		const res = await requester
			.post('/current-representative/office-data')
			.set('Authorization', currentUserToken)
			.send({});
		expect(res).to.have.status(400);
	});
});
