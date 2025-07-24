import useProofStore from "../stores/proof-store"

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