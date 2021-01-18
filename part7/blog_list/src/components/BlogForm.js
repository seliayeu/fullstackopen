import React from 'react'
import { Button, Form } from 'react-bootstrap'

const BlogForm = ({ addBlog }) => {
  return (
    <Form onSubmit={addBlog}>
      <h2>create blog</h2>
      <Form.Group>
        <Form.Label>title</Form.Label>
        <Form.Control name='title' type='text'/>
      </Form.Group>
      <Form.Group>
        <Form.Label>author</Form.Label>
        <Form.Control name='author' type='text'/>
      </Form.Group>
      <Form.Group>
        <Form.Label>url</Form.Label>
        <Form.Control name='url' type='text'/>
      </Form.Group>
      <Button id='submit-blog' type="submit">submit</Button>
    </Form>
  )
}

export default BlogForm