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

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);


  const pickWordAndCategory = useCallback(() => {
    // pick random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    //console.log(category)

    // pick random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    //console.log(word)
    return { word, category }
  }, [words])

  // starts the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates()

    // pick word and pick category    
    const { word, category } = pickWordAndCategory();
    //console.log(category, word);

    // create array of leters
    let wordLetters = word.split('');
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    //console.log(wordLetters);

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory])

  // process the input letter
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter])
    } else {
      setWrongLetters((actualWrongLetters) => [...actualWrongLetters, normalizedLetter])

      // decrease guesses
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }
  // console.log(guessedLetters)
  // console.log(wrongLetters)

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // check win confition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => actualScore += 100)

      // restar the game
      startGame()
    }
    //console.log(uniqueLetters)
  }, [guessedLetters, letters, startGame])


  // process to start new game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }


  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen
        startGame={startGame} />}

      {gameStage === 'game' && (<Game
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score} />)}

      {gameStage === 'end' && <GameOver
        retry={retry}
        score={score} />}

    </div>
  )
}

export default App
