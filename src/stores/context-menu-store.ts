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

const width = 300;

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
        open(e: React.MouseEvent, items: ContextMenuItem[]) {
          // Estimate height
          const height = items.length * 40;
          
          set((state) => {
            state.isOpen = true;
            state.items = items;
            state.xOffset = Math.min(innerWidth - width - 20, e.clientX);
            state.yOffset = Math.min(innerHeight - height - 20, e.clientY);
          })
        }
      })
    )
  )
)

export default useContextMenuStore;