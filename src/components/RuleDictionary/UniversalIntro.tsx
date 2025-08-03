import Box from "./Box";
import Container from "./Container";
import Line from "./Line";

export default function UniversalIntro() {
  return (
    <Container>
      <Box>
        <Line lineNumber="i" statement="x_0" rule="fresh" />
        <Line statement="..." />
        <Line lineNumber="j" statement="P[x_0/x]" />
      </Box>
      <Line statement="forallx.P(x)" rule="forallI i-j" />
    </Container>
  )
}