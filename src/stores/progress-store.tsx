import { create } from "zustand"
import { combine, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer"
import { EXAM_NAMES } from "../exercise-components/exam-data";

type ProgressLookup = {
  [id: string]: boolean | undefined
};

const useProgressStore = create(
  immer(
    persist(
      combine(
        {
          progress: {} as ProgressLookup
        },
        (set, get) => ({
          completeExercise(id: string) {
            set(state => {
              if (!EXAM_NAMES.includes(id)) {
                return;
              }

              state.progress[id] = true;
            })
          },
          isCompleted(id: string) {
            if (!EXAM_NAMES.includes(id)) {
              return false;
            }

            return get().progress[id] ?? false;
          },
          getCompleted() {
            const progress = get().progress;
            let completed = 0;
            for (const [key, value] of Object.entries(progress)) {
              if (value && EXAM_NAMES.includes(key)) {
                completed++;
              }
            }
            return completed;
          }
        })
      ),
      {
        name: "folke.exercise-progress"
      }
    )
  )
)

export default useProgressStore;