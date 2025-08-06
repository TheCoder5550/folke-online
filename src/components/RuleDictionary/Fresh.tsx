import Box from "./Box";
import Container from "./Container";
import Line from "./Line";

export default function Fresh() {
  return (
    <Container>
      <Box>
        <Line lineNumber="i" statement="x_0" rule="fresh" />
      </Box>
    </Container>
  )
}