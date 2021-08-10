import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MemberAllListScreen from './memberList';
import MemberDetailScreen from './memberDetail';
import ImagePreviewScreen from './imagePreview';

import { LogoTitle } from '../../../components/Header';

const Stack = createNativeStackNavigator();

const AdminMemberNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="List-All-Member"
        component={MemberAllListScreen}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
      />
      <Stack.Screen
        name="Member-Detail"
        component={MemberDetailScreen}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
      />
      <Stack.Screen
        name="Image-Preview"
        component={ImagePreviewScreen}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default AdminMemberNavigator;
