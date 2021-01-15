let timeoutID = null

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'CHANGE':
      return action.data.content
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const setNotification = (message, secs) => {
  return async (dispatch) => {
    dispatch({
      type: 'CHANGE',
      data: { content: message },
    })
    
    timeoutID !== null && clearTimeout(timeoutID)

    timeoutID = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, secs * 1000)
  }
}

export default reducer