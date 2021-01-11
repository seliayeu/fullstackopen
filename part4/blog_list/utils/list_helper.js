const lodash = require('lodash');

const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((accumulator, blog) => blog.likes + accumulator, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const favorite = blogs.reduce((max, blog) => (
    blog.likes < max.likes ? max : blog
  ), blogs[0]);

  return { title: favorite.title, author: favorite.author, likes: favorite.likes };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const authorCounts = lodash.countBy(blogs, (blog) => blog.author);
  const mostAuthor = Object.keys(authorCounts).reduce((max, current) => (
    authorCounts[current] < authorCounts[max] ? max : current
  ), Object.keys(authorCounts)[0]);

  return { author: mostAuthor, blogs: authorCounts[mostAuthor] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const authorLikes = blogs.reduce((aggObject, blog) => {
    if (Object.keys(aggObject).includes(blog.author)) {
      return { ...aggObject, [blog.author]: aggObject[blog.author] + blog.likes };
    }

    return { ...aggObject, [blog.author]: blog.likes };
  }, []);

  const mostAuthor = Object.keys(authorLikes).reduce((max, current) => (
    authorLikes[current] < authorLikes[max] ? max : current
  ), Object.keys(authorLikes)[0]);

  return { author: mostAuthor, likes: authorLikes[mostAuthor] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
