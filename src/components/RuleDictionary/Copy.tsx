import Container from "./Container";
import Line from "./Line";

export default function Copy() {
  return (
    <Container>
      <Line lineNumber="i" statement="p" />
      <Line statement="p" rule="copy i" />
    </Container>
  )
}