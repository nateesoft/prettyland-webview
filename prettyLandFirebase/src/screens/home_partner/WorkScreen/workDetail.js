import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';
import { getMemberProfile } from '../../../apis';

const WorkDetailScreen = ({ navigation, route }) => {
  const { userId, item } = route.params;
  const [partner, setPartner] = useState({});
  const rate = 5; // default rate

  const saveHistoryStar = partnerId => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(getDocument(`partner_star/${partnerId}/${item.id}`))
        .update({
          star: rate,
          sys_date: new Date().toUTCString(),
        })
        .then(result => {
          resolve('success');
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const updateMember = (workIn = 0, workPoint = 0, partnerId) => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(getDocument(`members/${partnerId}`))
        .update({
          workIn: parseInt(workIn) + 1,
          workPoint: parseInt(workPoint) + 10,
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const partnerCloseJob = partnerId => {
    // update status post (for partner)
    firebase
      .database()
      .ref(getDocument(`posts/${item.id}/partnerSelect/${partnerId}`))
      .update({
        selectStatus: AppConfig.PostsStatus.closeJob,
        selectStatusText: 'ปิดงานเรียบร้อย',
        partnerStatus: AppConfig.PostsStatus.partnerCloseJob,
        partnerStatusText: 'น้องๆแจ้งปิดงาน',
        partner_close_date: new Date().toUTCString(),
        sys_update_date: new Date().toUTCString(),
      });

    if (item.partnerRequest === AppConfig.PartnerType.type4) {
      // update partner close job
      firebase
        .database()
        .ref(getDocument(`posts/${item.id}`))
        .update({
          selectStatus: AppConfig.PostsStatus.closeJob,
          selectStatusText: 'ปิดงานเรียบร้อย',
          sys_update_date: new Date().toUTCString(),
        });
    }

    getMemberProfile(partnerId).then(pData => {
      updateMember(pData.workIn, pData.workPoint, partnerId).then(result => {
        saveHistoryStar(partnerId).then(result => {
          navigation.navigate('List-My-Work');
        });
      });
    });
  };

  const startWorking = () => {
    firebase
      .database()
      .ref(getDocument(`posts/${item.id}`))
      .update({
        status: AppConfig.PostsStatus.startWork,
        statusText: 'เริ่มปฏิบัติงาน',
        sys_update_date: new Date().toUTCString(),
        start_work_date: new Date().toUTCString(),
      });

    navigation.navigate('List-My-Work');
  };

  const partnerMassageCancel = partnerId => {
    firebase
      .database()
      .ref(getDocument(`posts/${item.id}/partnerSelect/${partnerId}`))
      .update({
        partnerStatus: AppConfig.PostsStatus.partnerCancelWork,
        partnerStatusText: 'น้องๆแจ้งไม่รับงาน',
        partnerStart: new Date().toUTCString(),
        sys_update_date: new Date().toUTCString(),
        start_work_date: new Date().toUTCString(),
      });

    firebase
      .database()
      .ref(getDocument(`posts/${item.id}`))
      .update({
        status: AppConfig.PostsStatus.postCancel,
        statusText: 'น้องๆแจ้งไม่รับงาน',
        sys_update_date: new Date().toUTCString(),
      });

    navigation.navigate('List-My-Work');
  };

  const partnerMassageAccept = partnerId => {
    firebase
      .database()
      .ref(getDocument(`posts/${item.id}/partnerSelect/${partnerId}`))
      .update({
        partnerStatus: AppConfig.PostsStatus.partnerAcceptWork,
        partnerStatusText: 'น้องๆแจ้งรับงาน',
        partnerStart: new Date().toUTCString(),
        sys_update_date: new Date().toUTCString(),
        start_work_date: new Date().toUTCString(),
      });

    firebase
      .database()
      .ref(getDocument(`posts/${item.id}`))
      .update({
        status: AppConfig.PostsStatus.waitAdminApprovePost,
        statusText: 'รอ Admin อนุมัติโพสท์',
        sys_update_date: new Date().toUTCString(),
      });

    navigation.navigate('List-My-Work');
  };

  useEffect(() => {
    const ref = firebase
      .database()
      .ref(getDocument(`posts/${item.id}/partnerSelect/${userId}`));
    ref.once('value', snapshot => {
      const data = { ...snapshot.val() };
      setPartner(data);
    });
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <Text style={styles.textTopic}>รายละเอียดงานที่แจ้งลูกค้า</Text>
      <View style={styles.cardDetail}>
        <View style={styles.viewCard}>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 5,
              backgroundColor: '#123456',
              color: 'white',
              paddingHorizontal: 5,
            }}>
            ลูกค้า: {item.customerName}
          </Text>
          <View>
            <Text style={{ fontSize: 16, marginVertical: 5 }}>
              โหมดงาน: {item.partnerRequest}
            </Text>
            <Text style={{ fontSize: 16 }}>จังหวัด: {item.provinceName}</Text>
            <Text style={{ fontSize: 16, marginVertical: 5 }}>
              วันที่แจ้ง: {moment(item.sys_create_date).format('D MMM YYYY')}
            </Text>
            <Text style={{ fontSize: 16 }}>
              Lv.ลูกค้า: {item.customerLevel}
            </Text>
            <Text style={{ fontSize: 16 }}>
              เบอร์ติดต่อ: {item.customerPhone}
            </Text>
          </View>
          <Text
            style={{
              backgroundColor: 'chocolate',
              color: 'white',
              paddingHorizontal: 5,
              fontSize: 16,
              marginVertical: 10,
            }}>
            โหมดงาน: {item.partnerRequest}
          </Text>
          <View
            style={{
              borderWidth: 1.5,
              borderRadius: 10,
              borderColor: 'gray',
              padding: 5,
            }}>
            <Input
              placeholder="ค่าบริการ (บาท)"
              value={`ราคาที่เสนอ ${partner.amount} บาท`}
            />
          </View>
        </View>
        {partner.partnerStatus !== AppConfig.PostsStatus.partnerStartWork &&
          partner.partnerStatus !== AppConfig.PostsStatus.partnerCloseJob &&
          item.status === AppConfig.PostsStatus.adminConfirmPayment && (
            <Button
              icon={
                <MaterialIcons
                  name="meeting-room"
                  size={24}
                  color="white"
                  style={{ marginRight: 5 }}
                />
              }
              iconLeft
              buttonStyle={{
                margin: 5,
                backgroundColor: 'green',
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
              title="กดเริ่มงาน"
              onPress={() => startWorking()}
            />
          )}
        {partner.partnerStatus === AppConfig.PostsStatus.partnerStartWork && (
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
            title="บันทึกปิดงาน"
            onPress={() => partnerCloseJob(userId)}
          />
        )}
        {(partner.partnerStatus === AppConfig.PostsStatus.partnerCloseJob ||
          item.status === AppConfig.PostsStatus.closeJob) && (
          <Text style={{ fontSize: 20, color: 'blue' }}>
            ปิดงานเรียบร้อยแล้ว
          </Text>
        )}
        {item.status === AppConfig.PostsStatus.waitPartnerConfrimWork && (
          <View>
            <Button
              icon={
                <MaterialIcons
                  name="cancel"
                  size={24}
                  color="white"
                  style={{ marginRight: 5 }}
                />
              }
              iconLeft
              buttonStyle={{
                margin: 5,
                backgroundColor: 'red',
                borderRadius: 5,
                width: 200,
              }}
              title="ปฏิเสธงาน"
              onPress={() => partnerMassageCancel(userId)}
            />
            <Button
              icon={
                <AntDesign
                  name="checkcircleo"
                  size={24}
                  color="white"
                  style={{ marginRight: 5 }}
                />
              }
              iconLeft
              buttonStyle={{
                margin: 5,
                backgroundColor: '#ff2fe6',
                borderRadius: 5,
                width: 200,
              }}
              title="แจ้งรับงาน"
              onPress={() => partnerMassageAccept(userId)}
            />
          </View>
        )}
      </View>
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
    padding: 5,
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

export default WorkDetailScreen;
