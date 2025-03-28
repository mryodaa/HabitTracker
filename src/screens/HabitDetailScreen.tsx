import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Button,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {BarChart} from 'react-native-chart-kit';

import {useHabits} from '../contexts/HabitsContext';
import {RootStackParamList} from '../navigation/types';
import {getDailyStats} from '../utils/getDailyStats';

const screenWidth = Dimensions.get('window').width - 40;

const HabitDetailScreen = () => {
  const {params} = useRoute<RouteProp<RootStackParamList, 'HabitDetail'>>();
  const {habits, deleteHabit} = useHabits();
  const navigation = useNavigation();
  const habit = habits.find(h => h.id === params.id);

  if (!habit) {
    return (
      <View style={styles.centered}>
        <Text>Привычка не найдена</Text>
      </View>
    );
  }

  const stats = getDailyStats([habit], 7);
  const labels = stats.map(s => s.date.slice(5));
  const data = stats.map(s => s.percent);
  const average =
    stats.reduce((sum, s) => sum + s.percent, 0) / (stats.length || 1);

  const handleDelete = () => {
    Alert.alert(
      'Удалить привычку',
      'Вы уверены, что хотите удалить эту привычку?',
      [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            deleteHabit(habit.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{habit.title}</Text>
      {habit.description && (
        <Text style={styles.description}>{habit.description}</Text>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Повторяемость: {habit.frequency}</Text>
        {habit.time && <Text style={styles.label}>Время: {habit.time}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Статистика</Text>
        <Text style={styles.stat}>
          📊 Средний прогресс: {Math.round(average)}%
        </Text>
        <Text style={styles.stat}>
          ✅ Выполнено: {habit.isDoneToday ? 'Сегодня' : 'Нет'}
        </Text>
        <Text style={styles.stat}>
          ❌ Пропущено: {habit.missedDates.length}
        </Text>
        {habit.lastDone && (
          <Text style={styles.stat}>
            🕓 Последнее выполнение:{' '}
            {new Date(habit.lastDone).toLocaleDateString('ru-RU')}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>История по дням</Text>
        <BarChart
          data={{
            labels,
            datasets: [{data}],
          }}
          width={screenWidth}
          height={220}
          yAxisSuffix="%"
          fromZero
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            labelColor: () => '#555',
          }}
          style={{borderRadius: 8}}
          yAxisLabel=""
        />
      </View>

      <View style={{marginTop: 40}}>
        <Button
          title="Удалить привычку"
          color="#f44336"
          onPress={handleDelete}
        />
      </View>
    </ScrollView>
  );
};

export default HabitDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    marginTop: 4,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: '#444',
  },
  stat: {
    fontSize: 14,
    marginBottom: 4,
  },
});
