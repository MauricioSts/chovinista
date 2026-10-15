import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Usar tema claro" : "Usar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
    >
      <Icon size={18} strokeWidth={1.75} />
    </button>
  );
};

export default ThemeToggle;
