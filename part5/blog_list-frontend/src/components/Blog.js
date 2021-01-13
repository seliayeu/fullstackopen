import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, incrementLikes, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const toggleVisibility = (event) => {
    event.preventDefault()
    console.log(blog.user)
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <span>{blog.title} by {blog.author}</span>
      <button id='show-blog-info' onClick={toggleVisibility}>{visible ? <>hide</> : <>show</>}</button>
      { visible &&
      <div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes}
          <button id='like-button' onClick={(event) => {
            event.preventDefault()
            incrementLikes(blog)
          }}>
            like
          </button>
        </div>
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
      </div>
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  incrementLikes: PropTypes.func.isRequired,
  deleteBlog:PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog
