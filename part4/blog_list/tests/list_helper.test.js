const listHelper = require('../utils/list_helper');
const testHelper = require('./test_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(testHelper.listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(testHelper.initialBlogs);
    expect(result).toBe(36);
  });
});

describe('favorite blog', () => {
  test('of empty list is undefined', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(undefined);
  });

  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog(testHelper.listWithOneBlog);
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(testHelper.initialBlogs);
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });
});

describe('most blogs', () => {
  test('of empty list is undefined', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe(undefined);
  });

  test('when list has only one blog, equals author of that blog', () => {
    const result = listHelper.mostBlogs(testHelper.listWithOneBlog);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    });
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(testHelper.initialBlogs);
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});

describe('most likes', () => {
  test('of empty list is undefined', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe(undefined);
  });

  test('when list has only one blog, equals likes of that blog', () => {
    const result = listHelper.mostLikes(testHelper.listWithOneBlog);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(testHelper.initialBlogs);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});
