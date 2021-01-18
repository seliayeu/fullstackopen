import blogService from '../services/blogs'

const reducer = (state = [], action) => {
  console.log(action)
  switch (action.type) {
  case 'TOGGLE':
    return state.map((blog) => blog.id === action.data.id ? { ...blog, visible: !blog.visible } : blog)
  case 'REMOVE':
    console.log(action)
    return state.filter((blog) => blog.id !== action.data.blog.id )
  case 'UPDATE':
    return state.map((blog) => blog.id !== action.data.blog.id ? blog : { ...action.data.blog, visible: true } )
  case 'CREATE':
    return state.concat({ ...action.data.createdBlog, visible: true , user: { username: action.data.user.username, id: action.data.user.id } } )
  case 'INIT_BLOG':
    return action.data.map((blog) => ({ ...blog, visible: true }))
  default: return state
  }
}

export const toggleVisibility = (id) => {
  console.log('called with ', id)
  return({
    type: 'TOGGLE',
    data: { id, }
  })
}

export const initializeBlogs =  () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOG',
      data: blogs,
    })
  }
}

export const updateBlog = (blog, user) => {
  return async dispatch => {
    const updatedBlog = await blogService.update(blog, user.token)
    dispatch({
      type: 'UPDATE',
      data: { blog: updatedBlog, user },
    })
  }
}

export const createComment = (blog, comment) => {
  return async dispatch => {
    const uploaded = await blogService.comment(blog, comment)
    const data = uploaded.data
    const updatedBlog = { ...blog, comments: blog.comments.concat({ id: data.id, text: data.text }) }
    console.log(updatedBlog)
    dispatch({
      type: 'UPDATE',
      data: { blog: updatedBlog },
    })
  }
}

export const createBlog = (blog, user) => {
  return async dispatch => {
    const createdBlog = await blogService.create(blog, user.token)
    dispatch({
      type: 'CREATE',
      data: { createdBlog, user },
    })
  }
}

export const removeBlog = (blog, token) => {
  console.log(blog)
  return async dispatch => {
    await blogService.remove(blog, token)
    console.log(blog)
    dispatch({
      type: 'REMOVE',
      data: { blog },
    })
  }
}

export default reducer