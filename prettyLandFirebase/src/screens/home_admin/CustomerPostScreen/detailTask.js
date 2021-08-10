import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  Image,
} from 'react-native';
import { Button, Text } from 'react-native-elements';
import { AntDesign, Ionicons } from 'react-native-vector-icons';
import Moment from 'moment';

import { updatePosts, adminConfirmNewPost } from '../../../apis';
import { AppConfig } from '../../../Constants';
import { Alert } from 'react-native';

const ConfirmTaskScreen = ({ navigation, route }) => {
  const { item, topic } = route.params;
  const [partnerList, setPartnerList] = useState([]);

  const getPartnerList = () => {
    return new Promise((resolve, reject) => {
      const partnerSelect = item.partnerSelect;
      let pList = [];
      for (let key in partnerSelect) {
        const obj = partnerSelect[key];
        if (obj.selectStatus === AppConfig.PostsStatus.customerConfirm) {
          pList.push(obj);
        }
      }

      setPartnerList(pList);
      resolve(true);
    });
  };

  useEffect(() => {
    getPartnerList().catch(err => Alert.alert(err));
  }, []);

  const updateToApprove = () => {
    if (item.status === AppConfig.PostsStatus.waitAdminApprovePost) {
      updatePosts(item.id, {
        status: AppConfig.PostsStatus.waitCustomerPayment,
        statusText: 'รอลูกค้าชำระเงิน',
        sys_update_date: new Date().toUTCString(),
      });
      navigation.navigate('Post-List-All');
    } else {
      adminConfirmNewPost(item)
        .then(res => {
          if (res) {
            navigation.navigate('Post-List-All');
          }
        })
        .catch(err => Alert.alert(err));
    }
  };

  const updateNotApprove = () => {
    updatePosts(item.id, {
      status: AppConfig.PostsStatus.notApprove,
      statusText: 'ไม่อนุมัติโพสท์',
      sys_update_date: new Date().toUTCString(),
    });
    navigation.navigate('Post-List-All');
  };

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.textTopic}>รายละเอียดโพสท์</Text>
        <Text style={styles.textDetail}>( สถานะ {item.statusText} )</Text>
        <View style={styles.cardDetail}>
          <View style={styles.viewCard}>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16 }}>โหมดงาน: {topic}</Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                จำนวนน้องๆ ที่ต้องการ: {item.partnerWantQty || 0} คน
              </Text>
              <Text style={{ fontSize: 16, color: 'blue' }}>
                ชื่อลูกค้า: {item.customerName}
              </Text>
              <Text
                style={{ fontSize: 16, marginVertical: 5, marginVertical: 5 }}>
                Level: {item.customerLevel}
              </Text>
              <Text style={{ fontSize: 16 }}>จังหวัด: {item.provinceName}</Text>
              <Text style={{ fontSize: 16, marginVertical: 5, color: 'red' }}>
                เวลาเริ่ม: {item.startTime}, เวลาเลิก: {item.stopTime}
              </Text>
            </View>
          </View>
          <View style={styles.viewCard}>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, color: 'green' }}>
                สถานะที่: {item.placeMeeting}
              </Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                เบอร์โทร: {item.customerPhone}
              </Text>
              <Text style={{ fontSize: 16, color: 'brown' }}>
                รายละเอียดเพิ่มเติม: {item.customerRemark}
              </Text>
            </View>
          </View>
          <View style={styles.viewCard}>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                วันที่สร้างข้อมูล:{' '}
                {Moment(item.sys_create_date).format('DD/MM/YYYY HH:mm:ss')}
              </Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                วันที่อัพเดตข้อมูล:{' '}
                {Moment(item.sys_update_date).format('DD/MM/YYYY HH:mm:ss')}
              </Text>
            </View>
          </View>
          {(item.status === AppConfig.PostsStatus.customerNewPostDone ||
            item.status === AppConfig.PostsStatus.waitAdminApprovePost) && (
            <View>
              <Button
                icon={
                  <AntDesign
                    name="checkcircleo"
                    size={15}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                }
                iconLeft
                buttonStyle={{
                  margin: 5,
                  backgroundColor: '#ff2fe6',
                  paddingHorizontal: 20,
                  borderRadius: 25,
                }}
                title="อนุมัติโพสท์"
                onPress={() => updateToApprove()}
              />
              <Button
                icon={
                  <Ionicons
                    name="trash-bin-outline"
                    size={15}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                }
                iconLeft
                buttonStyle={{
                  margin: 5,
                  backgroundColor: 'red',
                  borderRadius: 25,
                  paddingHorizontal: 20,
                }}
                title="ไม่อนุมัติโพสท์"
                onPress={() => updateNotApprove()}
              />
            </View>
          )}
          {partnerList.length > 0 && (
            <View>
              <Text>แสดงรายชื่อที่ลูกค้าเลือก</Text>
              <ScrollView horizontals showsHorizontalScrollIndicator={false}>
                {partnerList.map((pObj, index) => (
                  <View
                    key={pObj.partnerId}
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      marginTop: 10,
                      alignSelf: 'center',
                      borderColor: 'gray',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{
                        uri: pObj.image,
                        width: 150,
                        height: 150,
                      }}
                      key={`img_${pObj.partnerId}`}
                    />
                    <View style={{ alignSelf: 'center' }}>
                      <Text>ชื่อน้องๆ: {pObj.partnerName}</Text>
                      <Text>เบอร์โทรศัพท์: {pObj.telephone}</Text>
                      <Text>ราคาที่เสนอ: {pObj.amount}</Text>
                      <Text>สถานะ: {pObj.selectStatusText}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        style={{
                          backgroundColor: 'gray',
                          color: 'white',
                          width: '100%',
                          alignSelf: 'center',
                        }}>
                        Log...
                      </Text>
                      {pObj.customerStatusText && (
                        <Text style={{ color: 'blue' }}>
                          {pObj.customerStatusText}
                        </Text>
                      )}
                      {pObj.partnerStatusText && (
                        <Text style={{ color: 'blue' }}>
                          {pObj.partnerStatusText}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
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
    borderWidth: 1,
    borderColor: '#eee',
    marginVertical: 5,
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
  textDetail: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#ff2fe6',
    padding: 10,
  },
});

export default ConfirmTaskScreen;
