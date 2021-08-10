import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  Linking,
} from 'react-native';
import { Button, Text } from 'react-native-elements';

import {
  registerForPushNotificationsAsync,
  fetchExpoHosting,
  saveExponentPushToken,
  getMemberProfile,
} from '../../../apis';
import { AppConfig } from '../../../Constants';
import lineLogo from '../../../../assets/icons/LINE_APP.png';
import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';

const ViewContact = ({ navigation, route }) => {
  const { userId } = route.params;
  const [profile, setProfile] = useState({});
  const [lineContact, setLineContact] = useState('');

  useEffect(() => {
    const ref = firebase.database().ref(getDocument('appconfig'));
    ref.once('value', snapshot => {
      const data = { ...snapshot.val() };
      setLineContact(data.line_contact_admin || 'https://lin.ee/DgRh5Mw');
    });
  }, []);

  const LinkToLineContact = () => {
    Linking.openURL(lineContact);
  };

  const registerBroadcast = async () => {
    await registerForPushNotificationsAsync().then(token => {
      saveExponentPushToken({ userId, token });

      // test send notification from server
      fetchExpoHosting({
        to: token,
        title: 'Welcome :)',
        body: 'Welcome to Pretty Land',
      });
    });
  };

  useEffect(() => {
    getMemberProfile(userId).then(data => {
      setProfile(data);
    });
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <View style={{ alignItems: 'center', margin: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>ข้อมูลสมาชิก</Text>
      </View>
      <View
        style={{
          borderWidth: 2,
          borderRadius: 15,
          padding: 10,
          margin: 10,
          borderColor: 'pink',
        }}>
        <Text style={{ fontSize: 14 }}>Id: {profile.id}</Text>
        <Text style={{ fontSize: 14, color: 'blue' }}>
          ชื่อ: {profile.profile}
        </Text>
        <Text style={{ fontSize: 14 }}>Level: {profile.customerLevel}</Text>
        <Button
          iconLeft
          buttonStyle={styles.btnRegisterBroadcastButton}
          title="ลงทะเบียนรับข้อมูล"
          onPress={() => registerBroadcast()}
        />
      </View>
      <View style={styles.cardDetail}>
        <Text style={styles.textTopic}>Line ติดต่อผู้ดูแลระบบ</Text>
        <Button
          // icon={
          //   <Image
          //     source={lineLogo}
          //     style={{ width: 24, height: 24, marginRight: 10 }}
          //   />
          // }
          iconLeft
          buttonStyle={styles.btnContactLineButton}
          title="LINE CONNECT"
          onPress={() => LinkToLineContact()}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  btnRegisterBroadcastButton: {
    margin: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    backgroundColor: 'blue',
  },
  btnContactLineButton: {
    margin: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    backgroundColor: '#35D00D',
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
    color: 'blue',
    marginTop: 10,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default ViewContact;
