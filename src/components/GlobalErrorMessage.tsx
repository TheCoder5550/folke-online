import { memo } from "react";
import useProofStore from "../stores/proof-store"

export const GlobalErrorMessageMemo = memo(GlobalErrorMessage);

export default function GlobalErrorMessage() {
  const color = useProofStore((state) => {
    if (state.result?.message?.includes("Conclusion not reached")) {
      return "orange";
    }
    return "rgb(var(--error-color-rgb))";
  });

  const visible = useProofStore((state) => {
    return (
      state.getProof().steps.length !== 0 ||
      !state.result?.message?.includes("Conclusion not reached")
    )
  })

  const message = useProofStore((state) => {
    const res = state.result;
    if (!res || !res.location || !res.message || !visible) {
      return "";
    }

    if (res.location === "global") {
      return res.message ?? "";
    }

    return res.location + ": " + res.message;
  });

  return <span style={{ color }}>{message}&nbsp;</span>
}