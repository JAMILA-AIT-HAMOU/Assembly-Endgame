import Header from "./Header";
import { languages } from "./Languages.js";
import { useState } from "react";
import { clsx } from "clsx";

export default function AsssemblyEndGame() {
  // state values
  const [currentWord, setCurrentWord] = useState("react");
  const [guessedLetters, setGuessedLetters] = useState([]);

  // Derived values
  const wronGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wronGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;

  // static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
    );
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
        onClick={() => addGuessedLetter(letterKey)}
      >
        {letterKey.toUpperCase()}
      </button>
    );
  });

  const gameStatusClass=clsx("game-status", {
    won: isGameWon,
    lost: isGameLost
  })
  function rederGameStatus(){
    if(!isGameOver){
      return null
    }if(isGameWon){
      return (
            <>
              <h2>You Win!</h2>
              <p>Well done 🎉</p>
            </>
          )

    }else if(isGameLost){
      return (
            <>
              <h2>Game over!</h2>
              <p>You lose! Better start learning assembly 😢</p>
            </>
          )
  }}

  return (
    <main>
      <header>
        <h1> Assembly: Endgame </h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className={gameStatusClass}>
        {rederGameStatus()}
      </section>
      <section className="language-chips">{languagesElements}</section>
      <section className="word">{letterElements}</section>
      <section className="keyboard">{keyboardElements}</section>
      {isGameOver && <button className="new-game">New Game</button>}
    </main>
  );
}
