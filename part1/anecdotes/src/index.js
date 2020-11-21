import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ text }) => (
  <>
    <h1>{text}</h1>
  </>
)

const App = (props) => {
    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0])

    const onVote = () => {
      const arrCopy = Array.from(votes)
      arrCopy[selected] += 1
      setVotes(arrCopy)
    }

    const changeAnecdote = () => {
        setSelected(Math.floor(Math.random() * 6))
    }

    const getAnecdote = () => {
      let max = 0
      const len = votes.length      
      for (let i = 0; i < len; i++) {
        if (votes[i] >= votes[max]) {
          max = i
        }
      }

      return max  
    }

    return (
      <>
        <Header text="anecdote of the day"/>
        <div>
          {props.anecdotes[selected]}
        </div>
        <div>
          has votes {votes[selected]} votes
        </div>
        <button onClick={changeAnecdote}>next anecdote</button>
        <button onClick={onVote}>vote</button>
        <Header text="anecdote with the most votes"/>
        <div>
          {props.anecdotes[getAnecdote()]}
        </div>
        <div>
          has votes {votes[selected]} votes
        </div>        
      </>
    )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
    <App anecdotes={anecdotes} />,
    document.getElementById('root')
)