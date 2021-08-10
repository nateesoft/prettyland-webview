import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  TextInput,
  SafeAreaView,
  Alert,
  StyleSheet,
  ScrollView,
  Button,
} from 'react-native';
import { Text, Button as ButtonAction } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RadioButtonRN from 'radio-buttons-react-native';
import { TextInputMask } from 'react-native-masked-text';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';

import { getProvinceName } from '../../../data/apis';
import { GetIcon } from '../../../components/GetIcons';
import { saveNewPosts, getMemberProfile } from '../../../apis';
import { AppConfig } from '../../../Constants';

const sexData = [
  { label: 'ชาย (Male)', value: 'male' },
  { label: 'หญิง (Female)', value: 'female' },
];

const PlaceForm = props => {
  const { navigation, route } = props;
  const { item, userId, partnerRequest, province, partnerWantQty } =
    route.params;
  const [sex, setSex] = useState('male');
  const [phone, setPhone] = useState('');
  const [place, setPlace] = useState('');
  const [remark, setRemark] = useState('');
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerLevel, setCustomerLevel] = useState('');

  const [isTimeStartPicker, setTimeStartPicker] = useState(false);
  const [isTimeStopPicker, setTimeStopPicker] = useState(false);

  const showTimeStart = () => {
    setTimeStartPicker(true);
  };

  const hideTimeStartPicker = () => {
    setTimeStartPicker(false);
  };

  const handleConfirmStartTime = date => {
    setStartTime(Moment(date).format('HH:mm'));
    hideTimeStartPicker();
  };
  const showTimeStop = () => {
    setTimeStopPicker(true);
  };

  const hideTimeStopPicker = () => {
    setTimeStopPicker(false);
  };

  const handleConfirmStopTime = date => {
    setStopTime(Moment(date).format('HH:mm'));
    hideTimeStopPicker();
  };

  const createNewPost = () => {
    if (!place) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ สถานที่');
      return;
    }
    if (!startTime) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ เวลาเริ่ม');
      return;
    }
    if (!stopTime) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ เวลาหยุด');
      return;
    }
    if (!phone) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ โทรศัพท์มือถือ');
      return;
    }
    saveNewPosts({
      customerId: userId,
      partnerRequest,
      partnerImage: item.image_url,
      customerPhone: phone,
      placeMeeting: place,
      status: AppConfig.PostsStatus.customerNewPostDone,
      statusText: 'โพสท์ใหม่',
      province,
      provinceName: getProvinceName(province)[0],
      customerRemark: remark,
      customerLevel,
      customerName,
      startTime,
      stopTime,
      partnerWantQty,
      sexTarget: sex,
      partnerType: item.type,
    });

    navigation.navigate('Customer-Dashboard');
  };

  useEffect(() => {
    getMemberProfile(userId).then(customer => {
      setCustomerLevel(customer.customerLevel);
      setCustomerName(customer.profile);
    });
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView
        style={{
          height: '100%',
          alignItems: 'center',
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}>
          <View style={styles.container}>
            <View
              style={{
                borderWidth: 1,
                width: '100%',
                borderRadius: 10,
                borderColor: '#ff2fe6',
                marginTop: 10,
              }}>
              <RadioButtonRN
                box={false}
                animationTypes={['shake']}
                data={sexData}
                selectedBtn={e => setSex(e.value)}
                icon={
                  <FontAwesome name="check-circle" size={25} color="#2c9dd1" />
                }
                initial={sex === 'male' ? 1 : sex === 'female' ? 2 : 3}
                style={{ padding: 10 }}
              />
            </View>
            <View style={{ width: '100%' }}>
              <Text style={{ fontSize: 16, padding: 5 }}>สถานที่นัดหมาย</Text>
              <View style={styles.formControl}>
                <GetIcon type="fa" name="home" />
                <TextInput
                  placeholder="สถานที่นัดหมาย"
                  style={[styles.textInput, { width: 200 }]}
                  value={place}
                  onChangeText={value => setPlace(value)}
                />
              </View>
            </View>
            <View style={{ width: '100%' }}>
              <Text style={{ fontSize: 16, padding: 5 }}>เวลาเริ่ม</Text>
              <View style={styles.formControl}>
                <Button
                  color="green"
                  title={startTime ? startTime : 'เลือกเวลาเริ่ม'}
                  onPress={showTimeStart}
                  style={{ marginVertical: 5, borderRadius: 10 }}
                />
              </View>
              <DateTimePickerModal
                isVisible={isTimeStartPicker}
                mode="time"
                onConfirm={handleConfirmStartTime}
                onCancel={hideTimeStartPicker}
                locale="en_GB"
                isDarkModeEnabled={Moment().hour() > 20}
              />
            </View>
            <View style={{ width: '100%' }}>
              <Text style={{ fontSize: 16, padding: 5 }}>เวลาเลิก</Text>
              <View style={styles.formControl}>
                <Button
                  color="red"
                  title={stopTime ? stopTime : 'เลือกเวลาเลิก'}
                  onPress={showTimeStop}
                  style={{ marginVertical: 5, borderRadius: 10 }}
                />
              </View>
              <DateTimePickerModal
                isVisible={isTimeStopPicker}
                mode="time"
                onConfirm={handleConfirmStopTime}
                onCancel={hideTimeStopPicker}
                locale="en_GB"
                isDarkModeEnabled={Moment().hour() > 20}
              />
            </View>
            <View style={{ width: '100%' }}>
              <Text style={{ fontSize: 16, padding: 5 }}>เบอร์โทร</Text>
              <View style={styles.formControl}>
                <GetIcon type="ad" name="phone" />
                <TextInputMask
                  type="custom"
                  options={{
                    mask: '(999)-999-9999',
                  }}
                  value={phone}
                  onChangeText={text => setPhone(text)}
                  style={styles.textInput}
                />
              </View>
            </View>
            <View style={{ width: '100%' }}>
              <Text style={{ fontSize: 16, padding: 5 }}>รายละเอียดงาน</Text>
            </View>
            <View style={[styles.formControl, { height: 100, width: '100%' }]}>
              <TextInput
                placeholder="รายละเอียดงาน"
                style={[styles.textInput, { height: 90 }]}
                value={remark}
                onChangeText={value => setRemark(value)}
                multiline={true}
                numberOfLines={4}
              />
            </View>
            <View style={styles.buttonFooter}>
              <ButtonAction
                icon={
                  <FontAwesome
                    name="save"
                    size={20}
                    color="white"
                    style={{ marginHorizontal: 8 }}
                  />
                }
                iconLeft
                buttonStyle={{
                  backgroundColor: '#ff2fe6',
                  marginTop: 20,
                  borderRadius: 5,
                  width: 250,
                  paddingHorizontal: 15,
                  height: 45,
                  borderWidth: 0.5,
                }}
                title="บันทึกโพสท์"
                onPress={() => createNewPost()}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardDetail: {
    alignItems: 'center',
    padding: 5,
  },
  optionsNameDetail: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
    marginTop: 10,
  },
  optionsNameDetail2: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
    marginTop: 10,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    margin: 10,
  },
  dropdownStyle: {
    marginBottom: 10,
    borderColor: '#ff2fe6',
    borderWidth: 1.5,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  formControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    borderColor: '#00716F',
    backgroundColor: 'white',
    marginTop: 5,
    height: 50,
    borderRadius: 10,
  },
  textInput: {
    backgroundColor: 'white',
    fontSize: 16,
    marginVertical: 5,
    marginLeft: 15,
    width: 250,
  },
  buttonFooter: {
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  panelPartner: {
    padding: 20,
    borderWidth: 1,
    margin: 10,
    width: 150,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#bbb',
    borderRadius: 5,
    position: 'relative',
  },
});

export default PlaceForm;
