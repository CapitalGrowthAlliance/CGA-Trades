import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ compact }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${compact ? 'p-1.5' : 'p-2'} rounded-full border border-border-color hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none flex items-center justify-center text-text-secondary hover:text-text-primary`}
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className={compact ? 'w-3.5 h-3.5' : 'w-5 h-5'} />
      ) : (
        <Sun className={compact ? 'w-3.5 h-3.5' : 'w-5 h-5'} />
      )}
    </button>
  );
}
