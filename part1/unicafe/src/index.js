import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ text }) => (
  <>
    <h1>{text}</h1>
  </>
)

const Statistic = ({ label, total }) => (
  <>
    <tr>
      <td>{label}</td>
      <td>{total}</td>
    </tr>
  </>
)

const Button = ({ label, onClick }) => (
  <>
      <button onClick={onClick}>{label}</button>
  </>
)

const Statistics = ({ goodSum, neutralSum, badSum }) => {
  const calcAvg = (goodSum, neutralSum, badSum) => {
    if (goodSum + neutralSum + badSum === 0) {
      return "no data"
    }
    return (goodSum * 1 - badSum)/(goodSum + neutralSum + badSum)
  }

  const calcPos = (goodSum, total) => {
    if (total === 0) {
      return "no data"
    } 
    const str = (goodSum*100/total).toString()

    return str + "%"
  }  
  if (goodSum + neutralSum + badSum !== 0) {
  return (
    <table>
      <tbody>
      <Statistic label="good" total={goodSum}/>
      <Statistic label="neutral" total={neutralSum}/>
      <Statistic label="bad" total={badSum}/>
      <Statistic label="all" total={goodSum + neutralSum + badSum}/>
      <Statistic label="average" total={calcAvg(goodSum, neutralSum, badSum)}/>
      <Statistic label="positive" total={calcPos(goodSum, goodSum + neutralSum + badSum)}/>
      </tbody>
    </table>
  )} else {
    return (
      <p>no feedback given</p>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const onGood = () => {
    setGood(good + 1)
  }

  const onNeutral = () => {
    setNeutral(neutral+ 1)
  }

  const onBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <Header text="give feedback" />
      <Button onClick={onGood} label="good"/>
      <Button onClick={onNeutral} label="neutral"/>
      <Button onClick={onBad} label="bad"/>
      <Header text="statistics" />
      <Statistics goodSum={good} neutralSum={neutral} badSum={bad} />
    </div> 

  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)