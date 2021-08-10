import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Alert,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import base64 from 'react-native-base64';
import uuid from 'react-native-uuid';
import DropDownPicker from 'react-native-dropdown-picker';

import { GetIcon } from '../../../components/GetIcons';
import { snapshotToArray, getDocument } from '../../../util';
import firebase from '../../../util/firebase';
import { AppConfig } from '../../../Constants';

const AddNewAdminForm = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const [openMemberType, setOpenMemberType] = useState(false);
  const [memberType, setMemberType] = useState('');
  const [memberTypesLists, setMemberTypeList] = useState([
    { label: 'superadmin', value: 'superadmin' },
    { label: 'admin', value: 'admin' },
    { label: 'manager', value: 'manager' },
    { label: 'customer', value: 'customer' },
    { label: 'partner', value: 'partner' },
    { label: 'demo', value: 'demo' },
  ]);

  const saveNewAdmin = () => {
    if (!name) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุข้อมูลชื่อ');
      return;
    }
    if (!username) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุข้อมูลผู้ใช้งาน');
      return;
    }
    if (!password) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุข้อมูลรหัสผ่านเดิม');
      return;
    }
    if (!rePassword) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุข้อมูยืนยันรหัสใหม่');
      return;
    }
    if (password !== rePassword) {
      Alert.alert('แจ้งเตือน', 'รหัสผ่านใหม่ และรหัสผ่านใหม่่ไม่ตรงกัน');
      return;
    }
    if (!memberType) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุประเภทสมาชิก');
      return;
    }

    let dataNewAdmin = {
      id: uuid.v4(),
      profile: name,
      username,
      password: base64.encode(password),
      memberType,
      status_priority: 10,
      status: 'active',
    };

    if (
      memberType !== 'admin' &&
      memberType !== 'superadmin' &&
      memberType !== 'manager'
    ) {
      dataNewAdmin = {
        id: uuid.v4(),
        profile: name,
        username,
        password: base64.encode(password),
        memberType,
        status: 'active',
        customerLevel: 0,
        status_priority: 1,
      };
    }

    firebase
      .database()
      .ref(getDocument('members'))
      .orderByChild('username')
      .equalTo(username)
      .once('value', snapshot => {
        const data = snapshotToArray(snapshot);
        if (data.length === 0) {
          firebase
            .database()
            .ref(getDocument(`members/${dataNewAdmin.id}`))
            .set(dataNewAdmin);
          Alert.alert('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
          setName('');
          setUsername('');
          setPassword('');
          setRePassword('');
          setMemberType('');
        } else {
          const user = data[0];
          Alert.alert(
            'แจ้งเตือน',
            `ข้อมูลผู้ใช้งาน: ${user.username} มีอยู่แล้ว`,
            [{ text: 'OK' }],
          );
        }
      });
  };

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <Text style={styles.textTopic}>เพิ่มข้อมูล Admin</Text>
      <SafeAreaView style={{ flex: 1, height: '100%', alignItems: 'center' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cardDetail}>
            <View style={styles.viewCard}>
              <Text style={{ fontSize: 18 }}>ชื่อผู้ใช้งาน (name)</Text>
              <View style={styles.formControl}>
                <GetIcon type="ad" name="idcard" />
                <TextInput
                  leftIcon={{ type: 'ant-design', name: 'idcard' }}
                  style={styles.textInput}
                  onChangeText={value => setName(value)}
                  value={name}
                  placeholder="ชื่อผู้ใช้งาน (name)"
                />
              </View>
              <Text style={{ fontSize: 18 }}>
                ข้อมูลชื่อผู้ใช้งาน (username) ในระบบ
              </Text>
              <View style={styles.formControl}>
                <GetIcon type="fa" name="address-book" />
                <TextInput
                  leftIcon={{ type: 'font-awesome', name: 'address-book' }}
                  style={styles.textInput}
                  onChangeText={value => setUsername(value)}
                  value={username}
                  placeholder="ข้อมูลชื่อผู้ใช้งาน"
                />
              </View>
              <Text style={{ fontSize: 18 }}>กำหนดรหัสผ่าน (password)</Text>
              <View style={styles.formControl}>
                <GetIcon type="fa" name="lock" />
                <TextInput
                  leftIcon={{ type: 'font-awesome', name: 'lock' }}
                  style={styles.inputForm}
                  onChangeText={value => setPassword(value)}
                  value={password}
                  secureTextEntry={true}
                  placeholder="กำหนดรหัสผ่าน (password)"
                />
              </View>
              <Text style={{ fontSize: 18 }}>
                ยืนยันรหัสผ่านใหม่ (re-password)
              </Text>
              <View style={styles.formControl}>
                <GetIcon type="fa" name="lock" />
                <TextInput
                  leftIcon={{ type: 'font-awesome', name: 'lock' }}
                  style={styles.inputForm}
                  onChangeText={value => setRePassword(value)}
                  value={rePassword}
                  secureTextEntry={true}
                  placeholder="ยืนยันรหัสผ่านใหม่"
                />
              </View>
            </View>
            <View style={{ alignSelf: 'center', zIndex: 1 }}>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                ประเภทผู้ใช้งาน
              </Text>
              <DropDownPicker
                placeholder="ประเภทผู้ใช้งาน"
                open={openMemberType}
                setOpen={setOpenMemberType}
                value={memberType}
                setValue={setMemberType}
                items={memberTypesLists}
                setItems={setMemberTypeList}
                textStyle={{ fontSize: 18 }}
                zIndex={2}
                searchable={false}
                selectedItemContainerStyle={{ backgroundColor: '#facaff' }}
                listMode="SCROLLVIEW"
                style={{ width: 350 }}
                containerStyle={{ width: 350 }}
              />
            </View>
            <Button
              icon={
                <Icon
                  name="save"
                  size={20}
                  color="white"
                  style={{ marginRight: 5 }}
                />
              }
              iconLeft
              buttonStyle={styles.btnSave}
              title="เพิ่มข้อมูล"
              onPress={() => saveNewAdmin()}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  btnSave: {
    margin: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    backgroundColor: '#ff2fe6',
  },
  cardDetail: {
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
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  inputForm: {
    width: '90%',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 5,
  },
  formControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    borderColor: '#ff2fe6',
    marginTop: 5,
    height: 50,
    borderRadius: 10,
    width: 350,
  },
  textInput: {
    width: '90%',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 5,
  },
});

export default AddNewAdminForm;
