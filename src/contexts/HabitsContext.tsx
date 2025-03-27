import React, {createContext, useContext, useEffect, useState} from 'react';
import {Habit} from '../data/types';
import {storage, HABITS_KEY} from '../storage/mmkv';

interface HabitsContextType {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  loadHabits: () => void;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export const HabitsProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  const loadHabits = () => {
    const stored = storage.getString(HABITS_KEY);
    if (stored) {
      try {
        const parsed: Habit[] = JSON.parse(stored);
        setHabits(parsed);
      } catch (e) {
        console.error('Failed to parse habits', e);
      }
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    storage.set(HABITS_KEY, JSON.stringify(habits));
  }, [habits]);

  return (
    <HabitsContext.Provider value={{habits, setHabits, loadHabits}}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) throw new Error('useHabits must be used within HabitsProvider');
  return context;
};
