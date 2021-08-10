import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { Button, Text } from 'react-native-elements';

import { partnerAcceptJobWaitCustomerReview } from '../../../apis';
import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';

const PriceFormDetail = ({ navigation, route }) => {
  const { profile, postDetail } = route.params;
  const [amount, setAmount] = useState('');
  const [workStatus, setWorkStatus] = useState('');

  const [getWork, setGetWork] = useState(false);
  const workHide =
    postDetail.partnerQty -
      (postDetail.partnerSelect
        ? Object.keys(postDetail.partnerSelect).length
        : 0) ===
    0;

  const partnerQuatation = () => {
    if (!amount) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุจำนวนเงินที่ต้องการ');
      return;
    }
    partnerAcceptJobWaitCustomerReview(postDetail, {
      ...profile,
      amount,
    });
    navigation.navigate('Partner-Dashboard');
  };

  useEffect(() => {
    const ref = firebase
      .database()
      .ref(getDocument(`posts/${postDetail.id}/partnerSelect/${profile.id}`));
    ref.once('value', snapshot => {
      const checkItem = { ...snapshot.val() };
      const acceptAlready = checkItem.partnerId === profile.id;
      if (acceptAlready) {
        setAmount(checkItem.amount);
        setWorkStatus(checkItem.selectStatus);
      }
      setGetWork(acceptAlready);
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
          <View style={styles.viewCard}>
            {!workHide && (
              <View>
                <View
                  style={{
                    borderWidth: 1.5,
                    borderRadius: 10,
                    borderColor: 'gray',
                    padding: 10,
                  }}>
                  <TextInput
                    value={amount}
                    placeholder="ค่าบริการ (บาท)"
                    style={styles.textInput}
                    keyboardType="number-pad"
                    onChangeText={value => setAmount(value)}
                  />
                </View>
                <View style={{ marginVertical: 10 }}>
                  <Button
                    title="ยืนยันราคา"
                    buttonStyle={{ borderRadius: 5 }}
                    onPress={() => partnerQuatation()}
                  />
                </View>
              </View>
            )}
          </View>
          {getWork && workStatus === AppConfig.PostsStatus.customerConfirm && (
            <Text
              style={{
                color: 'white',
                backgroundColor: 'blue',
                padding: 20,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              ได้งานแล้ว รอลูกค้าชำระเงิน
            </Text>
          )}
          {getWork &&
            workStatus === AppConfig.PostsStatus.waitCustomerSelectPartner && (
              <Text
                style={{
                  color: 'white',
                  backgroundColor: 'blue',
                  padding: 20,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                รอลูกค้ารับงาน
              </Text>
            )}
          {!getWork && workHide && (
            <Text
              style={{
                color: 'black',
                backgroundColor: 'red',
                padding: 20,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              งานนี้ถูกรับงานไปเต็มแล้ว
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

export default PriceFormDetail;
