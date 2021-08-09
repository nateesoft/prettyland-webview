import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeApp from './src/screens';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import NotificationScreen from './src/screens/NotificationScreen';

import RegisterHome from './src/screens/register';
import LoginHome from './src/screens/login';

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
        {/* Register Form */}
        <Stack.Screen
          name="Register"
          component={RegisterHome}
          options={{ title: 'Register', headerShown: false }}
        />
        {/* Login Form */}
        <Stack.Screen
          name="Login"
          component={LoginHome}
          options={{ title: 'Login', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
