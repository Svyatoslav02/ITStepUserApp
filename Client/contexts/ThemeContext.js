import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = 'appTheme';

export const themes = {
  dark: {
    bg: '#121212',
    background: '#121212',
    card: '#1f1f1f',
    text: '#e5e5e5',
    text2: '#aaaaaa',
    accent: '#FFD700',
    banner: '#1f1f1f',
    bannerBackground: '#1f1f1f',
    bannerText: '#FFD700',
    inactiveHeart: '#444444',
    favBtnBg: '#FFD700',
    favBtnText: '#000000',
    shadow: 'rgba(0,0,0,0.4)',
    border: '#333333',
    statusBarStyle: 'light-content',
  },
  light: {
    bg: '#f0f4f8',
    background: '#f0f4f8',
    card: '#ffffff',
    text: '#1f2937',
    text2: '#4b5563',
    accent: 'rgb(67, 80, 105)',
    banner: '#1f1f1f',
    bannerBackground: '#1f1f1f',
    bannerText: '#ffffff',
    inactiveHeart: '#1f2937',
    favBtnBg: '#1f2937',
    favBtnText: '#ffffff',
    shadow: 'rgba(0,0,0,0.1)',
    border: '#d1d5db',
    statusBarStyle: 'dark-content',
  },
};

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState('dark');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((storedTheme) => {
        if (isActive && (storedTheme === 'dark' || storedTheme === 'light')) {
          setThemeName(storedTheme);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isActive) setIsReady(true);
      });
    return () => { isActive = false; };
  }, []);

  useEffect(() => {
    if (isReady) AsyncStorage.setItem(THEME_STORAGE_KEY, themeName).catch(() => {});
  }, [isReady, themeName]);

  const setIsDarkMode = useCallback((value) => {
    setThemeName((currentTheme) => {
      const nextTheme = typeof value === 'function' ? value(currentTheme === 'dark') : value;
      const nextThemeName = nextTheme ? 'dark' : 'light';
      return nextThemeName;
    });
  }, []);

  const value = useMemo(() => ({
    theme: themes[themeName],
    themeName,
    isDarkMode: themeName === 'dark',
    setIsDarkMode,
    isThemeReady: isReady,
  }), [isReady, setIsDarkMode, themeName]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
