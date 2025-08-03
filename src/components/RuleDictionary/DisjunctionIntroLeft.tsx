import Container from "./Container";
import Line from "./Line";

export default function DisjunctionIntroLeft() {
  return (
    <Container>
      <Line lineNumber="i" statement="p" />
      <Line statement="q | p" rule="|IL i" />
    </Container>
  )
}