import {Habit} from '../data/types';

/**
 * Возвращает следующую дату выполнения привычки
 * @param habit привычка
 */
export function getNextHabitDate(habit: Habit): Date | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // обнуляем время
  const currentDay = today.getDay(); // 0 — воскресенье, 6 — суббота

  // 📅 Каждодневные привычки
  if (habit.frequency === 'everyday') {
    const next = new Date(today);
    next.setDate(today.getDate() + 1);
    return next;
  }

  // 📅 Будние дни (Пн–Пт)
  if (habit.frequency === 'weekdays') {
    let next = new Date(today);
    for (let i = 1; i <= 7; i++) {
      next.setDate(today.getDate() + i);
      const day = next.getDay();
      if (day >= 1 && day <= 5) return next;
    }
  }

  // 📅 Выбранные дни недели (custom)
  if (habit.frequency === 'custom' && habit.customDays?.length) {
    let next = new Date(today);
    for (let i = 1; i <= 7; i++) {
      next.setDate(today.getDate() + i);
      const day = next.getDay(); // 0 = воскресенье ... 6 = суббота
      if (habit.customDays.includes(day)) return next;
    }
  }

  return null;
}
