import React, { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const clearAll = () => {
    setBlogUrl('')
    setBlogTitle('')
    setBlogAuthor('')
  }

  return (
    <form onSubmit={(event) => {
      event.preventDefault()
      addBlog({
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
      })
      clearAll()
    }}>
      <h2>create blog</h2>
      <div>
        title
        <input
          id='title'
          type='text'
          value={blogTitle}
          onChange={({ target }) => setBlogTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          id='author'
          type='text'
          value={blogAuthor}
          onChange={({ target }) => setBlogAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          id='url'
          type='text'
          value={blogUrl}
          onChange={({ target }) => setBlogUrl(target.value)}
        />
      </div>
      <button id='submit-blog' type="submit">submit</button>
    </form>
  )
}

export default BlogForm