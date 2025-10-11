import Container from "./Container";
import Line from "./Line";

export default function EqualityElim() {
  return (
    <Container>
      <Line lineNumber="i" statement="t_1 = t_2" />
      <Line lineNumber="j" statement="P[t_1/x]" />
      <Line statement="P[t_2/x]" rule="=E (i, j, 𝝓(x)≡P(x))" />
    </Container>
  )
}

export function EqualityElimExample() {
  return (
    <Container>
      <Line statement="t_1 = t_2 => t_2 = t_1" />
      <Line lineNumber="1" statement="t_1 = t_2" rule="premise" />
      <Line lineNumber="2" statement="t_1 = t_1" rule="=I" />
      <Line lineNumber="3" statement="t_2 = t_1" rule="=E (1, 2, 𝝓(x) ≡ x = t_1)" />
      <i>Type <code>x = t_1</code> into the third argument of =E</i>
    </Container>
  )
}