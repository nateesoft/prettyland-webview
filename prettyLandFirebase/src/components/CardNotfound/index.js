import React from 'react';
import { View, Text } from 'react-native';

const CardNotfound = ({ text = 'ไม่พบข้อมูลในระบบ' }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        marginTop: 20,
        padding: 20,
      }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'gray' }}>
        {text}
      </Text>
    </View>
  );
};

export default CardNotfound;
