import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PartnerDashboard from './partnerDashboard';
import AllTaskListScreen from './allTaskList';
import AllCustomerPostListScreen from './allCustomerPostList';
import TaskDetail from './taskDetail';
import SelectProvince from './selectProvince';
import SelectProvinceTaskList from './selectProvinceTaskList';
import PriceFormDetail from './priceFormDetail';

import { LogoTitle } from '../../../components/Header';

const Stack = createNativeStackNavigator();

const StackNavigator = ({ navigation, route }) => {
  const { userId } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Partner-Dashboard"
        component={PartnerDashboard}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => (
            <LogoTitle title="โหมดงานที่ลงทะเบียนไว้" {...props} />
          ),
        }}
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="All-Task-List"
        component={AllTaskListScreen}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ partnerType: 'all', userId }}
      />
      <Stack.Screen
        name="All-Customer-Post-List"
        component={AllCustomerPostListScreen}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ partnerType: 'all', userId }}
      />
      <Stack.Screen
        name="Task-Detail"
        component={TaskDetail}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ partnerType: 'all', userId }}
      />
      <Stack.Screen
        name="Select-Province"
        component={SelectProvince}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ partnerType: 'all', userId }}
      />
      <Stack.Screen
        name="Select-Province-Task-List"
        component={SelectProvinceTaskList}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ partnerType: 'all', userId }}
      />
      <Stack.Screen
        name="Price-Form-Detail"
        component={PriceFormDetail}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ partnerType: 'all', userId }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
