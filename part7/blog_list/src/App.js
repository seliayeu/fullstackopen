import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog, initializeBlogs, removeBlog, updateBlog, createComment } from './reducers/blogReducer'
import { login, logout, setUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import { setNotification } from './reducers/notificationReducer'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import User from './components/User'
import { Switch, Route, Link, useRouteMatch, useHistory } from 'react-router-dom'
import BlogView from './components/BlogView'
import UserView from './components/UserView'
import { Table, Navbar, Nav, Button } from 'react-bootstrap'

const App = () => {
  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)
  const notification = useSelector(state => state.notification)
  const user = useSelector(state => state.user)
  const history = useHistory()

  useEffect(() => {
    dispatch(initializeUsers())
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    console.log(loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('ww', user)
      dispatch(setUser(user))
    }
  }, [])

  const blogMatch = useRouteMatch('/blogs/:id')
  const userMatch = useRouteMatch('/users/:id')

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
      dispatch(removeBlog(blog, user.token))
      history.push('/')
      dispatch(setNotification('blog successfully deleted', 'NOTIFICATION', 5))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification('blog could not be deleted', 'ERROR', 5))
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    console.log('logging in with', event.target.password.value, event.target.username.value)
    event.target.password.value = ''
    event.target.username.value = ''

    try {
      dispatch(login(username, password))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification('wrong username or password', 'ERROR', 5))
    }
  }

  const incrementLikes = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    try {
      dispatch(updateBlog(updatedBlog, user))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification('blog could not be updated', 'ERROR', 5))
    }
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blog = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
    }

    event.target.url.title = ''
    event.target.url.value = ''
    event.target.url.author = ''

    console.log(user)
    try {
      blogFormRef.current()
      dispatch(createBlog(blog, user))
      dispatch(setNotification('blog successfully added', 'NOTIFICATION', 5))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification('blog could not be added', 'ERROR', 5))
    }
  }

  const routedBlog = () => {
    const blog = blogMatch ? (blogs.length > 0 && blogs.find(note => note.id === blogMatch.params.id)) : null
    if(blogMatch) {
      return(
        <BlogView
          key={blog.id}
          blog={blog}
          incrementLikes={incrementLikes}
          deleteBlog={deleteBlog}
          user={user}
          postComment={postComment}
        />
      )
    } else {
      return null
    }

  }

  const routedUser = () => {
    const user = userMatch ? users.find(user => user.id === userMatch.params.id) : null
    if (userMatch) {
      return (
        <UserView user={user} />
      )
    } else {
      return null
    }
  }

  const postComment = (blog, comment) => {
    try {
      dispatch(createComment(blog, comment))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification('wrong username or password', 'ERROR', 5))
    }
  }

  const listBlogs = () => {
    let sortedBlogs
    if (blogs.length > 0) {
      sortedBlogs = [...blogs]
    } else {
      sortedBlogs = []
    }
    sortedBlogs.sort(compareBlogs)
    return (
      <tbody>
        {
          sortedBlogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              incrementLikes={incrementLikes}
              deleteBlog={deleteBlog}
              user={user}
            />
          )}
      </tbody>
    )
  }

  const listUsers = () => {
    return (
      <tbody>
        <tr>
          <td>
            <b>users</b>
          </td>
          <td>
            <b>
              blogs posted
            </b>
          </td>
        </tr>
        {users.map(user =>
          <User key={user.id} user={user} />
        )}
      </tbody>
    )
  }

  const showNavbar = () => (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Nav className="mr-auto">
        <Nav.Link href="#" as="span">
          <Link to="/">blogs</Link>
        </Nav.Link>
        <Nav.Link href="#" as="span">
          <Link to="/users">users</Link>
        </Nav.Link>
      </Nav>
      <Nav>
        <p className='text-primary' style={ { textAlign: 'center' } }>{user.name} logged in</p>
        <Button id='logout-button' variant='light' onClick={handleLogout}>
          logout
        </Button>
      </Nav>
    </Navbar>
  )

  return (
    <div className="container">
      {notification ?
        <Notification message={notification.message} error={notification.error} /> : <></>
      }
      {
        user === null || user === undefined ?
          <LoginForm
            handleLogin={handleLogin}
          /> :
          <div>
            <div>
              {showNavbar()}
            </div>
            <Switch>
              <Route path="/blogs/:id">
                {routedBlog()}
              </Route>
              <Route path="/users/:id">
                {routedUser()}
              </Route>
              <Route path="/users">
                <Table striped>
                  {listUsers()}
                </Table>
              </Route>
              <Route path="/">
                <h2>blogs</h2>
                <Togglable buttonLabel='new blog' ref={blogFormRef}>
                  <BlogForm
                    addBlog={addBlog}
                  />
                </Togglable>
                <div id='blog-list'>
                  <Table striped>
                    {listBlogs()}
                  </Table>
                </div>
              </Route>
            </Switch>
          </div>
      }
    </div>
  )
}

export default App