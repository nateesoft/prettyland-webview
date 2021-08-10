import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, Alert } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
// import { FontAwesome } from 'react-native-vector-icons';
import base64 from 'react-native-base64';

import { getMemberProfile } from '../../../apis';
import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';

const ViewProfileScreen = ({ navigation, route }) => {
  const { userId } = route.params;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOwnPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');

  const handleSaveChangePassword = () => {
    if (!password) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุข้อมูลรหัสผ่านเดิม');
      return;
    }
    if (!newPassword) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุข้อมูลรหัสใหม่');
      return;
    }
    if (!reNewPassword) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุข้อมูยืนยันรหัสใหม่');
      return;
    }
    if (newPassword !== reNewPassword) {
      Alert.alert('แจ้งเตือน', 'รหัสผ่านใหม่ และรหัสผ่านใหม่่ไม่ตรงกัน');
      return;
    }
    if (oldPassword !== password) {
      Alert.alert('แจ้งเตือน', 'รหัสผ่านเดิมของท่านไม่ถูกต้อง');
      return;
    }

    firebase
      .database()
      .ref(getDocument(`members/${userId}`))
      .update({
        password: base64.encode(newPassword),
      });
    Alert.alert('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
    setPassword('');
    setNewPassword('');
    setReNewPassword('');
  };

  useEffect(() => {
    getMemberProfile(userId).then(data => {
      setUsername(data.username);
      setOwnPassword(base64.decode(data.password));
    });
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <Text style={styles.textTopic}>เปลี่ยนรหัสผ่าน</Text>
      <View style={styles.cardDetail}>
        <View style={styles.viewCard}>
          <Text style={{ fontSize: 18, color: 'blue' }}>ชื่อผู้ใช้งาน</Text>
          <Input
            name="username"
            placeholder="ชื่อผู้ใช้งาน"
            leftIcon={{ type: 'font-awesome', name: 'user' }}
            style={[styles.inputForm, { fontSize: 22, fontWeight: 'bold' }]}
            value={username}
            disabled
          />
          <Text style={{ fontSize: 18 }}>ข้อมูลรหัสผ่านเดิมที่ใช้งาน</Text>
          <Input
            name="password"
            placeholder="รหัสผ่านเดิม"
            leftIcon={{ type: 'font-awesome', name: 'address-book' }}
            style={styles.inputForm}
            onChangeText={value => setPassword(value)}
            value={password}
            secureTextEntry={true}
          />
          <Text style={{ fontSize: 18 }}>ข้อมูลรหัสผ่านใหม่</Text>
          <Input
            name="comment"
            placeholder="รหัสผ่านใหม่"
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            style={styles.inputForm}
            onChangeText={value => setNewPassword(value)}
            value={newPassword}
            secureTextEntry={true}
          />
          <Text style={{ fontSize: 18 }}>ข้อมูลยืนยันรหัสผ่านใหม่</Text>
          <Input
            name="phone"
            placeholder="ยืนยันรหัสผ่านใหม่"
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            style={styles.inputForm}
            onChangeText={value => setReNewPassword(value)}
            value={reNewPassword}
            secureTextEntry={true}
          />
        </View>
        <Button
          // icon={
          //   <FontAwesome
          //     name="save"
          //     size={20}
          //     color="white"
          //     style={{ marginRight: 5 }}
          //   />
          // }
          iconLeft
          buttonStyle={styles.btnSave}
          title="บันทึกข้อมูล"
          onPress={() => handleSaveChangePassword()}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  inputForm: {
    marginLeft: 20,
  },
  btnSave: {
    margin: 15,
    paddingHorizontal: 50,
    borderRadius: 55,
    backgroundColor: '#ff2fe6',
  },
  cardDetail: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    margin: 10,
  },
  optionsNameDetail: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
    marginBottom: 15,
    marginTop: 10,
  },
  optionsNameDetail2: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
    marginBottom: 15,
    marginTop: 10,
  },
  viewCard: {
    width: '100%',
    borderRadius: 20,
    padding: 5,
  },
  textTopic: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#ff2fe6',
    padding: 10,
  },
  textSubTopic: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default ViewProfileScreen;
