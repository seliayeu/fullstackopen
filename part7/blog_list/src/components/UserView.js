import React from 'react'

const UserView = ({ user }) => {
  if (!user) {
    return null
  }
  const writeBlogs = () => {
    return (user.blogs.map((blog) => (
      <li key={blog.id}>{blog.title} by {blog.author}</li>
    )))
  }
  return (
    <div>
      <h2>{user.username} : {user.blogs.length}</h2>
      <ul>
        {writeBlogs()}
      </ul>
    </div>
  )
}

export default UserView
