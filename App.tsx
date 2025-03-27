import React, {useContext} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ThemeContext} from './src/contexts/ThemeContext';
import MainTabs from './src/navigation/MainTabs';

// Страницы вне табов:
import HabitDetailScreen from './src/screens/HabitDetailScreen';
import EditHabitScreen from './src/screens/EditHabitScreen';
import HabitHistoryScreen from './src/screens/HabitHistoryScreen';
import HabitStatsScreen from './src/screens/HabitStatsScreen';
import ReminderSettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {theme} = useContext(ThemeContext);

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
        <Stack.Screen name="EditHabit" component={EditHabitScreen} />
        <Stack.Screen name="HabitHistory" component={HabitHistoryScreen} />
        <Stack.Screen name="HabitStats" component={HabitStatsScreen} />
        <Stack.Screen
          name="ReminderSettings"
          component={ReminderSettingsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
