import Container from "./Container";
import Line from "./Line";

export default function EqualityElim() {
  return (
    <Container>
      <Line lineNumber="i" statement="t_1 = t_2" />
      <Line lineNumber="j" statement="P[t_1/x]" />
      <Line statement="P[t_2/x]" rule="=E (i, j, 𝝓≡P(x))" />
    </Container>
  )
}