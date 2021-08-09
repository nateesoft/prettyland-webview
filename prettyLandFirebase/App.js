import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeApp from './src/screen';
import HomeScreen from './src/screen/HomeScreen';
import DetailScreen from './src/screen/DetailScreen';
import NotificationScreen from './src/screen/NotificationScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeApp">
        <Stack.Screen
          name="WelcomeApp"
          component={WelcomeApp}
          options={{ title: 'Welcome', headerShown: false }}
        />
        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{ title: 'Notification' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Detail' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
