import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import blogReducer from './reducers/blogReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'
import usersReducer from './reducers/usersReducer'

const reducer = combineReducers({
  users: usersReducer,
  blogs: blogReducer,
  notification: notificationReducer,
  user: userReducer,
})
const store = createStore(reducer, applyMiddleware(thunk))

export default store