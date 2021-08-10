import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginForm from './loginForm';

const Stack = createNativeStackNavigator();

export default function RegisterHome() {
  return (
    <Stack.Navigator initialRouteName="LoginForm">
      <Stack.Screen
        name="LoginForm"
        component={LoginForm}
        options={{ title: 'Back', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
