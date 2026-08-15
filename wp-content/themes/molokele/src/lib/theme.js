import { useEffect, useState } from 'react';

const COOKIE_NAME = 'molokele_theme';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=(dark|light)`));
  return match ? match[1] : null;
}

function writeCookie(name, value) {
  document.cookie = `${name}=${value}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

function systemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

// Mirrors the inline <head> script in functions.php — same precedence
// (explicit cookie choice wins, else OS preference) — so React's first
// render always agrees with what's already on <html>, no flash/mismatch.
function resolveInitialTheme() {
  return readCookie(COOKIE_NAME) || systemTheme();
}

// The toggle button hooks into this. Overriding writes the cookie (the
// visitor has now made an explicit choice, so we stop following the OS).
// As long as no override exists, the theme keeps tracking OS changes live.
export function useTheme() {
  const [theme, setThemeState] = useState(resolveInitialTheme);

  useEffect(() => {
    if (readCookie(COOKIE_NAME)) return undefined;

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const next = e.matches ? 'dark' : 'light';
      applyTheme(next);
      setThemeState(next);
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (next) => {
    writeCookie(COOKIE_NAME, next);
    applyTheme(next);
    setThemeState(next);
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return { theme, setTheme, toggleTheme };
}
