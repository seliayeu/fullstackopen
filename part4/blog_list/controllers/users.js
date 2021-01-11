const bcrypt = require('bcryptjs');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.post('/', async (request, response) => {
  const body = request.body;
  if (body.username.length < 3 || body.password.length < 3) {
    response.status(422).send({ error: 'username or password too short' });
  } else {
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.json(savedUser);
  }
});

userRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs',
      {
        url: 1,
        title: 1,
        author: 1,
        id: 1,
      });
  response.json(users);
});

module.exports = userRouter;
