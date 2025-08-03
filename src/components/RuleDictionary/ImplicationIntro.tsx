import Box from "./Box";
import Container from "./Container";
import Line from "./Line";

export default function ImplicationIntro() {
  return (
    <Container>
      <Box>
        <Line lineNumber="i" statement="p" rule="assume" />
        <Line statement="..." />
        <Line lineNumber="j" statement="q" />
      </Box>
      <Line statement="p -> q" rule="->I i-j" />
    </Container>
  )
}