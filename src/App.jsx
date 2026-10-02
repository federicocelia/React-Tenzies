import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";

import Die from "./components/Die.jsx";
import { ConfettiDrop } from "../src/components/Confetti.jsx";

export default function App() {
  // =========================
  // State
  // =========================

  const [diceValues, setDiceValues] = useState(generateAllNewDice(6));

  // =========================
  // Refs
  // =========================

  const inputRef = useRef(null);
  const hasRolledRef = useRef(false);
  const foundMatchingValueRef = useRef(false);

  // =========================
  // Derived Values
  // =========================

  const allHeld = diceValues.every((dice) => dice.isHeld);

  const firstDiceValue = diceValues[0]?.value;

  const allSameValue = diceValues.every(
    (dice) => dice.value === firstDiceValue,
  );

  const heldDice = diceValues.filter((die) => die.isHeld);

  const targetValue = heldDice.length > 0 ? heldDice[0].value : null;

  const gameWon = allHeld && allSameValue;

  // =========================
  // Helper Functions
  // =========================

  function generateAllNewDice(max) {
    // max is the highest value allowed on a die

    const Alldices = [];

    for (let i = 0; i < 10; i++) {
      Alldices.push({
        value: Math.floor(Math.random() * max + 1),
        isHeld: false,
        id: nanoid(),
      });
    }

    return Alldices;
  }

  // =========================
  // Event Handlers
  // =========================

  function rollDice() {
    hasRolledRef.current = true;
    foundMatchingValueRef.current = false;

    const matchingBeforeRoll = diceValues.filter(
      (die) => !die.isHeld && die.value === targetValue,
    ).length;

    setDiceValues((prev) => {
      const newDice = prev.map((dice) => {
        if (!dice.isHeld) {
          return {
            ...dice,
            value: Math.ceil(Math.random() * 6),
          };
        }

        return dice;
      });

      const matchingAfterRoll = newDice.filter(
        (die) => !die.isHeld && die.value === targetValue,
      ).length;

      foundMatchingValueRef.current = matchingAfterRoll > matchingBeforeRoll;

      return newDice;
    });
  }

  function hold(id) {
    setDiceValues((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isHeld: !item.isHeld,
          };
        }

        return item;
      });
    });
  }

  function resetGame() {
    if (gameWon) {
      setDiceValues(generateAllNewDice(6));
    } else {
      return;
    }
  }

  // =========================
  // Effects
  // =========================

  // Move focus to the New Game button when the user wins.
  useEffect(() => {
    if (gameWon) {
      inputRef.current.focus();
    }
  }, [gameWon]);

  // Move focus back to the dice when a roll creates
  // at least one additional matching value.
  useEffect(() => {
    if (hasRolledRef.current && foundMatchingValueRef.current && !gameWon) {
      const firstDie = document.querySelector('[data-first-die="true"]');

      firstDie?.focus();
    }

    hasRolledRef.current = false;
  }, [diceValues, gameWon]);

  // =========================
  // Rendered Dice
  // =========================

  const diceElements = diceValues.map((value, index) => {
    return (
      <Die
        key={value.id}
        value={value.value}
        isHeld={value.isHeld}
        hold={() => hold(value.id)}
        isFirstDie={index === 0}
      />
    );
  });

  // =========================
  // Render
  // =========================

  return (
    <>
      {gameWon ? <ConfettiDrop /> : null}

      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>Congratulations! You won! Press "New Game" to start again.</p>
        )}
      </div>

      <main>
        <h1 className="title">Tenzies</h1>

        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>

        <div className="dice-container">{diceElements}</div>

        <button
          className="roll-dice"
          onClick={gameWon ? resetGame : rollDice}
          ref={inputRef}
        >
          {gameWon ? "New Game" : "Roll Dice"}
        </button>
      </main>
    </>
  );
}
