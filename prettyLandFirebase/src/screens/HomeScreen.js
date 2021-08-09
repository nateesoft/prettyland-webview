import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, LogBox } from 'react-native';
import firebase from '../../firebaseSetup';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);

export default function HomeScreen({ navigation }) {
  const goDetail = () => {
    navigation.navigate('Detail');
  };

  useEffect(() => {
    console.log('Initial Home Screen');
    firebase
      .database()
      .ref('demo/bank_account')
      .once('value', snapshot => {
        console.log(snapshot.val());
      });
  }, []);

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
