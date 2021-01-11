const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../app');
const testHelper = require('./test_helper');
const User = require('../models/user');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('testpass', 10);
  const user = new User({ username: 'test', passwordHash });
  await user.save();

  await Blog.deleteMany({});
  console.log('cleared');

  const blogs = testHelper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogs.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('fetching blogs', () => {
  test('blogs are successfully fetched with HTTP GET', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('correct number of blogs is fetched', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(testHelper.initialBlogs.length);
  });

  test('fetch fails if blog doesn\'t exist', async () => {
    const nonExistingId = await testHelper.nonExistingId();

    await api
      .get(`/api/notes/${nonExistingId}`)
      .expect(404);
  });

  test('returned blogs contain specific blog', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body.map((blog) => ({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      __v: blog.__v,
    }));
    expect(blogs).toContainEqual(testHelper.initialBlogs[0]);
  });
});

test('blog\'s unique identifier property is id instead of _id', async () => {
  const response = await api.get('/api/blogs');
  const blog = response.body[0];
  expect(blog.id).toBeDefined();
  expect(blog._id).not.toBeDefined();
});

describe('blog creation', () => {
  test('blogs can be successfully created', async () => {
    const users = await User.find({});
    const user = users[0];
    const userToken = jwt.sign({
      username: user.username,
      id: user.id,
    }, process.env.SECRET);
    const newBlog = {
      title: 'interesting: the noun',
      author: 'Timmy Thomas',
      url: 'uh',
      likes: 12,
      __v: 0,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('authorization', (`bearer ${userToken}`))
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const blogs = response.body.map((blog) => ({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      __v: blog.__v,
    }));
    expect(blogs).toHaveLength(testHelper.initialBlogs.length + 1);
    expect(blogs).toContainEqual(newBlog);
  });

  test('blogs cannot be successfully created if token is empty or incorrect, 401 is instead returned', async () => {
    const newBlog = {
      title: 'interesting: the noun',
      author: 'Timmy Thomas',
      url: 'uh',
      likes: 12,
      __v: 0,
    };

    const initialBlogs = await testHelper.blogsInDb();

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('authorization', ('bearer test'))
      .expect(401);

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);

    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('blog with unspecified likes is saved with 0 likes', async () => {
    const users = await User.find({});
    const user = users[0];
    const userToken = jwt.sign({
      username: user.username,
      id: user.id,
    }, process.env.SECRET);

    const newBlog = {
      title: 'cool: the noun',
      author: 'Tommy Thimus',
      url: 'uhh',
      __v: 0,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('authorization', (`bearer ${userToken}`))
      .expect(201);

    const response = await api.get('/api/blogs');
    expect(response.body[response.body.length - 1].likes).toEqual(0);
  });

  test('blog with missing title or url isn\'t saved when created by logged in user', async () => {
    const users = await User.find({});
    const user = users[0];
    const userToken = jwt.sign({
      username: user.username,
      id: user.id,
    }, process.env.SECRET);
    const missingTitle = {
      author: 'Gouglas Thimus',
      url: 'uhh',
      __v: 0,
    };
    const missingUrl = {
      title: 'awesome: the noun',
      author: 'Doug Thimus',
      __v: 0,
    };
    await api
      .post('/api/blogs')
      .send(missingUrl)
      .set('authorization', (`bearer ${userToken}`))
      .expect(400);
    await api
      .post('/api/blogs')
      .send(missingTitle)
      .set('authorization', (`bearer ${userToken}`))
      .expect(400);
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(testHelper.initialBlogs.length);
  });
});

test('note is successfully deleted', async () => {
  const users = await User.find({});
  const user = users[0];
  const userToken = jwt.sign({
    username: user.username,
    id: user.id,
  }, process.env.SECRET);
  const newBlog = new Blog({
    title: 'aye aye capn',
    author: 'wwwww',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
    user: user.id,
  });
  const result = await newBlog.save();
  user.blogs = user.blogs.concat(result.id);
  await user.save();
  const initialBlogs = await testHelper.blogsInDb();

  await api
    .delete(`/api/blogs/${newBlog.id}`)
    .set('authorization', (`bearer ${userToken}`))
    .expect(204);

  let endBlogs = await testHelper.blogsInDb();

  expect(endBlogs).toHaveLength(initialBlogs.length - 1);

  endBlogs = endBlogs.map((blog) => ({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    __v: blog.__v,
  }));

  expect(endBlogs).not.toContainEqual(initialBlogs[0]);
});

test('blog is successfully updated', async () => {
  const initialBlogs = await testHelper.blogsInDb();
  let blogToUpdate = initialBlogs[0];
  blogToUpdate = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate);

  const endBlogs = await testHelper.blogsInDb();
  expect(endBlogs[0].likes).toEqual(blogToUpdate.likes);
});

afterAll(() => {
  mongoose.connection.close();
});
