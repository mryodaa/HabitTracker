export interface Habit {
  id: string;
  title: string;
  frequency: 'everyday' | 'weekdays' | 'custom';
  time?: string; // HH:mm
  description?: string;
  durationDays?: number;
  createdAt: string;
  lastDone?: string;
  isDoneToday: boolean;
  missedDates: string[];
  notificationsEnabled: boolean;
  notificationTime?: string;
}

// THEME
export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  text: string;
  button: string;
  buttonText: string;
}
