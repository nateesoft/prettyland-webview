import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomerDashboard from './customerDashboard';
import PartnerListCountryScreen from './partnerListCountry';
import SelectProvinceForm from './selectProvince';
import SelectProvinceFormType4 from './selectProvinceType4';
import PlaceForm from './placeForm';
import TimePriceForm from './timePriceForm';
import PartnerImageScreen from './partnerImage';
import { LogoTitle } from '../../../components/Header';
import ImagePreviewScreen from './imagePreview';

const Stack = createNativeStackNavigator();

const CustomerHomeTabNavigator = ({ navigation, route }) => {
  const { userId, status } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Customer-Dashboard"
        component={CustomerDashboard}
        options={{
          title: 'Back',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTitle: props => (
            <LogoTitle title="กลุ่มน้อง ๆ  ที่เลือกได้" {...props} />
          ),
        }}
        initialParams={{ userId, status }}
      />
      <Stack.Screen
        name="Partner-List-Country"
        component={PartnerListCountryScreen}
        initialParams={{ userId, status }}
      />
      <Stack.Screen
        name="Select-Province-Form"
        component={SelectProvinceForm}
        options={{
          title: 'เลือกจังหวัด',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{
          pageFrom: 'Select-Province-Form',
          userId,
          status,
        }}
      />
      <Stack.Screen
        name="Select-Province-Form-Type4"
        component={SelectProvinceFormType4}
        options={{
          title: 'เลือกจังหวัด',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{
          pageFrom: 'Select-Province-Form',
          userId,
          status,
        }}
      />
      <Stack.Screen
        name="Place-Form"
        component={PlaceForm}
        options={{
          title: 'ข้อมูลสถานที่',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{
          pageFrom: 'Select-Province-Form',
          userId,
          status,
        }}
      />
      <Stack.Screen
        name="Time-Price-Form"
        component={TimePriceForm}
        options={{
          title: 'เวลาเริ่ม',
          headerStyle: {
            backgroundColor: '#ff2fe6',
          },
          headerTintColor: 'white',
          headerTitle: props => <LogoTitle title="Pretty Land" {...props} />,
        }}
        initialParams={{
          pageFrom: 'Select-Province-Form',
          userId,
          status,
        }}
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
    </Stack.Navigator>
  );
};

export default CustomerHomeTabNavigator;
