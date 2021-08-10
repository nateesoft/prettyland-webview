import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Alert,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
  Button,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { Button as ButtonAction, Text } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
import uuid from 'react-native-uuid';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import * as Progress from 'react-native-progress';

import { getDocument } from '../../../util';
import firebase from '../../../util/firebase';
import { AppConfig } from '../../../Constants';

const SendBroadcast = ({ navigation, route }) => {
  const [msgTitle, setMsgTitle] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateFinish, setDateFinish] = useState('');
  const [timeSend, setTimeSend] = useState('');
  const [image, setImage] = useState(null);
  const [linkConnect, setLinkConnect] = useState('');

  const [isDateStartPicker, setDateStartPicker] = useState(false);
  const [isDateFinishPicker, setDateFinishPicker] = useState(false);
  const [isTimeSetup, setIsTimeSetup] = useState(false);

  const [loading, setLoading] = useState(false);

  /// start date ///
  const showDateStart = () => {
    setDateStartPicker(true);
  };

  const hideDateStartPicker = () => {
    setDateStartPicker(false);
  };

  const handleConfirmStartDate = date => {
    setDateStart(Moment(date).format('DD/MM/YYYY'));
    hideDateStartPicker();
  };

  /// finish date ///
  const showDateFinish = () => {
    setDateFinishPicker(true);
  };

  const hideDateFinishPicker = () => {
    setDateFinishPicker(false);
  };

  const handleConfirmFinishDate = date => {
    setDateFinish(Moment(date).format('DD/MM/YYYY'));
    hideDateFinishPicker();
  };

  /// time setup ///
  const showTimePicker = () => {
    setIsTimeSetup(true);
  };

  const hideTimePicker = () => {
    setIsTimeSetup(false);
  };

  const handleConfirmFinishTime = time => {
    setTimeSend(Moment(time).format('HH:mm'));
    hideTimePicker();
  };

  const sendData = () => {
    if (!msgTitle) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ หัวข้อสำหรับส่ง');
      return;
    }
    if (!dateStart) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ วันที่เริ่มส่ง');
      return;
    }
    if (!dateFinish) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ วันที่สิ้นสุด');
      return;
    }
    if (!timeSend) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ เวลาแจ้งเตือน');
      return;
    }
    if (!image) {
      Alert.alert('แจ้งเตือน', 'กรุณาอัพโหลดรูปภาพ');
      return;
    }
    if (!linkConnect) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ Link เชื่อมต่อ');
      return;
    }

    // save broadcast news
    if (image) {
      uploadImageAsync(image);
    }
  };

  async function uploadImageAsync(imageSource) {
    const newId = uuid.v4();
    setLoading('start');
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', imageSource, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref(getDocument('images/member/admin/broadcast'))
      .child(newId);
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    const url = await snapshot.ref.getDownloadURL();

    firebase
      .database()
      .ref(getDocument(`broadcast_news/${newId}`))
      .set({
        id: newId,
        msg_title: msgTitle,
        date_start: dateStart,
        date_finish: dateFinish,
        time_send: timeSend,
        image_url: url,
        link_connect: linkConnect,
        status: 'active',
      });

    setLoading('finish');
    Alert.alert('บันทึกส่งข้อมูลเรียบร้อยแล้ว');
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'แจ้งเตือน',
            'ขออภัย, กรุณาให้สิทธิืการเข้าถึงรูปภาพของท่าน!',
          );
        }
      }
    })();
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <Text style={styles.textTopic}>Broadcast</Text>
      <SafeAreaView
        style={{
          flex: 1,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 18 }}>หัวข้อแจ้งเตือน</Text>
            <View style={styles.formControl}>
              <TextInput
                style={styles.inputForm}
                onChangeText={value => setMsgTitle(value)}
                value={msgTitle}
              />
            </View>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 18 }}>เริ่มวันที่</Text>
            <View style={styles.formDateControl}>
              <Button
                color="green"
                title={dateStart ? dateStart : 'เลือกวันที่เริ่ม'}
                onPress={showDateStart}
                style={{ marginVertical: 5, borderRadius: 10 }}
              />
              <DateTimePickerModal
                isVisible={isDateStartPicker}
                mode="date"
                onConfirm={handleConfirmStartDate}
                onCancel={hideDateStartPicker}
                isDarkModeEnabled={Moment().hour() > 20}
              />
            </View>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 18 }}>ถึงวันที่</Text>
            <View style={styles.formDateControl}>
              <Button
                color="green"
                title={dateFinish ? dateFinish : 'เลือกวันที่สิ้นสุด'}
                onPress={showDateFinish}
                style={{ marginVertical: 5, borderRadius: 10 }}
              />
              <DateTimePickerModal
                isVisible={isDateFinishPicker}
                mode="date"
                onConfirm={handleConfirmFinishDate}
                onCancel={hideDateFinishPicker}
                isDarkModeEnabled={Moment().hour() > 20}
              />
            </View>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 18 }}>เวลาแจ้งเตือน</Text>
            <View style={styles.formDateControl}>
              <Button
                color="green"
                title={timeSend ? timeSend : 'เวลาแจ้งเตือน'}
                onPress={showTimePicker}
                style={{ marginVertical: 5, borderRadius: 10 }}
              />
              <DateTimePickerModal
                isVisible={isTimeSetup}
                mode="time"
                onConfirm={handleConfirmFinishTime}
                onCancel={hideTimePicker}
                locale="en_GB"
                isDarkModeEnabled={Moment().hour() > 20}
              />
            </View>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 18 }}>Link ข้อมูล</Text>
            <View style={styles.formControl}>
              <TextInput
                style={styles.inputForm}
                onChangeText={value => setLinkConnect(value)}
                value={linkConnect}
              />
            </View>
          </View>
          <View style={{ alignSelf: 'center', width: 200, marginVertical: 10 }}>
            <Button
              // icon={
              //   <Icon
              //     name="file"
              //     size={15}
              //     color="white"
              //     style={{ marginRight: 5 }}
              //   />
              // }
              buttonStyle={{ marginTop: 10 }}
              title="เลือกไฟล์รูปภาพ"
              onPress={pickImage}
            />
          </View>
          <View style={{ alignSelf: 'center' }}>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 250, height: 250 }}
              />
            )}
          </View>
          {loading === 'start' && (
            <Progress.Bar
              width={200}
              indeterminate={true}
              style={{ marginTop: 10 }}
            />
          )}
          <ButtonAction
            // icon={
            //   <Icon
            //     name="save"
            //     size={20}
            //     color="white"
            //     style={{ marginRight: 5 }}
            //   />
            // }
            iconLeft
            buttonStyle={styles.btnSend}
            title="บันทึกข้อมูล"
            onPress={() => sendData()}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  btnSend: {
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
  },
  formDateControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ff2fe6',
    marginTop: 5,
    height: 50,
    borderRadius: 10,
  },
  textInput: {
    width: '90%',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 5,
  },
});

export default SendBroadcast;
