import { levels } from "./levels.js";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { getFarewellText, getRandomWord, getEncourageWord } from "./utils.js";
import Confetti from "react-confetti";

export default function AsssemblyEndGame() {
  // state values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [revealeWord, setRevealWord] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Derived values
  const numGuessesLeft = levels.length - 1;
  const wronGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wronGuessCount >= numGuessesLeft;
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
  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
    setHintUsed(false);
    setRevealWord("");
    setGameStarted(false)
  }
  function useHint() {
    if (hintUsed || isGameOver) return;
    // find unreveald letters
    const unreveald = currentWord
      .split("")
      .filter((letter) => !guessedLetters.includes(letter));

    if (unreveald.length === 0) return;
    const randomLetter =
      unreveald[Math.floor(Math.random() * unreveald.length)];
    // reveal it
    setGuessedLetters((prev) => [...prev, randomLetter]);
    // Mark hint as used
    setHintUsed(true);
  }

  const levelsElements = levels.map((level, index) => {
    const islevelLost = index < wronGuessCount;
    const styles = {
      backgroundColor: level.backgroundColor,
      color: level.color,
    };
    const className = clsx("chip", islevelLost && "lost");
    return (
      <span className={className} style={styles} key={level.name}>
        {level.name + level.icon}
      </span>
    );
  });

  // reveal the correct word
  useEffect(() => {
    if (isGameLost && revealeWord.length === 0) {
      const revealLetters = (index = 0) => {
        if (index < currentWord.length) {
          setRevealWord((prev) => prev + currentWord[index]);
          setTimeout(() => revealLetters(index + 1), 150);
        }
      };
      revealLetters();
    }
  }, [isGameLost, currentWord]);

  const letterElements = [...currentWord].map((letter, index) => {
    const capitalLetter = letter.toUpperCase();
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    );
    // if lost use animation
    if (isGameLost) {
      const animatedaletter = revealeWord[index] || "";
      return (
        <span key={index} className={letterClassName}>
          {animatedaletter.toUpperCase()}
        </span>
      );
    }

    const shouldRevealLetter = guessedLetters.includes(letter);

    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? capitalLetter : ""}
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
    farewell: !isGameOver && isLastGuessIncorrect,
    encourage: !isGameOver && !isLastGuessIncorrect,
  });
  function renderGameStatus() {
    if (!isGameOver && guessedLetters.length === 0) {
      return <p className="farewell-message">Are You Ready?</p>;
    }

    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message ">
          {getFarewellText(levels[wronGuessCount - 1].name)}
        </p>
      );
    }
    if (!isGameOver && !isLastGuessIncorrect) {
      return <p className="farewell-message ">{getEncourageWord()}</p>;
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
    return null;
  }

  // A thin bar start full and decrease with wrong guesses
  const maxGuesses = levels.length - 1;
  const progressPrecent = Math.max(
    0,
    ((maxGuesses - wronGuessCount) / maxGuesses) * 100
  );

  // Dynamic color
  let progressColor = "#4caf50";
  if (wronGuessCount >= maxGuesses - 1) {
    progressColor = " #f44336";
  } else if (wronGuessCount > maxGuesses / 2) {
    progressColor = "#ff9800";
  } else if (wronGuessCount > maxGuesses / 3) {
    progressColor = "#b3ff00ff";
  }

  return (
    <>
    {/* start screen */}
      {!gameStarted && 
        <div className="start-screen">
            <h1> Assembly: Endgame </h1>
            <p>Are you ready to test your memory?</p>
            <button className="start-btn" onClick={()=>{setGameStarted(true)}}>
              Start Game
            </button>

        </div>
      }

    {/*  the main game */}
      {gameStarted && (
        <main>
          {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}

          <header>
            <h1> Assembly: Endgame </h1>
            <p>
              You have 8 chances to guess the word - every wrong letter costs
              you one level !!!.
            </p>
          </header>
          <section aria-live="polite" role="status" className={gameStatusClass}>
            {renderGameStatus()}
          </section>
          <section className="level-chips">{levelsElements}</section>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${progressPrecent}%`,
                backgroundColor: progressColor,
              }}
            ></div>
          </div>
          <section className="word">{letterElements}</section>
          <section className="sr-only" aria-live="polite" role="status">
            <p>
              {currentWord.includes(lastGuessedLetter)
                ? `Correct: The letter ${lastGuessedLetter} is in the word`
                : `Sorry, the letter ${lastGuessedLetter} is not in the word`}
              You have {numGuessesLeft} attempts left
            </p>
            <p>
              Current word:{" "}
              {currentWord
                .split("")
                .map((letter) =>
                  guessedLetters.includes(letter) ? letter + "." : "blank."
                )
                .join(" ")}
            </p>
          </section>
          {!isGameOver && (
            <button className="hint-btn" onClick={useHint} disabled={hintUsed}>
              {hintUsed ? "Hint Used" : "Use Hint"}
            </button>
          )}
          <section className="keyboard">{keyboardElements}</section>
          {isGameOver && (
            <button className="new-game" onClick={startNewGame}>
              New Game
            </button>
          )}
        </main>
      )}
    </>
  );
}
