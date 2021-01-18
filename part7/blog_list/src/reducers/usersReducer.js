import userService from '../services/users'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT':
    return action.data
  default: return state
  }
}

export const initializeUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    console.log(users)
    dispatch({
      type: 'INIT',
      data: users ,
    })
  }
}

export default reducer