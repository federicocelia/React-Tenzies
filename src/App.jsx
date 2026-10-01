import "./App.css";
import Die from "./components/Die.jsx";
import { useState } from "react";

export default function App() {
  const [dieValues, setDieValues] = useState(generateAllNewDice(6));

  function generateAllNewDice(max) {
    const Alldices = [];
    for (let i = 0; i < 10; i++) {
      Alldices.push(Math.floor(Math.random() * max + 1));
    }
    return Alldices;
  }

  const dieElements = dieValues.map((value) => {
    return <Die value={value} />;
  });

  return (
    <main>
      <div className="die-container">{dieElements}</div>
    </main>
  );
}
