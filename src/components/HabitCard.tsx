import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Habit} from '../data/types';

interface Props extends Habit {
  onPress?: () => void;
}

const HabitCard = ({title, frequency, progress, lastDone, onPress}: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>📅 Повтор: {frequency}</Text>
        <Text style={styles.meta}>📈 Прогресс: {progress}</Text>
        <Text style={styles.meta}>🕓 Последний раз: {lastDone}</Text>
      </View>
      <View style={styles.checkbox} />
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
