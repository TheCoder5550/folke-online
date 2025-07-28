import { useState } from "react";
import { COMPONENT_LIST } from "../exercise-components/AllExams"
import { EXAM_NAMES} from "../exercise-components/exam-data.ts";

export default function ExamList() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem"}}>
      <h1>All Exam Questions</h1>

      {index != null && (
        COMPONENT_LIST[index]()
      )}

      <h2>Index</h2>
      {EXAM_NAMES.map((exam, index) => (
        <a key={exam} href="#" onClick={() => setIndex(index)}>{exam}</a>
      ))}
    </div>
  )
}