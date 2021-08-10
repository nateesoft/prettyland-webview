import React from 'react';
import {
  StyleSheet,
  Alert,
  View,
  Text,
  ImageBackground,
  LogBox,
} from 'react-native';
import { Button } from 'react-native-elements';
import { MaterialIcons } from 'react-native-vector-icons';

import { AppConfig } from '../../Constants';

const LogoutScreen = ({ navigation, route }) => {
  const signOut = () => console.log('signOut');

  LogBox.ignoreLogs(['Setting a timer']);

  const handleLogoutConfirm = () => {
    Alert.alert(
      'แจ้งเตือน',
      'คุณต้องการออกจากระบบ Pretty Land ใช่ไหรือไม่ ?',
      [
        {
          text: 'ออกจากระบบ',
          onPress: () => signOut(),
        },
        {
          text: 'ยกเลิก',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'pink',
            padding: 20,
            marginBottom: 20,
            opacity: 0.5,
            borderRadius: 5,
          }}>
          <Text
            style={{
              fontSize: 28,
              color: 'red',
              fontWeight: 'bold',
              marginBottom: 20,
            }}>
            ยืนยันการออกจากระบบ ?
          </Text>
        </View>
        <Button
          title="ออกจากระบบ"
          color="red"
          onPress={() => handleLogoutConfirm()}
          buttonStyle={{
            backgroundColor: 'red',
            borderRadius: 5,
            paddingHorizontal: 15,
          }}
          // icon={<MaterialIcons name="logout" size={24} color="white" />}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default LogoutScreen;
