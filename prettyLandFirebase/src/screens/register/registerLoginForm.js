import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';
import base64 from 'react-native-base64';
import uuid from 'react-native-uuid';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { AppConfig } from '../../Constants';
import { GetIcon } from '../../components/GetIcons';
import firebase from '../../util/firebase';
import { getDocument, snapshotToArray } from '../../util';
import { saveNewMember } from '../../apis';

const RegisterLoginForm = ({ navigation, route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const signIn = () => {};

  const encryptPassword = password => {
    return base64.encode(password);
  };

  const saveAndGoLoginForm = () => {
    if (!username) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุชื่อเข้าใช้งาน');
      return;
    }
    if (password.length <= 0) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุรหัสผ่าน เพื่อเข้าใช้งาน');
      return;
    }
    if (password.length < 8) {
      Alert.alert('แจ้งเตือน', 'จำนวนรหัสผ่านต้องไม่น้อยกว่า 8 หลัก');
      return;
    }
    if (!rePassword) {
      Alert.alert('แจ้งเตือน', 'กรุณายืนยันรหัสผ่าน');
      return;
    }
    if (password !== rePassword) {
      Alert.alert('แจ้งเตือน', 'รหัสผ่าน และรหัสยืนยันจะต้องตรงกัน !!!');
      return;
    }
    const memberData = {
      username,
      password: encryptPassword(password),
      memberType: 'partner',
      status: AppConfig.MemberStatus.newRegister,
      statusText: AppConfig.MemberStatus.newRegisterMessage,
      status_priority: AppConfig.MemberStatus.newRegisterPriority,
    };

    firebase
      .database()
      .ref(getDocument('members'))
      .orderByChild('username')
      .equalTo(username)
      .once('value', snapshot => {
        const data = snapshotToArray(snapshot);
        if (data.length === 0) {
          const newId = uuid.v4();
          const saveData = {
            id: newId,
            sys_create_date: new Date().toUTCString(),
            sys_update_date: new Date().toUTCString(),
            ...memberData,
          };
          saveNewMember(newId, saveData)
            .then(res => {
              if (res) {
                signIn({ username, password, screen: 'admin' });
              }
            })
            .catch(err => {
              Alert.alert(err);
            });
        } else {
          Alert.alert('แจ้งเตือน', `ข้อมูลผู้ใช้งาน: ${username} มีอยู่แล้ว`, [
            { text: 'OK' },
          ]);
        }
      })
      .catch(err => {
        Alert.alert(err);
      });
  };

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={{ width: '80%', alignSelf: 'center' }}>
              <Text style={{ fontSize: 16, padding: 5 }}>
                ข้อมูลผู้ใช้งาน (Username)
              </Text>
              {!username && (
                <Text style={{ color: 'red' }}>ระบุชื่อเข้าใช้งาน</Text>
              )}
              <View style={styles.formControl}>
                <GetIcon type="ad" name="user" />
                <TextInput
                  style={styles.textInput}
                  placeholder="ข้อมูลผู้ใช้งาน"
                  value={username}
                  onChangeText={value => setUsername(value)}
                />
              </View>
              <Text style={{ fontSize: 16, padding: 5 }}>
                ข้อมูลรหัสผ่าน (Password)
              </Text>
              {!password && (
                <Text style={{ color: 'red' }}>
                  ระบุรหัสผ่าน เพื่อเข้าใช้งาน
                </Text>
              )}
              <View style={styles.formControl}>
                <GetIcon type="mci" name="form-textbox-password" />
                <TextInput
                  style={styles.textInput}
                  placeholder="กำหนดรหัสผ่าน"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={value => setPassword(value)}
                />
              </View>
              <Text style={{ fontSize: 16, padding: 5 }}>
                ยืนยันข้อมูลรหัสผ่าน (Re-Password)
              </Text>
              {!rePassword && (
                <Text style={{ color: 'red' }}>ยืนยันรหัสผ่านอีกครั้ง</Text>
              )}
              <View style={styles.formControl}>
                <GetIcon type="mci" name="form-textbox-password" />
                <TextInput
                  style={styles.textInput}
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  secureTextEntry={true}
                  value={rePassword}
                  onChangeText={value => setRePassword(value)}
                />
              </View>
            </View>
          </View>
          <View style={styles.buttonFooter}>
            <Button
              title="ลงทะเบียน"
              iconLeft
              // icon={
              //   <AntDesign
              //     name="save"
              //     color="white"
              //     size={24}
              //     style={{ marginHorizontal: 8 }}
              //   />
              // }
              buttonStyle={{
                backgroundColor: '#ff2fe6',
                marginTop: 20,
                borderRadius: 5,
                width: 250,
                paddingHorizontal: 15,
                height: 45,
                borderWidth: 0.5,
              }}
              onPress={() => saveAndGoLoginForm()}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  topicHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '35%',
  },
  image: {
    height: 100,
    width: 100,
    marginBottom: 10,
  },
  textLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'purple',
  },
  textInput: {
    backgroundColor: 'white',
    width: 250,
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 5,
  },
  textFormInfo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    borderColor: '#00716F',
    backgroundColor: 'white',
    marginTop: 5,
    height: 40,
    borderRadius: 10,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  textFooter1: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: 'gray',
    position: 'absolute',
    bottom: 135,
    color: 'red',
  },
  textFooter2: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: 'gray',
    position: 'absolute',
    bottom: 85,
    color: 'black',
  },
  textFooter3: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: 'gray',
    position: 'absolute',
    bottom: 60,
    color: 'green',
  },
  buttonFooter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});

export default RegisterLoginForm;
