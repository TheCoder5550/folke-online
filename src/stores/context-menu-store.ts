import type { JSX } from "react";
import { create } from "zustand"
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer"

interface ContextMenuItem {
  label: string;
  icon?: JSX.Element;
  type?: "normal" | "danger";
  shortcut?: string;
  action: () => void;
  enabled?: boolean;
}

const useContextMenuStore = create(
  immer(
    combine(
      {
        isOpen: false,
        items: [] as ContextMenuItem[],
        xOffset: -1,
        yOffset: -1
      },
      (set, _get) => ({
        close() {
          set((state) => {
            state.isOpen = false
          })
        },
        open(e: React.MouseEvent<HTMLDivElement, MouseEvent>, items: ContextMenuItem[]) {
          set((state) => {
            state.isOpen = true;
            state.items = items;
            state.xOffset = e.clientX;
            state.yOffset = e.clientY;
          })
        }
      })
    )
  )
)

export default useContextMenuStore;