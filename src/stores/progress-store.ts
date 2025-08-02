import { create } from "zustand"
import { combine, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer"
import { IDS } from '../exercise-components/id-data';

type ProgressLookup = {
  [id: string]: boolean | boolean[] | undefined
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
              if (!IDS.includes(id)) {
                return;
              }

              state.progress[id] = true;
            })
          },
          completeSubExercise(id: string, index: number, totalSubQuestions: number) {
            set(state => {
              if (!IDS.includes(id)) {
                return;
              }

              const currentProgress = state.progress[id];
              if (typeof currentProgress === "boolean") {
                return;
              }
              else if (currentProgress == undefined) {
                state.progress[id] = new Array<boolean>(totalSubQuestions).fill(false);
              }
              else if (currentProgress.length < totalSubQuestions) {
                const falses = new Array<boolean>(totalSubQuestions - currentProgress.length).fill(false);
                state.progress[id] = [...currentProgress, ...falses];
              }

              if (Array.isArray(state.progress[id])) {
                state.progress[id][index] = true;
              }
            })
          },
          getStatus(id: string) {
            const progress = get().progress[id];

            if (!IDS.includes(id) || progress == undefined) {
              return "error";
            }

            if (Array.isArray(progress)) {
              if (progress.every(v => v === true)) {
                return "complete";
              }
              else if (progress.every(v => v !== true)) {
                return "incomplete";
              }
              else {
                return "partial";
              }
            }
            else {
              return progress === true ? "complete" : "incomplete";
            }
          },
          getCompleted() {
            const progress = get().progress;
            let completed = 0;
            for (const [key, value] of Object.entries(progress)) {
              if (!IDS.includes(key) || value == undefined) {
                continue;
              }

              if (Array.isArray(value) && value.every(v => v === true)) {
                completed++;
              }
              else if (value === true) {
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