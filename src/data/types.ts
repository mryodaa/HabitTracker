export interface Habit {
  id: string;
  title: string;
  frequency: string;
  progress: string;
  lastDone: string;
}

// THEME
export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  text: string;
  button: string;
  buttonText: string;
}
