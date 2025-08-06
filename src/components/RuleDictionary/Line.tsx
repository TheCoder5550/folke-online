import { makeSpecialCharacters } from "../../helpers/special-characters";

interface LineProps {
  lineNumber?: string;
  statement: string;
  rule?: string;
}

export default function Line(props: LineProps) {
  const lineNumber = props.lineNumber == undefined ? "" : props.lineNumber + "."
  const statement = makeSpecialCharacters(props.statement);
  const rule = props.rule == undefined ? "" : makeSpecialCharacters(props.rule);

  return (
    <div style={{
      display: "flex",
      fontFamily: "monospace",
      fontSize: "1rem",
    }}>
      <span style={{
        position: "absolute",
        left: "0",
        fontStyle: "italic"
      }}>{lineNumber}</span>
      <span style={{
        flex: "1"
      }}>{statement}</span>
      <span style={{
        width: "50%",
      }}>{rule}</span>
    </div>
  )
}