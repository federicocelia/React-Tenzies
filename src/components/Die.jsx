export default function Die(props) {
  const style = { backgroundColor: "var(--die-held-background)" };
  return (
    <button
      className="dice"
      style={props.isHeld ? style : null}
      onClick={props.hold}
      aria-label={`Die with value ${props.value}, 
            ${props.isHeld ? "held" : "not held"}`}
      data-first-die={props.isFirstDie}
    >
      {props.value}
    </button>
  );
}
