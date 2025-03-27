import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ProgressBar from '../components/ProgressBar';
import HabitCard from '../components/HabitCard';
import {getGreeting} from '../utils/getGreeting';
import {Habit} from '../data/types';

const HomeScreen = () => {
  const greeting = getGreeting();
  const today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const dummyHabits: Habit[] = [
    {
      id: '1',
      title: 'Пить воду',
      frequency: 'everyday',
      time: '08:00',
      description: 'Не забыть выпить 2 стакана',
      durationDays: 30,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 дней назад
      lastDone: new Date().toISOString(),
      isDoneToday: true,
      missedDates: [],
      notificationsEnabled: true,
      notificationTime: '08:00',
    },
    {
      id: '2',
      title: 'Чтение 10 мин',
      frequency: 'weekdays',
      durationDays: 20,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      lastDone: undefined,
      isDoneToday: false,
      missedDates: ['2025-03-25'],
      notificationsEnabled: false,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.date}>{today}</Text>

      <View style={{marginTop: 20}}>
        <Text style={styles.sectionTitle}>Сегодня</Text>
        <ProgressBar progress={0.33} />
      </View>

      <ScrollView
        contentContainerStyle={styles.habitList}
        showsVerticalScrollIndicator={false}>
        {dummyHabits.map(habit => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
  },
  date: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  habitList: {
    paddingVertical: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4caf50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
