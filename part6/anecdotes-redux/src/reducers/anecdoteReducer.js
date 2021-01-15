import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD':
      return state.concat(action.data);
    case 'VOTE':
      return state.map((a) => a.id === action.data.id ? { 'content': a.content, 'id': a.id, 'votes': a.votes + 1 } : a )
    case 'INIT':
      return action.data
    default:
      return state
  } 
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'ADD',
      data: newAnecdote,
    })
  }
}

export const addVote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.updateOne({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch({
      type: 'VOTE',
      data: updatedAnecdote,
    })
  }
}

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT',
      data: anecdotes,
    })
  }
}

export default reducer