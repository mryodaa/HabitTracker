import React, {createContext, useContext, useEffect, useState} from 'react';
import {Habit} from '../data/types';
import {storage, HABITS_KEY} from '../storage/mmkv';
import {isHabitForToday} from '../utils/isHabitForToday';

const LAST_RESET_KEY = 'lastResetDate';

interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitDone: (id: string) => void;
  resetDailyState: () => void;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export const HabitsProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const raw = storage.getString(HABITS_KEY);
    if (raw) {
      try {
        const parsed: Habit[] = JSON.parse(raw);
        setHabits(parsed);

        // ⏱ Проверка по lastResetDate
        const today = new Date().toISOString().slice(0, 10);
        const lastReset = storage.getString(LAST_RESET_KEY);
        if (lastReset !== today) {
          setTimeout(() => {
            resetDailyState();
            storage.set(LAST_RESET_KEY, today);
          }, 0);
        }
      } catch (err) {
        console.warn('Ошибка парсинга habits из MMKV:', err);
      }
    }
  }, []);

  useEffect(() => {
    storage.set(HABITS_KEY, JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  };

  const updateHabit = (updated: Habit) => {
    setHabits(prev => prev.map(h => (h.id === updated.id ? updated : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const toggleHabitDone = (id: string) => {
    const today = new Date().toISOString();
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id
          ? {
              ...habit,
              isDoneToday: !habit.isDoneToday,
              lastDone: !habit.isDoneToday ? today : undefined,
            }
          : habit,
      ),
    );
  };

  const resetDailyState = () => {
    const today = new Date().toISOString().slice(0, 10);

    setHabits(prev =>
      prev.map(habit => {
        const last = habit.lastDone?.slice(0, 10);
        const wasDoneToday = last === today;

        const shouldTrack =
          !wasDoneToday &&
          habit.isDoneToday === false &&
          isHabitForToday(habit);

        return {
          ...habit,
          isDoneToday: false,
          missedDates: shouldTrack
            ? [...habit.missedDates, today]
            : habit.missedDates,
        };
      }),
    );
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitDone,
        resetDailyState,
      }}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) throw new Error('useHabits must be used within HabitsProvider');
  return context;
};
