import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ViewProfileScreen from './viewProfile';
import { LogoTitle } from '../../../components/Header';

const Stack = createNativeStackNavigator();

const ProfileNavigator = ({ navigation, route }) => {
  const { userId, status } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="View-Admin-Profile"
        component={ViewProfileScreen}
        options={{
          title: 'Edit-Admin-Profile',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerShown: false,
        }}
        initialParams={{ userId, status }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
