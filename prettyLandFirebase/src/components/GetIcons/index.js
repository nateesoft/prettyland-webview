import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const GetIcon = ({ type, name, size = 24, color = 'black' }) => {
  if (type === 'mci') {
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  }
  if (type === 'mi') {
    return <MaterialIcons name={name} size={size} color={color} />;
  }
  if (type === 'fa') {
    return <FontAwesome name={name} size={size} color={color} />;
  }
  if (type === 'ad') {
    return <AntDesign name={name} size={size} color={color} />;
  }
  if (type === 'ii') {
    return <Ionicons name={name} size={size} color={color} />;
  }
  if (type === 'fa5') {
    return <FontAwesome5 name={name} size={size} color={color} />;
  }
  return null;
};
