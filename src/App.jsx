import "./App.css";
import Die from "./components/Die.jsx";
import { useState } from "react";

export default function App() {
  const [diceValues, setDiceValues] = useState(generateAllNewDice(6));

  function generateAllNewDice(max) {
    //max is the highest value you want to have on the die
    const Alldices = [];
    for (let i = 0; i < 10; i++) {
      Alldices.push(Math.floor(Math.random() * max + 1));
    }
    return Alldices;
  }

  function rollDice() {
    setDiceValues(generateAllNewDice(6));
  }

  const diceElements = diceValues.map((value) => {
    return <Die value={value} />;
  });

  return (
    <main>
      <div className="dice-container">{diceElements}</div>
      <button onClick={rollDice}>Roll Dice</button>
    </main>
  );
}
