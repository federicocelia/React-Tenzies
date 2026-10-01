export default function Die(props) {
  const style = { backgroundColor: "var(--die-held-background)" };
  return (
    <button
      className="dice"
      style={props.isHeld ? style : null}
      onClick={props.hold}
    >
      {props.value}
    </button>
  );
}
