import Container from "./Container";
import Line from "./Line";

export default function MT() {
  return (
    <Container>
      <Line lineNumber="i" statement="p -> q" />
      <Line lineNumber="j" statement="!q" />
      <Line statement="!p" rule="MT (i, j)" />
    </Container>
  )
}