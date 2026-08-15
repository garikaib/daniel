import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './lib/theme.js';

// Sun/moon cross-fade with opposite rotation directions, so the swap reads
// as one icon turning into the other rather than two unrelated icons
// swapping. `className` carries color/hover state so this drops into
// whichever context it's used in (top nav vs. dark mobile drawer) already
// matching the surrounding icon buttons.
export default function ThemeToggle({ className = '', iconClassName = 'h-5 w-5' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative p-2 transition-colors focus:outline-none ${className}`}
    >
      <span className={`relative block ${iconClassName}`}>
        <Sun
          className={`absolute inset-0 h-full w-full transition-all duration-500 ease-out ${
            isDark ? 'rotate-[90deg] scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <Moon
          className={`absolute inset-0 h-full w-full transition-all duration-500 ease-out ${
            isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-[-90deg] scale-0 opacity-0'
          }`}
        />
      </span>
    </button>
  );
}
