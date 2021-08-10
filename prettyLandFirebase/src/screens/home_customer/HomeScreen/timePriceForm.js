import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  SafeAreaView,
  Alert,
  StyleSheet,
  ScrollView,
  Button,
} from 'react-native';
import { Button as ButtonAction, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInputMask } from 'react-native-masked-text';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';

import { getProvinceName, getBankName } from '../../../data/apis';
import { GetIcon } from '../../../components/GetIcons';
import { getMemberProfile, saveNewPosts } from '../../../apis';
import { AppConfig } from '../../../Constants';

const TimePriceForm = props => {
  const { navigation, route } = props;
  const { data } = route.params;
  const { item, userId, partnerRequest, province, partnerProfile } = data;

  const [phone, setPhone] = useState('');
  const [timeMeeting, setTimeMeeting] = useState('');
  const [customer, setCustomer] = useState('');

  const [isTimeMeetingPicker, setTimeMeetingPicker] = useState(false);

  const showTimeMeeting = () => {
    setTimeMeetingPicker(true);
  };

  const hideTimeMeetingPicker = () => {
    setTimeMeetingPicker(false);
  };

  const handleConfirmTime = date => {
    setTimeMeeting(Moment(date).format('HH:mm'));
    hideTimeMeetingPicker();
  };

  const sendToMassagePartner = data => {
    if (!timeMeeting) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ เวลาที่จะไป');
      return;
    }
    if (!phone) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ โทรศัพท์มือถือ');
      return;
    }
    const dataToSave = {
      customerId: customer.id,
      customerName: customer.profile,
      partnerRequest,
      customerPhone: phone,
      partnerImage: item.image_url,
      partnerType: item.type,
      status: AppConfig.PostsStatus.waitPartnerConfrimWork,
      statusText: 'รอแจ้งรับงาน',
      province,
      provinceName: getProvinceName(province)[0],
      customerLevel: customer.customerLevel,
      timeMeeting,
      partnerSelect: {
        [data.id]: {
          partnerId: data.id,
          telephone: data.mobile,
          sex: data.sex,
          amount: data.price4,
          image: data.image,
          sys_create_date: new Date().toUTCString(),
          age: data.age,
          name: data.name,
          bankNo: data.bankNo,
          bankCode: data.bank,
          bankName: getBankName(data.bank)[0].label,
          lineId: data.lineId,
        },
      },
    };
    saveNewPosts(dataToSave);

    //send noti to partner type4
    getMemberProfile(data.id).then(partner => {
      fetchExpoHosting({
        to: partner.expo_token,
        title: 'แจ้งเตือน',
        body: 'มีงานใหม่ รออนุมัติจากลูกค้า',
      });
    });

    navigation.navigate('Customer-Dashboard');
  };

  useEffect(() => {
    getMemberProfile(userId).then(data => {
      setCustomer(data);
    });
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ flex: 1, height: '100%', alignItems: 'center' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={{ width: '100%' }}>
              <Text style={{ fontSize: 16, padding: 5 }}>เวลาเริ่ม</Text>
              <View style={styles.formControl}>
                <Button
                  color="green"
                  title={timeMeeting ? timeMeeting : 'เลือกเวลาเริ่ม'}
                  onPress={showTimeMeeting}
                  style={{ marginVertical: 5, borderRadius: 10 }}
                />
              </View>
              <DateTimePickerModal
                isVisible={isTimeMeetingPicker}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideTimeMeetingPicker}
                locale="en_GB"
                isDarkModeEnabled={Moment().hour() > 20}
              />
            </View>
            <View>
              <Text style={{ fontSize: 16, padding: 5 }}>เบอร์โทร</Text>
              {!phone && (
                <Text style={{ color: 'red', marginLeft: 5 }}>
                  จะต้องระบุข้อมูล เบอร์โทร
                </Text>
              )}
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
            <View style={styles.buttonFooter}>
              <ButtonAction
                icon={
                  <Icon
                    name="send"
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
                title="ส่งไปยัง Partner"
                onPress={() => sendToMassagePartner(partnerProfile)}
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
    width: 350,
    fontSize: 16,
    marginVertical: 5,
    marginLeft: 15,
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

export default TimePriceForm;
