import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Alert } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
// import { FontAwesome } from 'react-native-vector-icons';

import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';

const ViewSettingForm = ({ navigation, route }) => {
  const [feeAmount, setFeeAmount] = useState('');
  const [imageQuality, setImageQuality] = useState('');
  const [videoQuality, setVideoQuality] = useState('');
  const [lineContact, setLineContact] = useState('');

  useEffect(() => {
    const ref = firebase.database().ref(getDocument('appconfig'));
    ref.once('value', snapshot => {
      const data = { ...snapshot.val() };
      setFeeAmount(data.fee_amount || null);
      setLineContact(data.line_contact_admin || '');
      setImageQuality(data.quality_image_upload || 'default');
      setVideoQuality(data.quality_video_upload || 'default');
    });
  }, []);

  const updateAppConfigSetting = () => {
    if (!feeAmount) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุค่าธรรมเนียม');
      return;
    }

    firebase.database().ref(getDocument('appconfig')).update({
      fee_amount: feeAmount,
    });
    Alert.alert('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
  };

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <Text style={styles.textTopic}>จัดการข้อมูลระบบ</Text>
      <View style={styles.cardDetail}>
        <View style={styles.viewCard}>
          <Text style={{ fontSize: 18 }}>ค่าธรรมเนียม ดำเนินการ</Text>
          <Input
            placeholder="ค่าธรรมเนียม เช่น 100 บาท"
            leftIcon={{ type: 'font-awesome', name: 'address-book' }}
            style={styles.inputForm}
            onChangeText={value => setFeeAmount(value)}
            value={feeAmount}
          />
        </View>
        <View style={styles.viewCard}>
          <Text style={{ fontSize: 18 }}>คุณภาพรูปที่อัพโหลด</Text>
          <Input
            placeholder="default"
            leftIcon={{ type: 'font-awesome', name: 'image' }}
            style={styles.inputForm}
            onChangeText={value => setImageQuality(value)}
            value={imageQuality}
            disabled
          />
        </View>
        <View style={styles.viewCard}>
          <Text style={{ fontSize: 18 }}>คุณภาพวิดีโอที่อัพโหลด</Text>
          <Input
            placeholder="default"
            leftIcon={{ type: 'font-awesome', name: 'video-camera' }}
            style={styles.inputForm}
            onChangeText={value => setVideoQuality(value)}
            value={videoQuality}
            disabled
          />
        </View>
        <View style={styles.viewCard}>
          <Text style={{ fontSize: 18 }}>Line Contact Admin</Text>
          <Input
            placeholder="default"
            leftIcon={{ type: 'font-awesome-5', name: 'line' }}
            style={styles.inputForm}
            onChangeText={value => setLineContact(value)}
            value={lineContact}
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
          onPress={() => updateAppConfigSetting()}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  btnSave: {
    margin: 15,
    paddingHorizontal: 50,
    borderRadius: 55,
    backgroundColor: '#ff2fe6',
  },
  btnNewAdmin: {
    margin: 15,
    paddingHorizontal: 50,
    borderRadius: 55,
    backgroundColor: 'green',
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
  inputForm: {
    marginLeft: 10,
  },
});

export default ViewSettingForm;
