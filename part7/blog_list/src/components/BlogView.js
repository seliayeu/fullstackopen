import React from 'react'
import { Table, Tabs, Tab } from 'react-bootstrap'

const BlogView = ({ blog, incrementLikes, deleteBlog, user, postComment }) => {
  if (!blog) {
    return null
  }
  console.log(blog)

  const handleComment = (event) => {
    event.preventDefault()
    console.log(event.target)
    const comment = event.target.comment.value
    event.target.comment.value = ''

    postComment(blog, comment)
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <Tabs>
        <Tab eventKey="url" title="url">
          {blog.url}
        </Tab>
        <Tab eventKey="likes" title="likes">
          likes {blog.likes}
          <button id='like-button' onClick={(event) => {
            event.preventDefault()
            incrementLikes(blog)
          }}>
            like
          </button>
        </Tab>
        <Tab eventKey="user info" title="user info">
          {
            blog.user &&
              <div>
                {blog.user.username}
              </div>
          }
          {
            blog.user && user.username === blog.user.username ?
              <button id='remove-blog' onClick={(event) => {
                event.preventDefault()
                deleteBlog(blog)
              }}>remove</button> :
              <></>
          }
        </Tab>
      </Tabs>
      <h3>comments</h3>
      <Table striped bordered hover variant="dark">
        <tbody>
          {blog.comments.map((comment) => (
            <tr key={comment.id}><td>{comment.text}</td></tr>
          ))}
        </tbody>
      </Table>
      <form onSubmit={handleComment}>
        <input
          name='comment'
        />
        <button type="submit">
          submit
        </button>
      </form>
    </div>
  )
}

export default BlogView
