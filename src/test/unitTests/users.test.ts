import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';
import { User } from '../../models';

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

let createdUserId = '';
let userToken = '';

const userEmail = 'tester@testers.com';
const userPassword = 'password';

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
	describe('POST /sign-up', function () {
		it('try to sign up with no input.', function () {
			return requester.post('/sign-up').then((res) => {
				expect(res).to.have.status(500);
			});
		});

		it('try to sign up with only one input.', function () {
			return requester
				.post('/sign-up')
				.send({ email: userEmail })
				.then((res) => {
					expect(res).to.have.status(500);
				});
		});

		it('try to sign up with only one input.', function () {
			return requester
				.post('/sign-up')
				.send({ password: userPassword })
				.then((res) => {
					expect(res).to.have.status(500);
				});
		});

		it('try to sign up with correct input.', function () {
			return requester
				.post('/sign-up')
				.send({ email: userEmail, password: userPassword })
				.then((res) => {
					createdUserId = res.body._id;
					expect(res.body._id).to.not.be.null;
					expect(res).to.have.status(201);
				});
		});

		it('try to sign up with credentials that are already in use.', function () {
			return requester
				.post('/sign-up')
				.send({ email: userEmail, password: userPassword })
				.then((res) => {
					expect(res).to.have.status(400);
				});
		});
	});
	describe('POST /login', function () {
		it('should login a user with valid credentials.', function () {
			return requester
				.post('/login')
				.send({ email: userEmail, password: userPassword })
				.then((res) => {
					userToken = `Bearer ${res.body.token}`;
					expect(res.body.token).to.not.be.null;
					expect(res).to.have.status(200);
				});
		});

		it('should not login a user with an invalid email.', function () {
			return requester
				.post('/login')
				.send({ email: 'jdskjdf', password: userPassword })
				.then((res) => {
					expect(res.body.error).to.equal('Email not found.');
					expect(res).to.have.status(400);
				});
		});

		it('should not login a user with an invalid password.', function () {
			return requester
				.post('/login')
				.send({ email: userEmail, password: 'userPassword' })
				.then((res) => {
					expect(res.body.error).to.equal('Incorrect password');
					expect(res).to.have.status(400);
				});
		});
	});

	describe('PUT /update', function () {
		it('should update a user correctly.', function () {
			return requester
				.put('/update')
				.set('Authorization', userToken)
				.send({ email: 'updated@email.com' })
				.then((res) => {
					expect(res.body.updatedUser.email).to.equal('updated@email.com');
					expect(res).to.have.status(201);
				});
		});

		it('should not update a user when no token provided.', function () {
			return requester
				.put('/update')
				.set('Authorization', '43')
				.send({ email: 'updated@email.com' })
				.then((res) => {
					expect(res).to.have.status(401);
				});
		});

		it('should not update a user when no email is provided', function () {
			return requester
				.put('/update')
				.set('Authorization', userToken)
				.send({ email: '' })
				.then((res) => {
					expect(res).to.have.status(404);
				});
		});
	});
});
