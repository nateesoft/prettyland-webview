import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  const goDetail = () => {
    navigation.navigate('Detail');
  };
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button title="Go to detail screen" onPress={goDetail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
