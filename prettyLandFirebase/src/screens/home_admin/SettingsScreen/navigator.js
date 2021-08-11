import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsCategoryScreen from './settingsCategory';
import ViewSettingsForm from './viewSettingsForm';
import NewAdminFormScreen from './addNewAdmin';
import NewBankFormScreen from './addNewBankAccount';
import AdminListScreen from './adminList';
import MemberListScreen from './memberList';
import PartnerListScreen from './partnerList';
import AdminDetailScreen from './adminDetail';
import SendBroadcast from './sendBroadcast';

import { LogoTitle } from '../../../components/Header';

const Stack = createNativeStackNavigator();

const AdminSettingsNavigator = ({ navigation, route }) => {
  const { userId, role } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings-Category"
        component={SettingsCategoryScreen}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
          headerShown: false,
        }}
        initialParams={{ userId, role }}
      />
      <Stack.Screen
        name="View-Settings"
        component={ViewSettingsForm}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="New-Admin-Form"
        component={NewAdminFormScreen}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="New-Bank-Form"
        component={NewBankFormScreen}
        options={{
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="Admin-Lists"
        component={AdminListScreen}
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
        name="Member-Register-Lists"
        component={MemberListScreen}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="Partner-Register-Lists"
        component={PartnerListScreen}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="Admin-Detail"
        component={AdminDetailScreen}
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
        name="Send-Broadcast"
        component={SendBroadcast}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
  );
};

export default AdminSettingsNavigator;
