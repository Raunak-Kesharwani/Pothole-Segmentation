import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      aria-label="Toggle theme"
      onClick={() => {
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
      }}
      className="relative w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors shadow-inner"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-200 shadow-lg flex items-center justify-center text-xs"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.span>
    </motion.button>
  );
}
