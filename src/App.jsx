import Die from "./components/Die.jsx";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import { ConfettiDrop } from "../src/components/Confetti.jsx";

export default function App() {
  const [diceValues, setDiceValues] = useState(generateAllNewDice(6));

  function generateAllNewDice(max) {
    //max is the highest value you want to have on the die
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
        } else {
          return item;
        }
      });
    });
  }

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

  const allHeld = diceValues.every((dice) => dice.isHeld);
  const firstDiceValue = diceValues[0]?.value;
  const allSameValue = diceValues.every(
    (dice) => dice.value === firstDiceValue,
  );

  const heldDice = diceValues.filter((die) => die.isHeld);

  const targetValue = heldDice.length > 0 ? heldDice[0].value : null;
  const foundMatchingValueRef = useRef(false);

  const gameWon = allHeld && allSameValue;

  function resetGame() {
    if (gameWon) {
      setDiceValues(generateAllNewDice(6));
    } else {
      return;
    }
  }

  const inputRef = useRef(null);

  const hasRolledRef = useRef(false);

  useEffect(() => {
    if (gameWon) {
      inputRef.current.focus();
    }
  }, [gameWon]);

  useEffect(() => {
    if (hasRolledRef.current && foundMatchingValueRef.current && !gameWon) {
      const firstDie = document.querySelector('[data-first-die="true"]');

      firstDie?.focus();
    }

    hasRolledRef.current = false;
  }, [diceValues, gameWon]);

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
