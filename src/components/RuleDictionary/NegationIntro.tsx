import Box from "./Box";
import Container from "./Container";
import Line from "./Line";

export default function NegationIntro() {
  return (
    <Container>
      <Box>
        <Line lineNumber="i" statement="p" rule="assume" />
        <Line statement="..." />
        <Line lineNumber="j" statement="bot" />
      </Box>
      <Line statement="!p" rule="!I i-j" />
    </Container>
  )
}