import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import Moment from 'moment';

import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';

const ConfirmTaskScreen = ({ navigation, route }) => {
  const { profile, postDetail } = route.params;
  const [profileSelect, setProfileSelect] = useState('');

  const nextPriceForm = () => {
    navigation.navigate('Price-Form-Detail', { profile, postDetail });
  };

  const getProfileSelectObject = snapshot => {
    return new Promise((resolve, reject) => {
      const checkItem = { ...snapshot.val() };
      setProfileSelect(checkItem);
      resolve(true);
    });
  };

  useEffect(() => {
    const ref = firebase
      .database()
      .ref(getDocument(`posts/${postDetail.id}/partnerSelect/${profile.id}`));
    ref.once('value', snapshot => {
      getProfileSelectObject(snapshot).catch(err => Alert.alert(err));
    });
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <Text style={styles.textTopic}>รายละเอียดโพสท์</Text>
        <View style={styles.cardDetail}>
          <Text
            style={{
              fontSize: 26,
            }}>
            จำนวนน้องๆ ที่ต้องการ: {postDetail.partnerWantQty || 0} คน
          </Text>
          <Text
            style={{
              fontSize: 26,
              color: 'blue',
              fontWeight: 'bold',
            }}>
            ลูกค้า: {postDetail.customerName}
          </Text>
          <Text
            style={{
              fontSize: 26,
            }}>
            Level: {postDetail.customerLevel}
          </Text>
          <Text
            style={{
              fontSize: 26,
              color: 'green',
              fontWeight: 'bold',
            }}>
            สถานที่: {postDetail.placeMeeting}
          </Text>
          <View
            style={{
              padding: 20,
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'red',
            }}>
            <Text
              style={{
                fontSize: 26,
                color: 'red',
                fontWeight: 'bold',
              }}>
              เริ่ม: {postDetail.startTime}, เลิก: {postDetail.stopTime}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 26,
              color: 'brown',
              fontWeight: 'bold',
            }}>
            รายละเอียดเพิ่มเติม: {postDetail.customerRemark}
          </Text>
          <Text
            style={{
              fontSize: 26,
            }}>
            วันที่โพสท์:{' '}
            {Moment(postDetail.sys_create_date).format('DD/MM/YYYY HH:mm:ss')}
          </Text>
          {Object.keys(profileSelect).length === 0 && (
            <View style={{ marginVertical: 10, width: 200 }}>
              <Button
                title="ถัดไป"
                buttonStyle={{ borderRadius: 5 }}
                onPress={() => nextPriceForm()}
              />
            </View>
          )}
          {profileSelect.selectStatus ===
            AppConfig.PostsStatus.customerConfirm && (
            <Text
              style={{
                fontWeight: 'bold',
                backgroundColor: 'blue',
                color: 'white',
                paddingHorizontal: 10,
              }}>
              Status: ได้งานแล้ว รอลูกค้าชำระเงิน
            </Text>
          )}
          {profileSelect.selectStatus ===
            AppConfig.PostsStatus.waitCustomerSelectPartner && (
            <Text
              style={{
                fontWeight: 'bold',
                backgroundColor: 'orange',
                paddingHorizontal: 10,
              }}>
              Status: กำหนดค่าบริการไปแล้ว
            </Text>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardDetail: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    margin: 10,
    justifyContent: 'space-evenly',
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
    margin: 20,
  },
  textInput: {
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 5,
    height: 40,
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

export default ConfirmTaskScreen;
