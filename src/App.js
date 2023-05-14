import React, { useState } from "react";

const generateRandomNumber = () => {
  const digits = [];
  while (digits.length < 4) {
    const digit = Math.floor(Math.random() * 10);
    if (!digits.includes(digit)) {
      digits.push(digit);
    }
  }
  return digits.join("");
};

const Game = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState(generateRandomNumber());
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [bestScore, setBestScore] = useState(null);

  const handleNewGame = () => {
    const newName = prompt("Enter your name:");
    setName(newName);
    setNumber(generateRandomNumber());
    setGuess("");
    setResult("");
    setGuessCount(0);
  };

  const handleGuess = () => {
    // Validate the user's guess
    if (!/^\d{4}$/.test(guess) || new Set(guess.split("")).size < 4) {
      alert(
        "Invalid guess! Please enter a 4-digit number with no duplicate digits."
      );
      return;
    }

    // Compare the guess to the number
    let newResult = "";
    let newGuessCount = guessCount + 1;
    for (let i = 0; i < 4; i++) {
      if (guess[i] === number[i]) {
        newResult += "+";
      } else if (number.includes(guess[i])) {
        newResult += "-";
      } else {
        newResult += "*";
      }
    }

    setResult(newResult);
    setGuessCount(newGuessCount);

    // Check if the user has won
    if (newResult === "++++") {
      // Calculate the user's score
      const score = { name, guesses: newGuessCount, date: new Date() };

      // Save the score to localStorage
      const scores = JSON.parse(localStorage.getItem("scores") || "[]");
      scores.push(score);
      localStorage.setItem("scores", JSON.stringify(scores));

      // Update the best score
      const best = scores.reduce((prev, curr) => {
        const prevScore = prev.guesses * (new Date() - prev.date);
        const currScore = curr.guesses * (new Date() - curr.date);
        return prevScore < currScore ? prev : curr;
      }, scores[0]);
      setBestScore(best);
    }
  };

  return (
    <div>
      <h1>Guess the Number</h1>
      <p>Enter a 4-digit number with no duplicate digits:</p>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
      <button onClick={handleGuess}>Guess</button>
      <button onClick={handleNewGame}>New Game</button>
      {result && <p>{result}</p>}
      {guessCount > 0 && <p>Guesses: {guessCount}</p>}
      {bestScore && (
        <p>
          Best Score: {bestScore.name} ({bestScore.guesses} guesses)
        </p>
      )}
    </div>
  );
};

export default Game;
