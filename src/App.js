import Header from "./Header";
import { languages } from "./Languages.js";
import { useState } from "react";
import { clsx } from "clsx";
import { getFarewellText, getRandomWord } from "./utils.js";

export default function AsssemblyEndGame() {
  // state values
  const [currentWord, setCurrentWord] = useState(()=>getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  // Derived values
  const numGuessesLeft=languages.length-1
  const wronGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wronGuessCount >= numGuessesLeft
  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);
  // static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
    );
  }
  function startNewGame(){
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
    
  }

  const languagesElements = languages.map((language, index) => {
    const islanguageLost = index < wronGuessCount;
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };
    const className = clsx("chip", islanguageLost && "lost");
    return (
      <span className={className} style={styles} key={language.name}>
        {language.name}
      </span>
    );
  });

  const letterElements = [...currentWord].map((letter, index) => {
    const capitalLetter = letter.toUpperCase();
    return (
      <span key={index}>
        {guessedLetters.includes(letter) ? capitalLetter : ""}
      </span>
    );
  });

  const keyboardElements = [...alphabet].map((letterKey) => {
    const isGuessed = guessedLetters.includes(letterKey);
    const isCorrect = isGuessed && currentWord.includes(letterKey);
    const isWrong = isGuessed && !currentWord.includes(letterKey);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        className={className}
        key={letterKey}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letterKey)}
        aria-label={`Letter ${letterKey}`}
        onClick={() => addGuessedLetter(letterKey)}
      >
        {letterKey.toUpperCase()}
      </button>
    );
  });

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell:!isGameOver && isLastGuessIncorrect
  });
  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return(
         <p className="farewell-message ">
          {getFarewellText(languages[wronGuessCount-1].name)}
         </p>
      )
      
    }
    if (isGameWon) {
      return (
        <>
          <h2>You Win!</h2>
          <p>Well done 🎉</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning assembly 😢</p>
        </>
      );
    }
    return null
  }

  return (
    <main>
      <header>
        <h1> Assembly: Endgame </h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section 
        aria-live="polite"
        role="status" 
        className={gameStatusClass}>{renderGameStatus()}
      </section>
      <section className="language-chips">{languagesElements}</section>
      <section className="word">{letterElements}</section>
      <section className="sr-only" 
        aria-live="polite"
        role="status" >
          <p>
            {currentWord.includes(lastGuessedLetter) ? `Correct: The letter ${lastGuessedLetter} is in the word` : `Sorry, the letter ${lastGuessedLetter} is not in the word`}
            You have {numGuessesLeft} attempts left
          </p>
          <p>Current word: {currentWord.split("").map(letter=>guessedLetters.includes(letter) ? letter + "." :"blank.").join(" ")}</p>
      </section>
      <section className="keyboard">{keyboardElements}</section>
      {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    </main>
  );
}
