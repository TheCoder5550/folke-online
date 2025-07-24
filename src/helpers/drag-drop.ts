import type React from "react";
import { ProofDispatchActionTypeEnum, type ProofDispatchAction } from "../stores/proof-store";
import { findParentElement } from "./generic-helper";

export const createDragHandler = (
  lineRef: React.RefObject<HTMLElement | null>,
  uuid: UUID,
  dispatch: (action: ProofDispatchAction) => void
) => {
  const startDrag: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    const startX = e.pageX;
    const startY = e.pageY;
    let lastElement: HTMLElement | null = null;

    const mouseMove = (e: MouseEvent) => {
      const offsetX = e.pageX - startX;
      const offsetY = e.pageY - startY;

      if (lineRef.current) {
        lineRef.current.style.translate = `${offsetX}px ${offsetY}px`;
        lineRef.current.style.zIndex = "1000";
        lineRef.current.style.pointerEvents = "none";
      }

      const hoveredElement = e.target as (HTMLElement | null);
      if (!hoveredElement) {
        return;
      }

      const dropElement = findParentElement(hoveredElement, (element) => {
        const currentUUID = element.getAttribute("data-uuid");
        return currentUUID != null && currentUUID !== uuid;
      });

      const targetElement = dropElement ?
        findParentElement(dropElement, (element) => element.hasAttribute("data-target")) :
        null;

      if (lastElement && lastElement !== targetElement) {
        lastElement.style.borderBottom = "";
        // lastElement.style.marginBottom = "";
      }

      if (dropElement && targetElement) {
        targetElement.style.borderBottom = "3px solid red";
        // dropElement.style.marginBottom = "2rem";
        lastElement = targetElement;
      }
    };

    const mouseUp = (e: MouseEvent) => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);

      if (lineRef.current) {
        lineRef.current.style.translate = "";
        lineRef.current.style.zIndex = "";
        lineRef.current.style.pointerEvents = "";
      }

      if (lastElement) {
        lastElement.style.borderBottom = "";
        // lastElement.style.marginBottom = "";
      }

      const hoveredElement = e.target as (HTMLElement | null);
      if (!hoveredElement) {
        return;
      }
      
      findParentElement(hoveredElement, (element) => {
        const currentUUID = element.getAttribute("data-uuid");
        if (currentUUID != null) {
          dispatch({
            type: ProofDispatchActionTypeEnum.MoveAfter,
            moveThis: uuid,
            afterThis: currentUUID
          });
          return true;
        }
        return false;
      });
    };

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  };

  return startDrag;
};