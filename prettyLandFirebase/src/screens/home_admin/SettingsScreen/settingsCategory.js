import React from 'react';
import { StyleSheet, View, ImageBackground, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements';
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from 'react-native-vector-icons';

import { AppConfig } from '../../../Constants';

const SettingsCategory = ({ navigation, route }) => {
  const { role } = route.params;

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <Text style={styles.textTopic}>ตั้งค่าระบบ / รายงาน</Text>
      <ScrollView>
        <View style={[styles.cardDetail, { justifyContent: 'center' }]}>
          {role === 'superadmin' && (
            <Button
              // icon={
              //   <FontAwesome
              //     name="user-secret"
              //     size={20}
              //     color="white"
              //     style={{ marginRight: 5 }}
              //   />
              // }
              titleStyle={{ fontSize: 22 }}
              iconLeft
              buttonStyle={styles.btnNewAdmin}
              title="เพิ่มข้อมูลบัญชีธนาคาร"
              onPress={() => navigation.navigate('New-Bank-Form')}
            />
          )}
          {role === 'superadmin' && (
            <Button
              // icon={
              //   <FontAwesome
              //     name="user-secret"
              //     size={20}
              //     color="white"
              //     style={{ marginRight: 5 }}
              //   />
              // }
              titleStyle={{ fontSize: 22 }}
              iconLeft
              buttonStyle={styles.btnNewAdmin}
              title="เพิ่มข้อมูลผู้ใช้งาน"
              onPress={() => navigation.navigate('New-Admin-Form')}
            />
          )}
          {role === 'superadmin' && (
            <Button
              // icon={
              //   <MaterialIcons
              //     name="app-settings-alt"
              //     size={20}
              //     color="white"
              //     style={{ marginRight: 5 }}
              //   />
              // }
              titleStyle={{ fontSize: 22 }}
              iconLeft
              buttonStyle={styles.btnPostConfig}
              title="จัดการข้อมูลระบบ"
              onPress={() => navigation.navigate('View-Settings')}
            />
          )}
          {role === 'superadmin' && (
            <Button
              // icon={
              //   <FontAwesome
              //     name="user-secret"
              //     size={20}
              //     color="white"
              //     style={{ marginRight: 5 }}
              //   />
              // }
              titleStyle={{ fontSize: 22 }}
              iconLeft
              buttonStyle={styles.btnListAdmin}
              title="ข้อมูล admin"
              onPress={() => navigation.navigate('Admin-Lists')}
            />
          )}
          <Button
            // icon={
            //   <Ionicons
            //     name="newspaper-sharp"
            //     size={24}
            //     color="white"
            //     style={{ marginRight: 5 }}
            //   />
            // }
            titleStyle={{ fontSize: 22 }}
            iconLeft
            buttonStyle={styles.btnMemberReport}
            title="รายงานการสมัครสมาชิก"
            onPress={() => navigation.navigate('Member-Register-Lists')}
          />
          <Button
            // icon={
            //   <Ionicons
            //     name="newspaper-sharp"
            //     size={24}
            //     color="white"
            //     style={{ marginRight: 5 }}
            //   />
            // }
            titleStyle={{ fontSize: 22 }}
            iconLeft
            buttonStyle={styles.btnPartnerReport}
            title="รายงานสมัครหางาน"
            onPress={() => navigation.navigate('Partner-Register-Lists')}
          />
          <Button
            // icon={
            //   <MaterialCommunityIcons
            //     name="email-send"
            //     size={24}
            //     color="white"
            //     style={{ marginLeft: 10 }}
            //   />
            // }
            titleStyle={{ fontSize: 22 }}
            iconRight
            buttonStyle={styles.btnBroadcast}
            title="ส่งข้อมูล Broadcast"
            onPress={() => navigation.navigate('Send-Broadcast')}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  btnListAdmin: {
    margin: 5,
    paddingHorizontal: 50,
    borderRadius: 5,
    width: 350,
    height: 75,
    justifyContent: 'flex-start',
    backgroundColor: '#ff2fe6',
    opacity: 0.65,
  },
  btnMemberReport: {
    margin: 5,
    paddingHorizontal: 50,
    borderRadius: 5,
    width: 350,
    height: 75,
    justifyContent: 'flex-start',
    backgroundColor: '#ff2fe6',
    opacity: 0.65,
  },
  btnPartnerReport: {
    margin: 5,
    paddingHorizontal: 50,
    borderRadius: 5,
    width: 350,
    height: 75,
    justifyContent: 'flex-start',
    backgroundColor: '#ff2fe6',
    opacity: 0.65,
  },
  btnBroadcast: {
    margin: 5,
    borderRadius: 5,
    width: 350,
    height: 75,
    justifyContent: 'flex-start',
    backgroundColor: '#ff2fe6',
    opacity: 0.65,
  },
  btnPostConfig: {
    margin: 5,
    paddingHorizontal: 50,
    borderRadius: 5,
    width: 350,
    height: 75,
    justifyContent: 'flex-start',
    backgroundColor: '#ff2fe6',
    opacity: 0.65,
  },
  btnNewAdmin: {
    margin: 5,
    paddingHorizontal: 50,
    borderRadius: 5,
    width: 350,
    height: 75,
    justifyContent: 'flex-start',
    backgroundColor: '#ff2fe6',
    opacity: 0.65,
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
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default SettingsCategory;
