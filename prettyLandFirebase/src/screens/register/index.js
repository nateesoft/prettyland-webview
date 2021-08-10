import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterForm from './registerLoginForm';

const Stack = createNativeStackNavigator();

export default function RegisterHome() {
  return (
    <Stack.Navigator initialRouteName="RegisterForm">
      <Stack.Screen
        name="RegisterForm"
        component={RegisterForm}
        options={{ title: 'Back', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
