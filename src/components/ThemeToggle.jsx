import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{
        background: 'var(--toggle-bg)',
        border: 'none',
        borderRadius: '50px',
        padding: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '60px',
        height: '30px',
        boxShadow: 'var(--toggle-shadow)',
      }}
    >
      <motion.div
        className="toggle-slider"
        animate={{
          x: isDark ? 30 : 0,
          backgroundColor: isDark ? '#1a1a1a' : '#ffd700',
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        style={{
          position: 'absolute',
          left: '2px',
          top: '2px',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          animate={{
            rotate: isDark ? 180 : 0,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute' }}
        >
          <Sun size={14} color="#ff6b35" />
        </motion.div>
        <motion.div
          animate={{
            rotate: isDark ? 0 : -180,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute' }}
        >
          <Moon size={14} color="#e0e0e0" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
