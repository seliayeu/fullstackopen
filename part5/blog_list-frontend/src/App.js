import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);  
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    console.log(loggedUserJSON);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user)
      //blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);

    try {
      const user = await loginService.login({
        username, password,
      });
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user));
    } catch (exception) {
      setNotification('Wrong credentials')
      setErrorStatus(true)
      setTimeout(() => {
        setNotification(null);
      }, 5000);

    }
  }

  const handleLogout = () => {
    window.localStorage.setItem('loggedBlogUser', null);
    setUser(null);
  } 

  const addBlog = async (event) => {
    event.preventDefault();
    console.log(`adding blog, title ${blogTitle}, author ${blogAuthor}, url ${blogUrl}`);
    const blog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    }
    console.log(user);
    try {
      await blogService.create(blog, user.token)
      const blogs = await blogService.getAll()
      setBlogs( blogs )
      setNotification(`new blog ${blogTitle} successfully added`)
      setErrorStatus(false)
      setTimeout(() => {
        setNotification(null);
      }, 5000);        

    } catch (exception) {
      console.log(exception)
      setNotification('wrong username or password')
      setErrorStatus(true)
      setTimeout(() => {
        setNotification(null);
      }, 5000);

    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>login</h2>
      <div>
        username
        <input
          type='text'
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='text'
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />          
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <div>
        title
        <input
          type='text'
          value={blogTitle}
          onChange={({ target }) => setBlogTitle(target.value)}        
        />
      </div>
      <div>
        author
        <input
          type='text'
          value={blogAuthor}
          onChange={({ target }) => setBlogAuthor(target.value)}        
        />
      </div>
      <div>
        url
        <input
          type='text'
          value={blogUrl}
          onChange={({ target }) => setBlogUrl(target.value)}        
        />                        
      </div>
      <button type="submit">submit</button>
    </form>
  )

  return (
    <div>
      <Notification message={notification} error={errorStatus} />
      {
        user === null || user === undefined ? 
          loginForm() :
          <div>
            <div>
              {user.name} logged in
              <button onClick={handleLogout}>
                logout
              </button>  
            </div>
              {blogForm()}
            <div>
            </div>
            <h2>blogs</h2>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
      }
    </div>
  )
}

export default App