import Box from "./Box";
import Container from "./Container";
import Line from "./Line";

export default function Assume() {
  return (
    <Container>
      <Box>
        <Line lineNumber="i" statement="p" rule="assume" />
      </Box>
    </Container>
  )
}