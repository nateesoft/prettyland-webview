import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { getMemberProfile } from '../../../apis';
import ProfileHomeScreen from './Home';
import RegisterPlanForm from './registerPlanForm';
import RegisterPartnerForm from './registerPartner';
import RegisterPartnerBankForm from './registerBankForm';
import RegisterPartnerImageUpload from './registerImageUpload';

import { LogoTitle } from '../../../components/Header';

const Stack = createNativeStackNavigator();

const TabNavigator = ({ navigation, route }) => {
  const { userId, status } = route.params;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getMemberProfile(userId).then(data => {
      setProfile(data);
    });
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile-Home"
        component={ProfileHomeScreen}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerShown: false,
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ userId, status }}
      />
      <Stack.Screen
        name="Register-Plan-Form"
        component={RegisterPlanForm}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ userId, status }}
      />
      <Stack.Screen
        name="Register-Partner-Form"
        component={RegisterPartnerForm}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ userId, status }}
      />
      <Stack.Screen
        name="Partner-Register-Bank-Form"
        component={RegisterPartnerBankForm}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ userId, status }}
      />
      <Stack.Screen
        name="Partner-Register-Image-Upload"
        component={RegisterPartnerImageUpload}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{ userId, status }}
      />
    </Stack.Navigator>
  );
};

export default TabNavigator;
