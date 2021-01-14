import React from 'react'
import Notification from '../components/Notification'
import { addVote } from '../reducers/anecdoteReducer'
import { changeNotification, clearNotification } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdote)
  const filterString = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    dispatch(addVote(id))
    notify('vote sucessfully added!')
    setTimeout(() => {
      removeNotification()
    }, 5000)
  }

  const notify = (content) => {
    dispatch(changeNotification(content))
  }

  const removeNotification = () => {
    dispatch(clearNotification())
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
          <button onClick={() => vote(anecdote.id)}>vote</button>
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