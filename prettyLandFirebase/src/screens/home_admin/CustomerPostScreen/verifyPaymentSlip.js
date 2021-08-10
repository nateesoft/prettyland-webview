import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  ScrollView,
  Image,
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { Button, Text } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { adminSaveConfirmPayment } from '../../../apis';
import { AppConfig } from '../../../Constants';

const VerifyPaymentSlip = ({ navigation, route }) => {
  const { navigate } = navigation;
  const { item } = route.params;

  const [listPartner, setListPartner] = useState([]);

  const getPartnerList = item => {
    return new Promise((resolve, reject) => {
      let list = [];
      for (let key in item) {
        const data = item[key];
        if (
          data.selectStatus === AppConfig.PostsStatus.customerConfirm ||
          data.partnerStatus === AppConfig.PostsStatus.partnerAcceptWork
        ) {
          list.push(data);
        }
      }
      setListPartner(list);
      resolve(true);
    });
  };

  const saveConfirmPayment = () => {
    adminSaveConfirmPayment(item, listPartner)
      .then(res => {
        if (res) {
          navigate('Post-List-All');
        }
      })
      .catch(err => Alert.alert(err));
  };

  useEffect(() => {
    getPartnerList(item.partnerSelect).catch(err => Alert.alert(err));
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <Text style={styles.textTopic}>ตรวจสอบข้อมูลการโอนเงิน</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 20 }}>
          <View style={{ alignSelf: 'center' }}>
            <Image
              source={{ uri: item.slip_image }}
              style={{ width: 300, height: 350 }}
            />
          </View>
          {item.partnerRequest !== AppConfig.PartnerType.type4 && (
            <View
              style={{
                padding: 10,
                alignSelf: 'center',
                borderWidth: 1.5,
                margin: 10,
                borderColor: 'pink',
                width: '85%',
              }}>
              <Text style={{ color: 'blue', fontSize: 16 }}>
                ชื่อลูกค้า: {item.customerName}
              </Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                Level: {item.customerLevel}
              </Text>
              <Text style={{ color: 'green', fontSize: 16, marginVertical: 5 }}>
                สถานที่: {item.placeMeeting}
              </Text>
              <Text style={{ color: 'red', fontSize: 16 }}>
                เวลาเริ่ม: {item.startTime}, เวลาเลิก: {item.stopTime}
              </Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                เบอร์ติดต่อ: {item.customerPhone}
              </Text>
              <Text style={{ color: 'brown', fontSize: 16 }}>
                รายละเอียดเพิ่มเติม: {item.customerRemark}
              </Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                ธนาคารที่โอนเงิน: {item.bankName}
              </Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                ยอดเงินโอน: {parseFloat(item.transferAmount).toFixed(2)}
              </Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                เวลาที่โอนเงิน: {item.transferTime}
              </Text>
            </View>
          )}
          {item.partnerRequest === AppConfig.PartnerType.type4 && (
            <View
              style={{
                padding: 10,
                alignSelf: 'center',
                borderWidth: 1.5,
                margin: 10,
                borderColor: 'pink',
                width: '85%',
              }}>
              <Text style={{ color: 'blue' }}>
                ชื่อลูกค้า: {item.customerName}
              </Text>
              <Text>Level: {item.customerLevel}</Text>
              <Text>เบอร์ติดต่อลูกค้า: {item.customerPhone}</Text>
              <Text>ธนาคารที่โอนเงิน: {item.bankName}</Text>
              <Text>
                ยอดเงินโอน: {parseFloat(item.transferAmount).toFixed(2)}
              </Text>
              <Text>เวลาที่โอนเงิน: {item.transferTime}</Text>
            </View>
          )}
          <View style={{ alignItems: 'center', margin: 10 }}>
            <Text style={{ marginBottom: 5, fontSize: 16 }}>
              ยอดรับชำระสำหรับ {listPartner.length} คน
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {listPartner.map((obj, index) => (
                <View
                  key={obj.partnerId}
                  style={{ alignItems: 'center', margin: 10 }}>
                  <Image
                    source={{ uri: obj.image }}
                    style={{ width: 100, height: 100 }}
                  />
                  <Text style={{ marginTop: 5, color: 'blue' }}>
                    ชื่อ: {obj.partnerName || obj.name}
                  </Text>
                  <Text>ธนาคาร: {obj.bankName}</Text>
                  <Text>เลขที่บัญชี: {obj.bankNo}</Text>
                  <Text>เบอร์โทร: {obj.telephone}</Text>
                  <Text>Lien: {obj.lineId}</Text>
                  {item.partnerRequest === AppConfig.PartnerType.type4 && (
                    <View
                      style={{
                        backgroundColor: 'pink',
                        padding: 5,
                        marginTop: 5,
                      }}>
                      {obj.place && (
                        <Text style={{ marginTop: 5 }}>
                          สถานที่: {obj.place}
                        </Text>
                      )}
                      <Text style={{ marginTop: 5 }}>
                        เวลาที่จะไป: {item.timeMeeting}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
          <Button
            icon={
              <AntDesign
                name="checksquareo"
                size={20}
                color="white"
                style={{ marginRight: 5 }}
              />
            }
            buttonStyle={styles.buttonConfirm}
            title="ยืนยันข้อมูลการโอนเงิน"
            onPress={() => saveConfirmPayment()}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  buttonConfirm: {
    backgroundColor: 'green',
    borderRadius: 5,
    alignSelf: 'center',
    width: 250,
  },
  optionsNameDetail: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
    marginBottom: 15,
    marginTop: 10,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  textTopic: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#ff2fe6',
    padding: 10,
  },
});

export default VerifyPaymentSlip;
