import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  ImageBackground,
} from 'react-native';
import { Button, Text } from 'react-native-elements';
import { Ionicons } from 'react-native-vector-icons';

import { AppConfig } from '../../../Constants';
import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';

const AdminDetailScreen = ({ navigation, route }) => {
  const { navigate } = navigation;
  const { item } = route.params;

  const confirmRemovePermanent = () => {
    firebase
      .database()
      .ref(getDocument(`members/${item.id}`))
      .remove();
    navigate('Admin-Lists');
  };

  const handleRemovePermanent = () => {
    Alert.alert(
      'ต้องการลบข้อมูลผู้ใช้ถาวร ใช่หรือไม่ ?',
      'กรุณายืนยันอีกครั้ง ถ้ากดลบข้อมูลจะไม่สามารถเรียกคืนได้อีก !!!',
      [
        {
          text: 'ยืนยันการลบ',
          onPress: () => confirmRemovePermanent(),
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

  const suspendMember = () => {
    // update status member
    firebase
      .database()
      .ref(getDocument(`members/${item.id}`))
      .update({
        status: AppConfig.MemberStatus.suspend,
        statusText: AppConfig.MemberStatus.suspendMessage,
        status_priority: AppConfig.MemberStatus.suspendPriority,
        member_update_date: new Date().toUTCString(),
        sys_update_date: new Date().toUTCString(),
      });
    navigation.navigate('Admin-Lists');
  };

  const cancelSuspendMember = () => {
    // update status member
    firebase
      .database()
      .ref(getDocument(`members/${item.id}`))
      .update({
        status: AppConfig.MemberStatus.active,
        statusText: AppConfig.MemberStatus.activeMessage,
        status_priority: AppConfig.MemberStatus.activePriority,
        member_register_date: new Date().toUTCString(),
        member_update_date: new Date().toUTCString(),
        sys_update_date: new Date().toUTCString(),
      });
    navigation.navigate('Admin-Lists');
  };

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <View style={styles.viewCard}>
          <View
            style={{ alignSelf: 'center', marginTop: 20, marginBottom: 10 }}>
            <Text style={{ fontSize: 22 }}>แสดงรายละเอียดผู้ดูแลระบบ</Text>
          </View>
          <View
            style={{
              padding: 20,
              borderWidth: 1,
              borderRadius: 25,
              margin: 10,
            }}>
            <Text style={{ fontSize: 22, color: 'blue' }}>
              ชื่อ: {item.name || item.username}
            </Text>
            <Text style={{ fontSize: 22 }}>ตำแหน่งงาน: ผู้ดูแลระบบ</Text>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Button
            // icon={
            //   <Ionicons
            //     name="trash-bin-outline"
            //     size={24}
            //     color="white"
            //     style={{ marginRight: 5 }}
            //   />
            // }
            iconLeft
            buttonStyle={{
              margin: 5,
              backgroundColor: 'red',
              width: 250,
              borderRadius: 10,
            }}
            title="ลบข้อมูลออกจากระบบ"
            onPress={() => handleRemovePermanent()}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardDetail: {
    flex: 1,
    padding: 5,
    margin: 10,
    alignSelf: 'center',
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
    borderRadius: 20,
    padding: 5,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  mediaImageContainer: {
    width: 250,
    height: 350,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 300,
    borderRadius: 25,
  },
});

export default AdminDetailScreen;
