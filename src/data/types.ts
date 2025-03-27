export type Priority = 'low' | 'medium' | 'high';
export type RepeatType = 'none' | 'daily' | 'weekly';

export type Task = {
  id: string;
  title: string;
  category: string;
  date: string;
  time?: string;
  priority: Priority;
  repeat: RepeatType;
  isDone: boolean;
  notificationId?: string; // 👈 добавили
};

// THEME
export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  text: string;
  button: string;
  buttonText: string;
}
