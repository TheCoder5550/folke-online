import styles from "./ExerciseList.module.css";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { EXAM_NAMES } from "../../exercise-components/exam-data.ts";
import { EXERCISE_NAMES } from "../../exercise-components/exercise-data.ts";
import useProgressStore from "../../stores/progress-store.tsx";
import { cls } from "../../helpers/generic-helper.ts";

interface ExerciseListProps {
  index: number | null;
  setIndex: React.Dispatch<React.SetStateAction<number | null>>
}

export default function ExerciseList(props: ExerciseListProps) {
  const completed = useProgressStore((state) => state.getCompleted());
  const totalExercises = EXAM_NAMES.length + EXERCISE_NAMES.length;
  const examIndexOffset = EXERCISE_NAMES.length;
  let percent = Math.round(completed / totalExercises * 100);
  if (percent == 100 && completed !== totalExercises) {
    percent = 99;
  }

  return (
    <>
      <h1>Exercises</h1>
      <div className={styles["grid"]}>
        <div className={styles["progress-card"]}>
          <h2>Progress</h2>
          <div className={styles["meter-container"]}>
            <progress value={completed} max={totalExercises} style={{ minHeight: "1rem" }}></progress>
            <span>{percent}%</span>
          </div>
          <span>{completed}/{totalExercises} completed</span>
        </div>

        <h2>Exercise sheets</h2>
        {EXERCISE_NAMES.map((exercise, i) => (
          <ListItem key={exercise} id={exercise} select={() => props.setIndex(i)} isSelected={props.index === i} />
        ))}

        <h2>All exam questions</h2>
        {EXAM_NAMES.map((exam, i) => (
          <ListItem key={exam} id={exam} select={() => props.setIndex(i + examIndexOffset)} isSelected={props.index === i + examIndexOffset} />
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