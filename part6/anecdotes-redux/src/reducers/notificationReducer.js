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

export const changeNotification = (content) => ({
  type: 'CHANGE',
  data: { content },
})

export const clearNotification = () => ({
  type: 'CLEAR',
})


export default reducer