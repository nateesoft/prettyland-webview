import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function DetailScreen({ navigation }) {
  const goHome = () => {
    navigation.navigate('Home');
  };
  return (
    <View style={styles.container}>
      <Text>Detail Screen</Text>
      <Button title="Go Home" onPress={goHome} />
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
