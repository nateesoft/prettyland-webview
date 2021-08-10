import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

/* all screen */
import HomeScreen from './HomeScreen/navigator';
import WorkScreen from './WorkScreen/navigator';
import ContactAdminScreen from './ContactAdminScreen/navigator';

/* Logout */
import firebase from '../../util/firebase';
import { getDocument } from '../../util';
import LogoutScreen from '../logout';
import { AppConfig } from '../../Constants';

const Tab = createBottomTabNavigator();

const HomeCustomer = ({ navigation, route }) => {
  const { userId, status } = route.params;
  const [postsChangeCount, setPostsChangeCount] = useState(0);

  const getCustomerPostChange = snapshot => {
    return new Promise((resolve, reject) => {
      const list = snapshot.val();
      let count = 0;
      for (let key in list) {
        const postObj = list[key];
        if (
          postObj.status === AppConfig.PostsStatus.waitCustomerPayment &&
          postObj.customerId === userId
        ) {
          count = count + 1;
        }
      }
      resolve(count);
    });
  };

  useEffect(() => {
    const ref = firebase.database().ref(getDocument('posts'));
    const listener = ref.on('value', snapshot => {
      getCustomerPostChange(snapshot).then(res => setPostsChangeCount(res));
    });

    return () => ref.off('value', listener);
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="c-Home"
        component={HomeScreen}
        options={{
          title: 'หน้าหลัก',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color="white" size={size} />
          ),
          headerShown: false,
          color: 'white',
        }}
        initialParams={{ userId, status }}
      />
      <Tab.Screen
        name="c-Work"
        component={WorkScreen}
        options={{
          tabBarLabel: 'รายการโพสท์',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="post" color="white" size={size} />
          ),
          headerShown: false,
          tabBarBadge: postsChangeCount ? postsChangeCount : null,
          tabBarBadgeStyle: {
            backgroundColor: 'rgb(70, 240, 238)',
            color: 'red',
          },
        }}
        initialParams={{ userId, status }}
      />
      <Tab.Screen
        name="c-Contact-Admin"
        component={ContactAdminScreen}
        options={{
          tabBarLabel: 'ติดต่อ Admin',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="contact-phone" color="white" size={size} />
          ),
        }}
        initialParams={{ userId, status }}
      />
      <Tab.Screen
        name="c-Logout"
        component={LogoutScreen}
        options={{
          tabBarLabel: 'Logout',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="logout" color="white" size={size} />
          ),
        }}
        initialParams={{ userId, status }}
      />
    </Tab.Navigator>
  );
};

export default HomeCustomer;
