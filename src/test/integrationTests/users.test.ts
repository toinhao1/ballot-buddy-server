import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';

import { User } from '../../models';
import { userEmail, userPassword, getNewUserToken } from '../helpers/userData';

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

let createdUserId = '';
let fakeUserId = '';
let userToken = '';

describe('All integrated user routes.', function () {
	before('Open everything', function () {
		return getNewUserToken(requester).then((token) => {
			userToken = token;
		});
	});
	after('Close all connectuons', function (done) {
		const deleteFirstUser = User.findByIdAndDelete({ _id: createdUserId });
		const deleteSecondUser = User.findByIdAndDelete({ _id: fakeUserId });

		Promise.all([deleteFirstUser, deleteSecondUser])
			.then(() => {
				requester.close();
			})
			.catch((err) => {
				console.log(err);
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

		it('should update the user in the db and verify on the DB.', function () {
			return requester
				.put('/update')
				.set('Authorization', userToken)
				.send({ email: 'updated@email.com' })
				.then((res) => {
					fakeUserId = res.body.updatedUser._id;
					expect(res).to.have.status(201);
				})
				.then(() => {
					User.findOne({ _id: fakeUserId }).then((user) => {
						if (user) {
							expect(user.email).to.equal('updated@email.com');
							expect(user.id).to.equal(fakeUserId);
						}
					});
				});
		});
	});
});
