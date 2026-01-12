import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_THEME } from '../config/themes';
import type { ThemeName } from '../types';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<ThemeName>(
    'lifeclock-theme',
    DEFAULT_THEME
  );

  useEffect(() => {
    // Set data-theme attribute on document root
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
