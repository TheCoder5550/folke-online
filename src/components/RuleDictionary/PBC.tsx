import Box from "./Box";
import Container from "./Container";
import Line from "./Line";

export default function PBC() {
  return (
    <Container>
      <Box>
        <Line lineNumber="i" statement="!p" rule="assume" />
        <Line statement="..." />
        <Line lineNumber="j" statement="bot" />
      </Box>
      <Line statement="p" rule="PBC i-j" />
    </Container>
  )
}