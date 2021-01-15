import React, { useEffect } from 'react'
import Notification from '../components/Notification'
import { addVote, initializeAnecdotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

const AnecdoteList = (props) => {
  const anecdotes = props.anecdotes
  const filterString = props.filterString
  let filtered;
  useEffect(() => {
    props.initializeAnecdotes()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps  


  const vote = (anecdote) => {
    console.log('vote', anecdote)
    props.addVote(anecdote)
    props.setNotification('vote successfully added', 3)
  }

  const listAnecdotes = () => {
    anecdotes.sort((a, b) => b.votes - a.votes)
    if (filterString !== undefined) {
      filtered = anecdotes.filter((anecdote) => anecdote.content.includes(filterString))
    } else {
      filtered = anecdotes
    }
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

const mapStateToProps = (state) => {
  console.log(state)
  return {
  anecdotes: state.anecdote,
  filterString: state.filter,
  }
}

const mapDispatchToProps = {
  addVote,
  initializeAnecdotes, 
  setNotification,  
}

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdoteList