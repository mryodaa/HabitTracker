import {Habit} from '../data/types';

export const isHabitForToday = (habit: Habit): boolean => {
  const today = new Date();
  const day = today.getDay(); // 0 - воскресенье, 6 - суббота

  if (habit.frequency === 'everyday') return true;
  if (habit.frequency === 'weekdays') return day >= 1 && day <= 5;

  // кастомная логика может быть добавлена позже
  return true;
};
