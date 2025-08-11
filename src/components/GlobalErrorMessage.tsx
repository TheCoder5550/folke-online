import { memo } from "react";
import useProofStore from "../stores/proof-store"

export const GlobalErrorMessageMemo = memo(GlobalErrorMessage);

export default function GlobalErrorMessage() {
  const message = useProofStore((state) => {
    const res = state.result;
    if (!res || !res.location || !res.message) {
      return "";
    }

    if (res.location === "global") {
      return res.message ?? "";
    }

    return res.location + ": " + res.message;
  });

  return <span style={{ color: "rgb(var(--error-color-rgb))" }}>{message}&nbsp;</span>
}