import Container from "./Container";
import Line from "./Line";

export default function DisjunctionIntroRight() {
  return (
    <Container>
      <Line lineNumber="i" statement="p" />
      <Line statement="p | q" rule="|IR i" />
    </Container>
  )
}