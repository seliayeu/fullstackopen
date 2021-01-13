import React, { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorStatus, setErrorStatus] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort(compareBlogs)
      console.log(blogs)
      setBlogs( blogs )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    console.log(loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      //blogService.setToken(user.token)
      console.log(user)
    }
  }, [])

  const compareBlogs = (a, b) => {
    if (a.likes < b.likes) {
      return 1
    } else if (a.likes > b.likes) {
      return -1
    } else {
      return 0
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.remove(blog, user.token)
      setBlogs(blogs.filter((b) => b.id !== blog.id ))
      setNotification('blog successfully deleted')
      setErrorStatus(false)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      console.error(exception)
      setNotification('blog could not be deleted')
      setErrorStatus(true)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
    } catch (exception) {
      setNotification('wrong username or password')
      setErrorStatus(true)
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    }
  }

  const incrementLikes = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    try {
      await blogService.update(updatedBlog, user.token)
      const blogList = blogs.map((blog) => blog.id !== updatedBlog.id ? blog : updatedBlog )
      blogList.sort(compareBlogs)
      setBlogs(blogList)
    } catch (exception) {
      console.error(exception)
      setNotification('blog data could not be updated')
      setErrorStatus(true)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.setItem('loggedBlogUser', null)
    setUser(null)
  }

  const addBlog = async (blog) => {
    console.log(user)
    try {
      blogFormRef.current()
      let newBlog = await blogService.create(blog, user.token)
      newBlog.user = { username: user.username, name: user.name }
      const blogList = blogs.concat(newBlog)
      blogList.sort(compareBlogs)
      setBlogs(blogList)
      setErrorStatus(false)
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch (exception) {
      console.error(exception)
      setNotification('blog could not be added')
      setErrorStatus(true)
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    }
  }

  return (
    <div>
      <Notification message={notification} error={errorStatus} />
      {
        user === null || user === undefined ?
          <LoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
          /> :
          <div>
            <div>
              {user.name} logged in
              <button id='logout-button' onClick={handleLogout}>
                logout
              </button>
            </div>
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
              <BlogForm
                addBlog={addBlog}
              />
            </Togglable>
            <div>
            </div>
            <h2>blogs</h2>
            <div id='blog-list'>
              {blogs.map(blog =>
                <Blog
                  key={blog.id}
                  blog={blog}
                  incrementLikes={incrementLikes}
                  deleteBlog={deleteBlog}
                  user={user}
                />
              )}
            </div>
          </div>
      }
    </div>
  )
}

export default App