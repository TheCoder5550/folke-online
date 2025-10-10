import styles from "./ExerciseList.module.css";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { EXAM_CATEGORIES } from "../../exercise-components/exam-data.ts";
import { EXERCISE_CATEGORIES } from "../../exercise-components/exercise-data.ts";
import { IDS, NAMES } from "../../exercise-components/id-data.ts";
import useProgressStore from "../../stores/progress-store.ts";
import { cls } from "../../helpers/generic-helper.ts";
import { FaCircleHalfStroke } from "react-icons/fa6";
import React from "react";

const totalExercises = IDS.length;

interface ExerciseListProps {
  id: string | null;
  setId: React.Dispatch<React.SetStateAction<string | null>> | ((id: string | null) => void);
}

export default function ExerciseList(props: ExerciseListProps) {
  const completed = useProgressStore((state) => state.getCompleted());
  const percent = getPercent(completed, totalExercises);
  const examCategories = Object.entries(EXAM_CATEGORIES).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));

  const exerciseCategories = Object.entries(EXERCISE_CATEGORIES).sort((a, b) => sortCategories(a[0], b[0]));

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

        {exerciseCategories.map(([category, componentMap]) => (
          <React.Fragment key={category}>
            <h2>{category}</h2>
            {Object.entries(componentMap).map(([id]) => (
              <ListItem key={id} id={id} select={() => props.setId(id)} isSelected={props.id === id} />
            ))}
          </React.Fragment>
        ))}

        <h2>Practice old exams</h2>
        <span>All questions are from old exams for the course <a target="_blank" rel="noreferrer noopener" href="https://www.chalmers.se/en/education/your-studies/find-course-and-programme-syllabi/course-syllabus/DAT060/">DAT060 Logic in computer science</a> on Chalmers.</span>
        {examCategories.map(([exam, ids]) => (
          <div key={exam} className={styles["card"]}>
            <h3>Exam {formatExamDate(exam)}</h3>
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
  const name = NAMES[IDS.indexOf(props.id)];

  return (
    <div onClick={props.select} className={cls(styles["list-item"], status && styles["completed"], props.isSelected && styles["selected"])}>
      {status === "complete" ? (
        <FaCheckCircle title="Completed!" color="rgb(var(--correct-color-rgb))" />
      ) : status === "partial" ? (
        <FaCircleHalfStroke title="Partially completed" color="rgb(var(--correct-color-rgb))" />
      ) : (
        <FaRegCircle title="Not completed yet" opacity={0.2} />
      )}
      <span className={styles["name"]}>
        {name}
      </span>
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

function formatExamDate(date: string): string {
  if (date.length !== 6) {
    return date;
  }

  const year = `20${date.slice(0, 2)}`;
  const month = date.slice(2, 4);
  const day = date.slice(4, 6);

  return `${year}-${month}-${day}`;
}

function sortCategories(a: string, b: string) {
  const priority = [
    "getting started",
    "using the rules",
  ];

  let aPrio = priority.indexOf(a.toLocaleLowerCase().trim());
  let bPrio = priority.indexOf(b.toLocaleLowerCase().trim());
  if (aPrio === -1) aPrio = Infinity;
  if (bPrio === -1) bPrio = Infinity;

  if (aPrio === bPrio) {
    return a.localeCompare(b);
  }

  return aPrio - bPrio;
}