import { memo } from "react";
import useProofStore from "../stores/proof-store"

export const GlobalErrorMessageMemo = memo(GlobalErrorMessage);

export default function GlobalErrorMessage() {
  const message = useProofStore((state) => {
    const res = state.result;
    if (!res) {
      return "";
    }

    if (res.location === "global") {
      return res.message ?? "";
    }

    return "";
  });

  return <span style={{ color: "rgb(var(--error-color-rgb))" }}>{message}</span>
}