import { useState, useEffect, useCallback, useMemo } from 'react';
import { THEMES, THEME_PREFERENCES, STORAGE_KEYS } from '../utils/constants';

/**
 * Custom hook for managing application theme
 * Provides theme switching, persistence, and system preference detection
 * 
 * @returns {Object} Theme state and methods
 */
const useTheme = () => {
  // Get system theme preference
  const getSystemTheme = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? THEMES.DARK 
      : THEMES.LIGHT;
  }, []);

  // Initialize theme from localStorage or system preference
  const initializeTheme = useCallback(() => {
    try {
      // Check localStorage first
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      
      if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
        return savedTheme;
      }
      
      // Fallback to system preference
      return getSystemTheme();
    } catch (error) {
      console.error('Error initializing theme:', error);
      return THEMES.LIGHT; // Safe fallback
    }
  }, [getSystemTheme]);

  const [theme, setTheme] = useState(initializeTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme());
  const [themeTransition, setThemeTransition] = useState(false);
  const [customColors, setCustomColors] = useState({});

  // Get effective theme (considering system preference)
  const effectiveTheme = useMemo(() => {
    if (theme === THEMES.SYSTEM) {
      return systemTheme;
    }
    return theme;
  }, [theme, systemTheme]);

  // Get theme colors
  const themeColors = useMemo(() => {
    const baseColors = THEME_PREFERENCES[effectiveTheme]?.colors || THEME_PREFERENCES[THEMES.LIGHT].colors;
    
    // Merge with custom colors
    return {
      ...baseColors,
      ...customColors,
      primary: customColors.primary || baseColors.primary || '#667eea',
      secondary: customColors.secondary || baseColors.secondary || '#764ba2'
    };
  }, [effectiveTheme, customColors]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === THEMES.LIGHT) return THEMES.DARK;
      if (prev === THEMES.DARK) return THEMES.LIGHT;
      return getSystemTheme(); // If system, toggle to opposite of current effective
    });
  }, [getSystemTheme]);

  // Set specific theme
  const setThemeMode = useCallback((newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  }, []);

  // Update custom colors
  const updateCustomColors = useCallback((newColors) => {
    setCustomColors(prev => ({
      ...prev,
      ...newColors
    }));
  }, []);

  // Reset to default colors
  const resetCustomColors = useCallback(() => {
    setCustomColors({});
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const colors = themeColors;

    // Apply CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Add/remove dark class for global styles
    if (effectiveTheme === THEMES.DARK) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }

    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: effectiveTheme, colors } 
    }));

  }, [theme, effectiveTheme, themeColors]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      const newSystemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
      setSystemTheme(newSystemTheme);
      
      // Trigger re-render if using system theme
      if (theme === THEMES.SYSTEM) {
        setThemeTransition(true);
        setTimeout(() => setThemeTransition(false), 300);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  // Animate theme transition
  useEffect(() => {
    if (themeTransition) {
      const root = document.documentElement;
      root.classList.add('theme-transitioning');
      
      const timeout = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [themeTransition]);

  // Generate CSS for custom theme
  const getThemeCSS = useCallback(() => {
    return Object.entries(themeColors)
      .map(([key, value]) => `--theme-${key}: ${value};`)
      .join('\n');
  }, [themeColors]);

  // Check if dark mode is active
  const isDarkMode = useMemo(() => effectiveTheme === THEMES.DARK, [effectiveTheme]);

  // Check if light mode is active
  const isLightMode = useMemo(() => effectiveTheme === THEMES.LIGHT, [effectiveTheme]);

  // Get contrast color (for text on colored backgrounds)
  const getContrastColor = useCallback((backgroundColor) => {
    // Simple contrast calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }, []);

  return {
    // Current state
    theme,
    effectiveTheme,
    systemTheme,
    isDarkMode,
    isLightMode,
    colors: themeColors,
    transition: themeTransition,

    // Theme methods
    toggleTheme,
    setTheme: setThemeMode,
    updateCustomColors,
    resetCustomColors,
    getThemeCSS,
    getContrastColor,

    // Helper booleans
    isSystemTheme: theme === THEMES.SYSTEM,
    hasCustomColors: Object.keys(customColors).length > 0
  };
};

export default useTheme;