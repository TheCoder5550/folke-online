import Container from "./Container";
import Line from "./Line";

export default function LEM() {
  return (
    <Container>
      <Line lineNumber="i" statement="p | !p" rule="LEM" />
    </Container>
  )
}