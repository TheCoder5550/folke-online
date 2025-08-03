import Container from "./Container";
import Line from "./Line";

export default function ContradictionElim() {
  return (
    <Container>
      <Line lineNumber="i" statement="bot" />
      <Line statement="p" rule="botE i" />
    </Container>
  )
}