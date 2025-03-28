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
import { getGreeting } from '../utils/getGreeting';
import { useHabits } from '../contexts/HabitsContext';
import { isHabitForToday } from '../utils/isHabitForToday';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const greeting = getGreeting();
  const today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const navigation = useNavigation();
  const { habits, markHabitAsDone } = useHabits();

  const todayHabits = habits.filter(isHabitForToday);
  const completed = todayHabits.filter(h => h.isDoneToday).length;
  const total = todayHabits.length;
  const percent = Math.round((completed / (total || 1)) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.date}>{today}</Text>

      <View style={{ marginTop: 20 }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Сегодня</Text>
          <Text style={styles.progressLabel}>
            {completed} из {total} ({percent}%)
          </Text>
        </View>
        <ProgressBar progress={percent / 100} />
      </View>

      <ScrollView
        contentContainerStyle={styles.habitList}
        showsVerticalScrollIndicator={false}
      >
        {todayHabits.length === 0 ? (
          <Text style={styles.emptyText}>
            На сегодня привычек нет. Добавьте первую!
          </Text>
        ) : (
          todayHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onMarkDone={() => markHabitAsDone(habit.id)}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddHabit' as never)}
      >
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  habitList: {
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
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
