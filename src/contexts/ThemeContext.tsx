import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import {ThemeType, ThemeColors} from '../data/types';

// Инициализация MMKV
const storage = new MMKV();

const lightColors: ThemeColors = {
  background: '#ffffff',
  text: '#000000',
  button: '#2196F3',
  buttonText: '#ffffff',
};

const darkColors: ThemeColors = {
  background: '#121212',
  text: '#ffffff',
  button: '#0385ff',
  buttonText: '#000000',
};

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: ThemeColors;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
  colors: lightColors,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  // Определяем системную тему
  const systemColorScheme: ColorSchemeName = Appearance.getColorScheme();
  const systemTheme: ThemeType =
    systemColorScheme === 'dark' ? 'dark' : 'light';

  // Загружаем тему из MMKV или используем системную
  const loadTheme = (): ThemeType => {
    const storedTheme = storage.getString('theme');
    return storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : systemTheme;
  };

  const [theme, setTheme] = useState<ThemeType>(loadTheme);

  // Функция переключения темы
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storage.set('theme', newTheme); // Сохраняем в MMKV
  };

  // Следим за изменением темы системы
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      if (!storage.getString('theme')) {
        setTheme(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => subscription.remove();
  }, []);

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{theme, toggleTheme, colors}}>
      {children}
    </ThemeContext.Provider>
  );
};
