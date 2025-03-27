import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Habit} from '../data/types';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';

interface Props {
  habit: Habit;
  onPress?: () => void;
}

const HabitCard = ({habit, onPress}: Props) => {
  const lastDone = habit.lastDone
    ? format(new Date(habit.lastDone), 'd MMMM', {locale: ru})
    : 'Нет данных';

  const progress =
    habit.durationDays != null
      ? `Прогресс: ${Math.min(
          Math.floor(
            (Date.now() - new Date(habit.createdAt).getTime()) / 86400000,
          ),
          habit.durationDays,
        )}/${habit.durationDays}`
      : 'Без ограничения';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{habit.title}</Text>
        <Text style={styles.meta}>📅 Повтор: {habit.frequency}</Text>
        <Text style={styles.meta}>📈 {progress}</Text>
        <Text style={styles.meta}>🕓 Последний раз: {lastDone}</Text>
      </View>
      <View
        style={[
          styles.checkbox,
          habit.isDoneToday && {backgroundColor: '#4caf50'},
        ]}
      />
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
