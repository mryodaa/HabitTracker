import React, {useContext} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ThemeContext} from './src/contexts/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const {theme} = useContext(ThemeContext);

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Главная" component={HomeScreen} />
        {/* Добавим позже: Статистика, Настройки */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
