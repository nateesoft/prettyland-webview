import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PostListScreen from './postList';
import PartnerSelectScreen from './partnerListSelect';
import PartnerImageScreen from './partnerImage';
import ImagePreviewScreen from './imagePreview';
import PaymentForm from './payment';
import ReviewTaskScreen from './reviewTask';

import { LogoTitle } from '../../../components/Header';

const Stack = createNativeStackNavigator();

const CustomerWorkTabNavigator = ({ navigation, route }) => {
  const { userId } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Post-List"
        component={PostListScreen}
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
        name="Partner-List-Select"
        component={PartnerSelectScreen}
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
        name="Partner-Image"
        component={PartnerImageScreen}
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
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="Payment-Form"
        component={PaymentForm}
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
        name="Review-Task"
        component={ReviewTaskScreen}
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
    </Stack.Navigator>
  );
};

export default CustomerWorkTabNavigator;
