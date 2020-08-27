import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';

import { User } from '../../models';
import { getNewUserToken } from '../helpers/userData';
import { userEmail, userPassword } from '../helpers/seeds';

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

let createdUserId = '';
let fakeUserId = '';
let userToken = '';

describe('All integrated user routes.', function () {
	before('Open everything', async function () {
		const token = await getNewUserToken(requester);
		userToken = token;
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
		it('Should create a user and then retrieve user from the DB.', async function () {
			const res = await requester
				.post('/sign-up')
				.send({ email: userEmail, password: userPassword });

			createdUserId = res.body._id;
			expect(res).to.have.status(201);

			const user = await User.findOne({ _id: createdUserId });

			if (user) {
				expect(user.email).to.equal(userEmail);
				expect(user.id).to.equal(createdUserId);
			}
		});

		it('should update the user in the db and verify on the DB.', async function () {
			const res = await requester
				.put('/update')
				.set('Authorization', userToken)
				.send({ email: 'updated@email.com' });

			fakeUserId = res.body.updatedUser._id;
			expect(res).to.have.status(201);

			const user = await User.findOne({ _id: fakeUserId });

			if (user) {
				expect(user.email).to.equal('updated@email.com');
				expect(user.id).to.equal(fakeUserId);
			}
		});
	});
});
