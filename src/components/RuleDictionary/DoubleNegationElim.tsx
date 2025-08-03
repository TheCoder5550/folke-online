import Container from "./Container";
import Line from "./Line";

export default function DoubleNegationElim() {
  return (
    <Container>
      <Line lineNumber="i" statement="!!p" />
      <Line statement="p" rule="!!E i" />
    </Container>
  )
}