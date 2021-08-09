import React from 'react';
import { View, Text } from 'react-native';

const ImageNotfound = ({ text = 'ไม่เจอรูปภาพ' }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        borderWidth: 1,
        padding: 10,
        paddingVertical: 20,
        borderColor: '#ccc',
        borderRadius: 20,
      }}>
      <Text style={{ fontSize: 16 }}>{text}</Text>
    </View>
  );
};

export default ImageNotfound;
