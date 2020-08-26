import ChaiHttp from 'chai-http';
import { internet } from 'faker';

export const userEmail = 'tester@testers.com';
export const userPassword = 'password';

export const getOldUserToken = (requester: ChaiHttp.Agent): Promise<string> => {
	return requester
		.post('/login')
		.send({
			email: 'test@test.com',
			password: '123456789',
		})
		.then((res) => {
			return `Bearer ${res.body.token}`;
		});
};

export const getNewUserToken = (requester: ChaiHttp.Agent): Promise<string> => {
	const email = internet.email();
	const password = internet.password();

	return requester
		.post('/sign-up')
		.send({
			email: email,
			password: password,
		})
		.then((res) => {
			return requester
				.post('/login')
				.send({
					email: email,
					password: password,
				})
				.then((res) => {
					return `Bearer ${res.body.token}`;
				});
		});
};
