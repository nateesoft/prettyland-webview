import React from 'react';
import { AntDesign } from 'react-native-vector-icons';

export const GetIcon = ({ type, name, size = 24, color = 'black' }) => {
  // if (type === 'mci') {
  //   return <MaterialCommunityIcons name={name} size={size} color={color} />;
  // }
  // if (type === 'mi') {
  //   return <MaterialIcons name={name} size={size} color={color} />;
  // }
  // if (type === 'fa') {
  //   return <FontAwesome name={name} size={size} color={color} />;
  // }
  // if (type === 'ad') {
  return <AntDesign name={name} size={size} color={color} />;
  // }
  // if (type === 'ii') {
  //   return <Ionicons name={name} size={size} color={color} />;
  // }
  // if (type === 'fa5') {
  //   return <FontAwesome5 name={name} size={size} color={color} />;
  // }
  // return null;
};
