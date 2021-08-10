import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Ionicons,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from 'react-native-vector-icons';
// import { View, Text } from 'react-native';

/* all screen */
import CustomerPostNavigator from './CustomerPostScreen/navigator';
import MemberNavigator from './MemberScreen/navigator';
import ProfileNavigator from './ProfileScreen/navigator';
import SettingsNavigator from './SettingsScreen/navigator';

/* Logout */
import LogoutScreen from '../logout';
import firebase from '../../util/firebase';
import { getDocument } from '../../util';
import { AppConfig } from '../../Constants';

const Tab = createBottomTabNavigator();

const HomeAdmin = ({ navigation, route }) => {
  const { userId, screen } = route.params;
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const ref = firebase
      .database()
      .ref(getDocument('members'))
      .orderByChild('status')
      .equalTo(AppConfig.MemberStatus.newRegister);
    const listener = ref.on('value', snapshot => {
      setMemberCount(snapshot.numChildren());
    });
    return () => ref.off('value', listener);
  }, []);

  // const HomeScreen = () => (
  //   <View>
  //     <Text>HomeScreen: {userId}</Text>
  //   </View>
  // );
  // const SettingsScreen = () => (
  //   <View>
  //     <Text>SettingsScreen: {screen}</Text>
  //   </View>
  // );

  // return (
  //   <Tab.Navigator>
  //     <Tab.Screen name="Home" component={HomeScreen} />
  //     <Tab.Screen name="Settings" component={SettingsScreen} />
  //   </Tab.Navigator>
  // );

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="a-Task"
        component={CustomerPostNavigator}
        options={{
          title: 'โพสท์ทั้งหมด',
        }}
        initialParams={{ userId }}
      />
      <Tab.Screen
        name="a-Member"
        component={MemberNavigator}
        options={{
          title: 'สมาชิกในระบบ',
          tabBarBadge: memberCount ? memberCount : null,
          tabBarBadgeStyle: {
            backgroundColor: 'rgb(70, 240, 238)',
            color: 'red',
          },
        }}
        initialParams={{ userId }}
      />
      <Tab.Screen
        name="a-Profile"
        component={ProfileNavigator}
        options={{
          title: 'ข้อมูลส่วนตัว',
        }}
        initialParams={{ userId }}
      />
      <Tab.Screen
        name="a-Settings"
        component={SettingsNavigator}
        options={{
          title: 'ตั้งค่าระบบ',
        }}
        initialParams={{ userId, role: screen }}
      />
      <Tab.Screen
        name="a-Logout"
        component={LogoutScreen}
        options={{
          title: 'Logout',
        }}
        initialParams={{ userId }}
      />
    </Tab.Navigator>
  );
};

export default HomeAdmin;
