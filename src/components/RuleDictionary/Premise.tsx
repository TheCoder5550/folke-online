import Container from "./Container";
import Line from "./Line";

export default function Premise() {
  return (
    <Container>
      <Line lineNumber="1" statement="p" rule="premise" />
      <Line lineNumber="2" statement="q" rule="premise" />
      <Line lineNumber="3" statement="r" rule="premise" />
      <Line statement="..." />
    </Container>
  )
}