import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterForm from './registerLoginForm';
import RegisterPlanForm from '../home_partner/ProfileScreen/registerPlanForm';
import RegisterPartner from '../home_partner/ProfileScreen/registerPartner';
import RegisterBankForm from '../home_partner/ProfileScreen/registerBankForm';
import RegisterImageUpload from '../home_partner/ProfileScreen/registerImageUpload';

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
        initialParams={{ goTo: 'RegisterPartner' }}
      />
      <Stack.Screen
        name="RegisterPartner"
        component={RegisterPartner}
        options={{ title: 'Back', headerShown: false }}
        initialParams={{ goTo: 'RegisterBankForm' }}
      />
      <Stack.Screen
        name="RegisterBankForm"
        component={RegisterBankForm}
        options={{ title: 'Back', headerShown: false }}
        initialParams={{ goTo: 'RegisterImageUpload' }}
      />
      <Stack.Screen
        name="RegisterImageUpload"
        component={RegisterImageUpload}
        options={{ title: 'Back', headerShown: false }}
        initialParams={{ goTo: 'WelcomeApp' }}
      />
    </Stack.Navigator>
  );
}
