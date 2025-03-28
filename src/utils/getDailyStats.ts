import {Habit} from '../data/types';

export const getDailyStats = (habits: Habit[], daysBack = 7) => {
  const stats: {date: string; percent: number}[] = [];

  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const iso = date.toISOString().slice(0, 10);

    const habitsForDay = habits.filter(habit => isHabitForDate(habit, date));

    const total = habitsForDay.length;
    const done = habitsForDay.filter(
      h => h.lastDone?.slice(0, 10) === iso,
    ).length;

    stats.push({
      date: iso,
      percent: total > 0 ? Math.round((done / total) * 100) : 0,
    });
  }

  return stats;
};

// Утилита — использует ту же логику, что isHabitForToday, но на произвольную дату
const isHabitForDate = (habit: Habit, date: Date): boolean => {
  const day = date.getDay(); // 0 = воскресенье
  const weekDayIndex = (day + 6) % 7; // 0 = понедельник

  if (habit.frequency === 'everyday') return true;
  if (habit.frequency === 'weekdays') return weekDayIndex < 5;
  if (habit.frequency === 'custom')
    return habit.customDays?.includes(weekDayIndex) ?? false;

  return false;
};
