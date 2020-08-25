import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';
import { User } from '../../models';

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

let createdUserId = '';

describe('Testing all auth routes.', function () {
	before('Open everything', function () {
		// return mongoose.createConnection(String(process.env.))
	});

	after('Close all connectuons', function (done) {
		User.findByIdAndDelete(createdUserId).then(() => {
			requester.close();
		});
		done();
	});

	it('try to sign up with no input.', function () {
		return requester.post('/sign-up').then((res) => {
			expect(res).to.have.status(500);
		});
	});

	it('try to sign up with correct input.', function () {
		return requester
			.post('/sign-up')
			.send({ email: 'tester@testers.com', password: 'password' })
			.then((res) => {
				createdUserId = res.body._id;
				expect(res.body._id).to.not.be.null;
				expect(res).to.have.status(201);
			});
	});
});
