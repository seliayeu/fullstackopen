const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app');
const testHelper = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);
beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('testpass', 10);
  const user = new User({ username: 'cooluser', passwordHash });

  await user.save();
});
describe('when one user in db', () => {
  test('creation succeeds with one user', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const user = {
      username: 'bobbathy222',
      name: 'johno',
      password: 'steamedHams222222222',
    };

    await api
      .post('/api/users')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(user.username);
  });

  test('creation fails with 422 when user\'s name or password is too short', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const shortUsername = {
      username: 'ob',
      name: 'johno',
      password: 'steamedHams222222222',
    };

    const shortPassword = {
      username: 'bobbathy222',
      name: 'johno',
      password: 'ea',
    };

    await api
      .post('/api/users')
      .send(shortUsername)
      .expect(422);

    await api
      .post('/api/users')
      .send(shortPassword)
      .expect(422);

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with 400 when username is not unique', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const cooluser = {
      username: 'cooluser',
      name: 'johno',
      password: 'steamedHams222222222',
    };

    await api
      .post('/api/users')
      .send(cooluser)
      .expect(400);

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
