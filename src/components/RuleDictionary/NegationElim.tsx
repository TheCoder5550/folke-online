import Container from "./Container";
import Line from "./Line";

export default function NegationElim() {
  return (
    <Container>
      <Line lineNumber="i" statement="p" />
      <Line lineNumber="j" statement="!p" />
      <Line statement="bot" rule="!E (i, j)" />
    </Container>
  )
}