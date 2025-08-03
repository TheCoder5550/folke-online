import Container from "./Container";
import Line from "./Line";

export default function ConjunctionIntro() {
  return (
    <Container>
      <Line lineNumber="i" statement="p" />
      <Line lineNumber="j" statement="q" />
      <Line statement="p & q" rule="&I (i, j)" />
    </Container>
  )
}