import Container from "./Container";
import Line from "./Line";

export default function DoubleNegationIntro() {
  return (
    <Container>
      <Line lineNumber="i" statement="p" />
      <Line statement="!!p" rule="!!I i" />
    </Container>
  )
}