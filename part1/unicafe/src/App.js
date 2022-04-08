import { useState } from 'react'
import './App.css'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div className='mainContainer'>
      <h1>give feedback</h1>

      <div className='buttonContainer'>
        <Button text='good' handler={() => setGood(good+1)}/>
        <Button text='neutral' handler={() => setNeutral(neutral+1)}/>
        <Button text='bad' handler={() => setBad(bad+1)}/>
      </div>

      {(good > 0 || neutral > 0 || bad > 0) ?
        <Statistics good={good} neutral={neutral} bad={bad}/>
        :
        <p>No feedback given</p>
      }

    </div>
  )
}

const Button = ({ text, handler}) => {
  return (
    <div>
      <button onClick={handler}>
        {text}
      </button>
    </div>
  )
}

const Statistics = ({ good, neutral, bad }) => {

  function getAverage(good, neutral, bad) {
    let score = 1*good - 1*bad
    return score / (good+neutral+bad)
  }

  return (
    <div className='statisticsContainer'>
      <h1> statistics </h1>
        <table>
          <tbody>
            <tr>
              <td>good</td><td>{good}</td>
            </tr>
            <tr>
              <td>neutral</td><td>{neutral}</td>
            </tr>
            <tr>
              <td>bad</td><td>{bad}</td>
            </tr>
            <tr>
              <td>average</td><td>{getAverage(good,neutral,bad)}</td>
            </tr>
            <tr>
              <td>positive</td><td>{(good / (good+neutral+bad)) * 100}%</td>
            </tr>
          </tbody>

        </table>
          {/*
          <p>
            good {good}
          </p>
          <p>   
            neutral {neutral}
          </p>
          <p>
            bad {bad}
          </p>
          <p>
            all {good+neutral+bad}
          </p>
          <p>
            average {getAverage(good, neutral, bad)}
          </p>
          <p>
            positive {(good / (good+neutral+bad)) * 100}%
          </p>
          */}
    </div>
  )
}

export default App