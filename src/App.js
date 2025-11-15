import Header from "./Header";
import { languages } from "./Languages.js";
import { useState } from "react";

export default function AsssemblyEndGame() {
  // the states
  const [currentWord, setCurrentWord] = useState("react");
  const [guessedLetters, setGuessedLetters] = useState([]);
  console.log(guessedLetters);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
    );
  }

  const languagesElements = languages.map((language) => {
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };
    return (
      <span className="chip" style={styles} key={language.name}>
        {language.name}
      </span>
    );
  });

  const letterElements = [...currentWord].map((letter, index) => {
    const capitalLetter = letter.toUpperCase();
    return <span key={index}>{capitalLetter}</span>;
  });

  const keyboardElements = [...alphabet].map((letterKey) => {
    const letter = letterKey.toUpperCase();
    return (
      <button key={letter} onClick={() => addGuessedLetter(letter)}>
        {letter}
      </button>
    );
  });

  return (
    <main>
      <header>
        <h1> Assembly: Endgame </h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className="game-status">
        <h2>You Win!</h2>
        <p>Well done 🎉</p>
      </section>
      <section className="language-chips">{languagesElements}</section>
      <section className="word">{letterElements}</section>
      <section className="keyboard">{keyboardElements}</section>
      <button className="new-game">New Game</button>
    </main>
  );
}
