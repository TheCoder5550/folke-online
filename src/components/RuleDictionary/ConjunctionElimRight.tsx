import Container from "./Container";
import Line from "./Line";

export default function ConjunctionElimRight() {
  return (
    <Container>
      <Line lineNumber="i" statement="p & q" />
      <Line statement="q" rule="&ER i" />
    </Container>
  )
}