import notifee, {
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';
import {Platform} from 'react-native';
import {Habit} from '../data/types';

export async function requestNotificationPermission() {
  await notifee.requestPermission();
}

export async function createDefaultChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Обычные уведомления',
    });
  }
}

export async function scheduleHabitNotification(habit: Habit) {
  if (!habit.notificationTime || !habit.notificationsEnabled) return;

  const [hour, minute] = habit.notificationTime.split(':').map(Number);

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);

  if (date.getTime() < Date.now()) {
    date.setDate(date.getDate() + 1); // перенести на следующий день
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      title: habit.title,
      body: habit.description || 'Пора выполнить привычку!',
      android: {
        channelId: 'default',
      },
    },
    trigger,
  );
}
