import Box from "./Box";
import Container from "./Container";
import Line from "./Line";

export default function DisjunctionElim() {
  return (
    <Container>
      <Line lineNumber="i" statement="p | q" />
      <Box>
        <Line lineNumber="j" statement="p" rule="assume" />
        <Line statement="..." />
        <Line lineNumber="k" statement="r" />
      </Box>
      <Box>
        <Line lineNumber="l" statement="q" rule="assume" />
        <Line statement="..." />
        <Line lineNumber="m" statement="r" />
      </Box>
      <Line statement="r" rule="|E (i, j-k, l-m)" />
    </Container>
  )
}