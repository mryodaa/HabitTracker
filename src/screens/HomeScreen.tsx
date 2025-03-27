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
      frequency: 'Каждый день',
      progress: '5/30',
      lastDone: 'Сегодня',
    },
    {
      id: '2',
      title: 'Чтение 10 мин',
      frequency: 'Будни',
      progress: '2/20',
      lastDone: 'Вчера',
    },
    {
      id: '3',
      title: 'Прогулка',
      frequency: 'Через день',
      progress: '10/15',
      lastDone: '2 дня назад',
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
        {dummyHabits.map((habit, index) => (
          <HabitCard
            id={`${habit.id}`}
            key={index}
            title={habit.title}
            frequency={habit.frequency}
            progress={habit.progress}
            lastDone={habit.lastDone}
          />
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
