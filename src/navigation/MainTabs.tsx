import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import HabitStatsScreen from '../screens/HabitStatsScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName = 'circle';

          switch (route.name) {
            case 'Главная':
              iconName = 'check-circle';
              break;
            case 'Статистика':
              iconName = 'bar-chart';
              break;
            case 'Добавить':
              iconName = 'add-box';
              break;
            case 'Календарь':
              iconName = 'calendar-month';
              break;
            case 'Настройки':
              iconName = 'settings';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Главная" component={HomeScreen} />
      <Tab.Screen name="Статистика" component={HabitStatsScreen} />
      <Tab.Screen name="Добавить" component={AddHabitScreen} />
      <Tab.Screen name="Календарь" component={CalendarScreen} />
      <Tab.Screen name="Настройки" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
