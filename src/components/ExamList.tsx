import { EXAM_NAMES} from "../exercise-components/exam-data.ts";

interface ExamListProps {
  index: number | null;
  setIndex: React.Dispatch<React.SetStateAction<number | null>>
}

export default function ExamList(props: ExamListProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      overflow: "auto",
      height: "85vh",
      background: "white",
      border: "1px solid black",
      padding: "1rem",
      margin: "1rem",
      position: "sticky",
      top: "1rem",
      borderRadius: "4px"
    }}>
      <h2>Weekly exercises</h2>
      <span>Week 1</span>
      <span>Week 2</span>
      <span>Week 3</span>
      <span>Week 4</span>

      <h2>All exam questions</h2>
      {EXAM_NAMES.map((exam, i) => (
        <a key={exam} href="#" onClick={() => props.setIndex(i)} style={{ color: props.index === i ? "red" : undefined }}>{exam}</a>
      ))}
    </div>
  )
}