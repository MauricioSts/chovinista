import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{
        background: "var(--toggle-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-full)",
        padding: "6px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "56px",
        height: "28px",
        boxShadow: "var(--toggle-shadow)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        animate={{
          x: isDark ? 28 : 0,
          backgroundColor: isDark ? "#1e1a2e" : "#fbbf24",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        style={{
          position: "absolute",
          left: "2px",
          top: "2px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isDark
            ? "0 1px 4px rgba(0,0,0,0.4)"
            : "0 1px 4px rgba(251, 191, 36, 0.3)",
        }}
      >
        <motion.div
          animate={{
            rotate: isDark ? 180 : 0,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{ position: "absolute" }}
        >
          <Sun size={12} color="#f59e0b" />
        </motion.div>
        <motion.div
          animate={{
            rotate: isDark ? 0 : -180,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{ position: "absolute" }}
        >
          <Moon size={12} color="#a5b4fc" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
