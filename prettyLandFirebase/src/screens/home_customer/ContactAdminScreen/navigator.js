import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ViewContactScreen from './viewContact';
import { LogoTitle } from '../../../components/Header';

const Stack = createNativeStackNavigator();

const ContactAdminNavigator = ({ navigation, route }) => {
  const { userId } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="View-Profile"
        component={ViewContactScreen}
        options={{
          title: 'Edit-Profile',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerShown: false,
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ userId }}
      />
    </Stack.Navigator>
  );
};

export default ContactAdminNavigator;
