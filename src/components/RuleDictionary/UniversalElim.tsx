import Container from "./Container";
import Line from "./Line";

export default function UniversalElim() {
  return (
    <Container>
      <Line lineNumber="i" statement="forallx.P(x)" />
      <Line statement="P[t/x]" rule="forallE i w. t" />
    </Container>
  )
}