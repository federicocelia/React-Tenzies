import Die from "./components/Die.jsx";
import { useState } from "react";
import { nanoid } from "nanoid";
import { ConfettiDrop } from "../src/components/Confetti.jsx";

export default function App() {
  let gameWon = false;
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
    setDiceValues((prev) => {
      return prev.map((dice) => {
        if (!dice.isHeld) {
          return {
            ...dice,
            value: Math.ceil(Math.random() * 6),
          };
        } else {
          return dice;
        }
      });
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

  const diceElements = diceValues.map((value) => {
    return (
      <Die
        key={value.id}
        value={value.value}
        isHeld={value.isHeld}
        hold={() => hold(value.id)}
      />
    );
  });

  const allHeld = diceValues.every((dice) => dice.isHeld);
  const firstDiceValue = diceValues[0]?.value;
  const allSameValue = diceValues.every(
    (dice) => dice.value === firstDiceValue,
  );

  if (allHeld && allSameValue) {
    console.log("Game Won!");
    gameWon = true;
  }

  return (
    <>
      {gameWon ? <ConfettiDrop /> : null}
      <main>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dice-container">{diceElements}</div>
        <button className="roll-dice" onClick={rollDice}>
          {gameWon ? "New Game" : "Roll Dice"}
        </button>
      </main>
    </>
  );
}
