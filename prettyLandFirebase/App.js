import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeApp from './src/screens';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import NotificationScreen from './src/screens/NotificationScreen';

import RegisterHome from './src/screens/register';
import LoginHome from './src/screens/login';

import AdminHome from './src/screens/home_admin';
import PartnerHome from './src/screens/home_partner';
import CustomerHome from './src/screens/home_customer';

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
          options={{ title: 'Register' }}
        />
        {/* Login Form */}
        <Stack.Screen
          name="Login"
          component={LoginHome}
          options={{ title: 'Login' }}
        />
        {/* Auth Screen */}
        <Stack.Screen
          name="AdminHome"
          component={AdminHome}
          options={{ title: 'Back', headerShown: false }}
        />
        <Stack.Screen
          name="PartnerHome"
          component={PartnerHome}
          options={{ title: 'Back', headerShown: false }}
        />
        <Stack.Screen
          name="CustomerHome"
          component={CustomerHome}
          options={{ title: 'Back', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
