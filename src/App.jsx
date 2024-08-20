// css
import './App.css'

// data
import { wordsList } from './data/words'

// hooks
import { useCallback, useEffect, useState } from 'react'

// components
import Game from './components/Game'
import GameOver from './components/GameOver'
import StartScreen from './components/StartScreen'

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  // starts the secret word game
  const startGame = () => {
    setGameStage(stages[1].name)
  }

  // process the input letter
  const verifyLetter = () => {
    setGameStage(stages[2].name)
  }

  // process to start new game
  const retry = () => {
    setGameStage(stages[0].name)
  }


  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} />}
      {gameStage === 'end' && <GameOver retry={retry} />}

    </div>
  )
}

export default App
