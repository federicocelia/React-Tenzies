import Die from "./components/Die.jsx";
import { useState } from "react";
import { nanoid } from "nanoid";

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
    setDiceValues(generateAllNewDice(6));
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
    console.log(id);
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

  return (
    <main>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        Roll Dice
      </button>
    </main>
  );
}
