import React, {createContext, useContext, useEffect, useState} from 'react';
import {Habit} from '../data/types';
import {storage, HABITS_KEY} from '../storage/mmkv';

interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
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

  return (
    <HabitsContext.Provider
      value={{habits, addHabit, updateHabit, deleteHabit}}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) throw new Error('useHabits must be used within HabitsProvider');
  return context;
};
