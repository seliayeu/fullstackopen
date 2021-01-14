const reducer = (state='', action) => {
  switch (action.type) {
    case 'UPDATE':
      return action.data.filterString
    default:
      return state
  }
}

export const updateFilterString = (content) => ({
  type: 'UPDATE',
  data: {
    filterString: content,
  }
})

export default reducer