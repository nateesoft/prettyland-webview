import React from 'react';
import { Image, View, Text } from 'react-native';

import Logo from '../../../assets/login.png';

export const LogoTitle = ({ title }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Image style={{ width: 30, height: 30, marginRight: 15 }} source={Logo} />
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
        {title}
      </Text>
    </View>
  );
};
