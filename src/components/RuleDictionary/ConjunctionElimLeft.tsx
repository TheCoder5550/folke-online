import Container from "./Container";
import Line from "./Line";

export default function ConjunctionElimLeft() {
  return (
    <Container>
      <Line lineNumber="i" statement="p & q" />
      <Line statement="p" rule="&EL i" />
    </Container>
  )
}