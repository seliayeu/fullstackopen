let timeoutID = null

const reducer = (state = {}, action) => {
  switch (action.type) {
  case 'NOTIFICATION':
    return { message: action.data.content, error: false }
  case 'ERROR':
    return { message: action.data.content, error: true }
  case 'CLEAR':
    return null
  default:
    return state
  }
}

export const setNotification = (message, type, secs) => {
  return async (dispatch) => {
    if (type === 'ERROR') {
      dispatch({
        type: 'ERROR',
        data: { content: message },
      })
    } else {
      dispatch({
        type: 'NOTIFICATION',
        data: { content: message },
      })
    }
    timeoutID !== null && clearTimeout(timeoutID)

    timeoutID = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, secs * 1000)
  }
}

export default reducer