import Container from "./Container";
import Line from "./Line";

export default function ImplicationElim() {
  return (
    <Container>
      <Line lineNumber="i" statement="p" />
      <Line lineNumber="j" statement="p -> q" />
      <Line statement="q" rule="->E (i, j)" />
    </Container>
  )
}