const commentsRouter = require('express').Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');

commentsRouter.post('/api/blogs/:id/comments', async (request, response) => {
  const body = request.body;

  const comment = new Comment({
    text: body.text,
    blog: request.params.id,
  });

  const result = await comment.save();
  const blog = await Blog.findById(request.params.id);
  console.log(request.params.id);
  console.log('COMMENTS');
  console.log(blog);
  blog.comments = blog.comments.concat(result.id);
  await blog.save();
  response.status(201).json(comment);
});

commentsRouter.get('/api/blogs/:id/comments', async (request, response) => {
  const comments = await Comment
    .find({ blog: request.params.id });
  response.json(comments);
});

module.exports = commentsRouter;
