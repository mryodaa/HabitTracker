import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import {nanoid} from 'nanoid/non-secure';
import {useHabits} from '../contexts/HabitsContext';
import {Habit} from '../data/types';
import {
  requestNotificationPermission,
  createDefaultChannel,
  scheduleHabitNotification,
} from '../utils/notifications';
import Toast from 'react-native-toast-message';

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const AddHabitScreen = () => {
  const {addHabit} = useHabits();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<
    'everyday' | 'weekdays' | 'custom'
  >('everyday');
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleDay = (dayIndex: number) => {
    setCustomDays(prev =>
      prev.includes(dayIndex)
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex],
    );
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Введите название привычки');
      return;
    }

    try {
      const newHabit: Habit = {
        id: nanoid(),
        title,
        frequency,
        customDays: frequency === 'custom' ? customDays : undefined,
        time: time ? time.toTimeString().slice(0, 5) : undefined,
        description: description.trim() || undefined,
        durationDays: durationDays ? parseInt(durationDays, 10) : undefined,
        createdAt: new Date().toISOString(),
        isDoneToday: false,
        lastDone: undefined,
        missedDates: [],
        notificationsEnabled,
        notificationTime:
          notificationsEnabled && time
            ? time.toTimeString().slice(0, 5)
            : undefined,
      };

      addHabit(newHabit);
      await requestNotificationPermission();
      await createDefaultChannel();
      await scheduleHabitNotification(newHabit);

      Toast.show({
        type: 'success',
        text1: 'Привычка создана!',
        position: 'bottom',
        bottomOffset: 60,
      });
      setTimeout(() => {
        // очищаем форму
        setTitle('');
        setFrequency('everyday');
        setCustomDays([]);
        setDescription('');
        setDurationDays('');
        setNotificationsEnabled(false);
        setTime(null);
        setSuccess(false);
        navigation.goBack();
      }, 100); // 1 секунда
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        bottomOffset: 60,
        text1: 'Ошибка',
        text2: (error as Error).message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Создать привычку</Text>

      <Text style={styles.label}>Название</Text>
      <TextInput
        style={styles.input}
        placeholder="Например: Пить воду"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Описание (необязательно)</Text>
      <TextInput
        style={styles.input}
        placeholder="Например: по утрам"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Повторяемость</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[
            styles.radio,
            frequency === 'everyday' && styles.radioSelected,
          ]}
          onPress={() => setFrequency('everyday')}>
          <Text>Каждый день</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radio,
            frequency === 'weekdays' && styles.radioSelected,
          ]}
          onPress={() => setFrequency('weekdays')}>
          <Text>Будни</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radio, frequency === 'custom' && styles.radioSelected]}
          onPress={() => setFrequency('custom')}>
          <Text>Выборочно</Text>
        </TouchableOpacity>
      </View>

      {frequency === 'custom' && (
        <View style={styles.daysRow}>
          {weekDays.map((label, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.day,
                customDays.includes(index) && styles.daySelected,
              ]}
              onPress={() => toggleDay(index)}>
              <Text style={styles.dayLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Продолжительность (дней)</Text>
      <TextInput
        style={styles.input}
        placeholder="Например: 30"
        value={durationDays}
        onChangeText={setDurationDays}
        keyboardType="numeric"
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Уведомления</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      {notificationsEnabled && (
        <>
          <Text style={styles.label}>Время напоминания</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker(true)}>
            <Text>
              {time ? time.toTimeString().slice(0, 5) : 'Выбрать время'}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={time || new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setTime(selectedDate);
              }}
            />
          )}
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Создать</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddHabitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 12,
  },
  radio: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  radioSelected: {
    backgroundColor: '#d0f0d0',
    borderColor: '#4caf50',
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  day: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: 40,
    alignItems: 'center',
  },
  daySelected: {
    backgroundColor: '#d0f0d0',
    borderColor: '#4caf50',
  },
  dayLabel: {
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
