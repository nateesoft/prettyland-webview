import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PostListAllScreen from './postListAll';
import AdminDashboard from './adminDashboard';
import DetailTaskScreen from './detailTask';
import VerifyPaymentSlipScreen from './verifyPaymentSlip';

import { LogoTitle } from '../../../components/Header';

const Stack = createNativeStackNavigator();

const AdminTaskNavigator = ({ navigator, route }) => {
  const { userId } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Admin-Dashboard"
        component={AdminDashboard}
        options={{
          title: 'โพสท์ทั้งหมดในระบบ',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerShown: false,
        }}
        initialParams={{ partnerType: 'all', userId }}
      />
      <Stack.Screen
        name="Post-List-All"
        component={PostListAllScreen}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
        }}
        initialParams={{ partnerType: 'all', userId }}
      />
      <Stack.Screen
        name="Detail-Task"
        component={DetailTaskScreen}
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
        name="Verify-Payment-Slip"
        component={VerifyPaymentSlipScreen}
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

export default AdminTaskNavigator;
