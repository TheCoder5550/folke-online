import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useLocalStorage } from "usehooks-ts";

type Theme = "dark" | "light";

export default function DarkModeToggle() {
  const defaultTheme: Theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
  const [theme, setTheme, _removeValue] = useLocalStorage<Theme>("theme", defaultTheme);
  const isDarkMode = theme === "dark";

  document.documentElement.setAttribute("data-theme", theme);

  return (
    <button
      type="button"
      onClick={() => setTheme(v =>switchTheme(v))}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0.5em",
      }}
    >
      {isDarkMode ? (
        <MdDarkMode />
      ) : (
        <MdLightMode />
      )}
    </button>
  )
}

function switchTheme(theme: Theme): Theme {
  if (theme === "dark") {
    return "light";
  }
  else {
    return "dark";
  }
}