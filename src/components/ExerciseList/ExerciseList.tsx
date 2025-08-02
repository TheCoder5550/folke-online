import styles from "./ExerciseList.module.css";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { EXAM_CATEGORIES, COMPONENT_MAP as EXAM_COMPONENT_MAP } from "../../exercise-components/exam-data.ts";
import { COMPONENT_MAP as EXERCISE_COMPONENT_MAP } from "../../exercise-components/exercise-data.ts";
import useProgressStore from "../../stores/progress-store.ts";
import { cls } from "../../helpers/generic-helper.ts";
import { FaCircleHalfStroke } from "react-icons/fa6";

const totalExercises = Object.keys(EXAM_COMPONENT_MAP).length + Object.keys(EXERCISE_COMPONENT_MAP).length;

interface ExerciseListProps {
  id: string | null;
  setId: React.Dispatch<React.SetStateAction<string | null>>
}

export default function ExerciseList(props: ExerciseListProps) {
  const completed = useProgressStore((state) => state.getCompleted());
  const percent = getPercent(completed, totalExercises);

  return (
    <>
      <h1>Exercises</h1>
      <div className={styles["grid"]}>
        <div className={styles["card"]}>
          <h3>Progress</h3>
          <div className={styles["meter-container"]}>
            <progress value={completed} max={totalExercises} style={{ minHeight: "1rem" }}></progress>
            <span>{percent}%</span>
          </div>
          <span>{completed}/{totalExercises} completed</span>
        </div>

        <h2>Exercise sheets</h2>
        {Object.entries(EXERCISE_COMPONENT_MAP).map(([id]) => (
          <ListItem key={id} id={id} select={() => props.setId(id)} isSelected={props.id === id} />
        ))}

        <h2>All exams</h2>
        {Object.entries(EXAM_CATEGORIES).map(([exam, ids]) => (
          <div key={exam} className={styles["card"]}>
            <h3>Exam {exam}</h3>
            {ids.map((id) => (
              <ListItem key={id} id={id} select={() => props.setId(id)} isSelected={props.id === id} />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

interface ListItemProps {
  id: string;
  isSelected: boolean;
  select: () => void;
}

function ListItem(props: ListItemProps) {
  const status = useProgressStore((state) => state.getStatus(props.id));

  return (
    <div onClick={props.select} className={cls(styles["list-item"], status && styles["completed"], props.isSelected && styles["selected"])}>
      {status === "complete" ? (
        <FaCheckCircle title="Completed!" color="rgb(var(--correct-color-rgb))" />
      ) : status === "partial" ? (
        <FaCircleHalfStroke title="Partially completed" color="rgb(var(--correct-color-rgb))" />
      ) : (
        <FaRegCircle title="Not completed yet" opacity={0.2} />
      )}
      <span className={styles["name"]}>{props.id}</span>
    </div>
  )
}

function getPercent(completed: number, total: number): number {
  let percent = Math.round(completed / total * 100);
  if (percent == 100 && completed !== total) {
    percent = 99;
  }
  return percent;
}