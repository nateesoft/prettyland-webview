import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterForm from './registerLoginForm';
import RegisterPlanForm from '../home_partner/ProfileScreen/registerPlanForm';

const Stack = createNativeStackNavigator();

export default function RegisterHome() {
  return (
    <Stack.Navigator initialRouteName="RegisterForm">
      <Stack.Screen
        name="RegisterForm"
        component={RegisterForm}
        options={{ title: 'Back', headerShown: false }}
      />
      <Stack.Screen
        name="RegisterPlanForm"
        component={RegisterPlanForm}
        options={{ title: 'Back', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
