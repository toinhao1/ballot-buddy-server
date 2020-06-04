import request from 'supertest'
import app from '../../app'
import User from '../../models/User'
import userFixture from '../fixtures/userDB'

describe("All user related tests", () => {
  beforeEach(() => {
    userFixture.setupDatabase()
  });
  it('Should signup a new user', async (done) => {
    try {
      const response = await request(app)
        .post('/user/sign-up')
        .expect(201);
      // Assert that DB was changed correctly
      const user = await User.findById(response.body.user._id);
      expect(user).not.toBeNull();

      if (!user) {
        throw new Error('No user was returned.')
      }
      expect(user.password).not.toBe('skdnekudfui324');
      done()
    } catch (err) {
      done(err)
    }
  });
})



