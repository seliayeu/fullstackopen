import React, { useEffect } from 'react'
import Notification from '../components/Notification'
import { addVote, initializeAnecdotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdote)
  const filterString = useSelector(state => state.filter)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  const vote = (anecdote) => {
    console.log('vote', anecdote)
    dispatch(addVote(anecdote))
    dispatch(setNotification('vote successfully added', 3))
  }

  const listAnecdotes = () => {
    anecdotes.sort((a, b) => b.votes - a.votes)
    const filtered = anecdotes.filter((anecdote) => anecdote.content.includes(filterString))
    return(
      filtered.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote)}>vote</button>
        </div>
      </div>) 
    )
  }
  return (
    <div>
      <Notification />
      {listAnecdotes()}
    </div>
  )
}

export default AnecdoteList