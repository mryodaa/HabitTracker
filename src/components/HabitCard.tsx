import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Habit} from '../data/types';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import {getNextHabitDate} from '../utils/getNextHabitDate';

interface Props {
  habit: Habit;
  onPress?: () => void;
  onMarkDone?: () => void;
}

const HabitCard = ({habit, onPress, onMarkDone}: Props) => {
  const lastDone = habit.lastDone
    ? format(new Date(habit.lastDone), 'd MMMM', {locale: ru})
    : 'Нет данных';

  const progressText =
    habit.durationDays != null
      ? `Прогресс: ${Math.min(
          Math.floor(
            (Date.now() - new Date(habit.createdAt).getTime()) / 86400000,
          ),
          habit.durationDays,
        )}/${habit.durationDays}`
      : 'Без ограничения';

  const nextDate = getNextHabitDate(habit);
  const formattedNextDate = nextDate
    ? format(nextDate, 'd MMMM (EEEE)', {locale: ru})
    : 'Неизвестно';

  const today = new Date().toISOString().slice(0, 10);
  const isMissedToday = habit.missedDates.includes(today);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        habit.isDoneToday
          ? styles.cardDone
          : isMissedToday
          ? styles.cardMissed
          : null,
      ]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{habit.title}</Text>
        <Text style={styles.meta}>📅 Повтор: {habit.frequency}</Text>
        <Text style={styles.meta}>📈 {progressText}</Text>
        <Text style={styles.meta}>🕓 Последний раз: {lastDone}</Text>
        <Text style={styles.meta}>🔁 Следующее: {formattedNextDate}</Text>
      </View>
      <TouchableOpacity onPress={onMarkDone} activeOpacity={0.6}>
        <View
          style={[
            styles.checkbox,
            habit.isDoneToday && {backgroundColor: '#4caf50'},
          ]}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default HabitCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  cardDone: {
    backgroundColor: '#e0f5e9',
  },
  cardMissed: {
    backgroundColor: '#f0f0f0',
  },
  textBlock: {
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4caf50',
    borderRadius: 6,
  },
});
