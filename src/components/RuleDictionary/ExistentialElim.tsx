import Box from "./Box";
import Container from "./Container";
import Line from "./Line";

export default function ExistentialElim() {
  return (
    <Container>
      <Line lineNumber="i" statement="someX.P(x)" />
      <Box>
        <Line lineNumber="j" statement="x_0" rule="fresh" />
        <Line statement="P[x_0/x]" rule="assume" />
        <Line statement="..." />
        <Line lineNumber="k" statement="q" />
      </Box>
      <Line statement="q" rule="someE (i, j-k)" />
    </Container>
  )
}