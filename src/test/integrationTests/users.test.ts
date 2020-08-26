import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';

import { User } from '../../models';
import { userEmail, userPassword } from '../helpers/userData';

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

let createdUserId = '';
let userToken = '';

describe('All integrated user routes.', function () {
	before('Open everything', function () {});
	after('Close all connectuons', function (done) {
		User.findByIdAndDelete(createdUserId).then(() => {
			requester.close();
		});
		done();
	});
	describe('Create a user and check the DB.', function () {
		it('Should create a user and then retrieve user from the DB.', function () {
			return requester
				.post('/sign-up')
				.send({ email: userEmail, password: userPassword })
				.then((res) => {
					createdUserId = res.body._id;
					expect(res).to.have.status(201);
				})
				.then(() => {
					User.findOne({ _id: createdUserId }).then((user) => {
						if (user) {
							expect(user.email).to.equal(userEmail);
							expect(user.id).to.equal(createdUserId);
						}
					});
				});
		});
	});
});
