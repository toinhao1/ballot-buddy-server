const { MongoClient } = require('mongodb');

describe('User model', () => {
	let connection;
	let db;

	beforeAll(async () => {
		connection = await MongoClient.connect(global.__MONGO_URI__, {
			useNewUrlParser: true,
		});
		db = connection.db(global.__MONGO_DB_NAME__);
	});
	afterAll(async () => {
		await connection.close();
		await db.close();
	});

	it('Should save a user', async () => {
		const users = db.collection('users');

		const user = {
			_id: 'some-user-id-2',
			firstName: 'Test first name',
			lastName: 'Test last name',
			email: 'test@example.com',
		};

		await users.insertOne(user);
		const insertedUser = await users.findOne({ _id: 'some-user-id-2' });

		expect(user).toMatchObject(insertedUser);

		expect(insertedUser.email).toBe('test@example.com');
	});

	it('should insert a doc into collection', async () => {
		const users = db.collection('users');

		const mockUser = { _id: 'some-user-id', name: 'John' };
		await users.insertOne(mockUser);

		const insertedUser = await users.findOne({ _id: 'some-user-id' });
		expect(insertedUser).toEqual(mockUser);
	});
});
