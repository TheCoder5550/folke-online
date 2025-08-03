import Container from "./Container";
import Line from "./Line";

export default function ExistentialIntro() {
  return (
    <Container>
      <Line lineNumber="i" statement="P[t/x]" />
      <Line statement="somex.P(x)" rule="someI i" />
    </Container>
  )
}