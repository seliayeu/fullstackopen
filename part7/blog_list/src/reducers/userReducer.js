import loginService from '../services/login'

const reducer = (state = null, action) => {
  console.log(action)
  switch (action.type) {
  case 'LOGIN':
    console.log('bbb')
    console.log(action.data.user)
    return action.data.user
  case 'LOGOUT':
    return null
  default: return state
  }
}

export const login = (username, password) => {
  return async dispatch => {
    console.log('login with ', username, password)
    const user = await loginService.login({ username, password, })
    window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
    console.log(user)
    dispatch({
      type: 'LOGIN',
      data: { user },
    })
  }
}

export const logout = () => {
  window.localStorage.setItem('loggedBlogUser', null)
  return {
    type: 'LOGOUT',
  }
}

export const setUser = (user) => ({
  type: 'LOGIN',
  data: { user }
})

export default reducer