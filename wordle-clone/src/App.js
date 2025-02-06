import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [gameKey, setGameKey] = useState(Date.now());
  const [pressedKeys, setPressedKeys] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [invalidInput, setInvalidInput] = useState(false);
  const [wordToGuess] = useState("HELLO");
  const [gameOver, setGameOver] = useState(false);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const startNewGame = () => {
    setGameKey(Date.now());
    setPressedKeys("");
    setGuesses([]);
    setInvalidInput(false);
    setColors([]);
    setGameOver(false);
  };

  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (/[A-Z]/.test(key) && pressedKeys.length < 5) {
      setPressedKeys((prev) => prev + key);
      setInvalidInput(false);
    } else if (key === "Backspace" && pressedKeys.length > 0) {
      setPressedKeys(pressedKeys.slice(0, -1));
      setInvalidInput(false);
    } else if (key === "Enter" && pressedKeys.length === 5) {
      checkWord();
    } else {
      setInvalidInput(true);
    }
  };

  const checkWord = () => {
    const wordArray = pressedKeys.split("");
    let newColors = [];

    for (let i = 0; i < wordArray.length; i++) {
      if (wordArray[i] === wordToGuess[i]) {
        newColors.push("green");
      } else if (wordToGuess.includes(wordArray[i])) {
        newColors.push("yellow");
      } else {
        newColors.push("gray");
      }
    }

    setGuesses((prev) => [...prev, { word: pressedKeys, colors: newColors }]);
    setPressedKeys("");

    if (pressedKeys === wordToGuess) {
      setGameOver(true);
    } else if (guesses.length === 4) {
      setGameOver(true);
    }

    setColors(newColors);
  };

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="title">Wordle Clone</h1>

      <button className="new-game-btn" onClick={startNewGame}>
        New Game
      </button>

      <button className="instructions-btn" onClick={() => setShowPopup(true)}>
        Instructions
      </button>

      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {showPopup && (
        <div className="popup">
          <p>🟩 Green: Correct Letter & Position</p>
          <p>🟨 Yellow: Correct Letter, Wrong Position</p>
          <p>⬜ Gray: Letter Not in Word</p>
          <button className="close-popup" onClick={() => setShowPopup(false)}>
            X
          </button>
        </div>
      )}

      <div className="game-board" key={gameKey}>
        {Array.from({ length: 5 }).map((_, index) => {
          const guess = guesses[index];
          return (
            <div className="guess-row" key={index}>
              {(guess ? guess.word : "     ").split("").map((letter, i) => (
                <span
                  key={i}
                  className={`key-box ${guess ? guess.colors[i] : ""}`}
                >
                  {letter}
                </span>
              ))}
            </div>
          );
        })}

        <div className="current-input">
          {pressedKeys.split("").map((key, index) => (
            <span key={index} className="key-box">{key}</span>
          ))}
        </div>

        {invalidInput && <span className="invalid-warning">Invalid character!</span>}
        {gameOver && (
          <div className="game-over">
            {guesses[guesses.length - 1]?.word === wordToGuess
              ? "You Win!"
              : "Game Over!"}
          </div>
        )}
      </div>

      <div className="keyboard">
        {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.split("").map((key) => (
              <button
                className="key"
                key={key}
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
            {rowIndex === 2 && (
              <>
                <button
                  className="key enter"
                  onClick={() => handleKeyPress("Enter")}
                >
                  Enter
                </button>
                <button
                  className="key backspace"
                  onClick={() => handleKeyPress("Backspace")}
                >
                  ⌫
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;










































