import styles from "./ExerciseList.module.css";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { EXAM_NAMES} from "../../exercise-components/exam-data.ts";
import useProgressStore from "../../stores/progress-store.tsx";
import { cls } from "../../helpers/generic-helper.ts";

interface ExerciseListProps {
  index: number | null;
  setIndex: React.Dispatch<React.SetStateAction<number | null>>
}

export default function ExerciseList(props: ExerciseListProps) {
  const completed = useProgressStore((state) => state.getCompleted());

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
      <h2>Progress</h2>
      <progress value={completed} max={EXAM_NAMES.length} style={{ minHeight: "1rem", width: "100%" }}></progress>
      <span>{completed}/{EXAM_NAMES.length} completed</span>

      <h2>Weekly exercises</h2>
      <span style={{ textDecoration: "line-through" }}>Week 1</span>
      <span style={{ textDecoration: "line-through" }}>Week 2</span>
      <span style={{ textDecoration: "line-through" }}>Week 3</span>
      <span style={{ textDecoration: "line-through" }}>Week 4</span>

      <h2>All exam questions</h2>
      {EXAM_NAMES.map((exam, i) => (
        <ListItem key={exam} id={exam} select={() => props.setIndex(i)} isSelected={props.index === i} />
      ))}
    </div>
  )
}

interface ListItemProps {
  id: string;
  isSelected: boolean;
  select: () => void;
}

function ListItem(props: ListItemProps) {
  const isCompleted = useProgressStore((state) => state.isCompleted(props.id));

  return (
    <div onClick={props.select} className={cls(styles["list-item"], isCompleted && styles["completed"], props.isSelected && styles["selected"])}>
      {isCompleted ? (
        <FaCheckCircle title="Completed!" color="rgb(var(--correct-color-rgb))" />
      ) : (
        <FaRegCircle title="Not completed yet" opacity={0.2} />
      )}
      <span>{props.id}</span>
    </div>
  )
}