import React, { useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Image,
  RefreshControl,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { ListItem, Text, Button } from 'react-native-elements';
import ProgressCircle from 'react-native-progress-circle';
import Moment from 'moment';

import { getProvinceName } from '../../../data/apis';
import CardNotfound from '../../../components/CardNotfound';
import { AppConfig } from '../../../Constants';
import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';

const SelectProvinceTaskList = ({ navigation, route }) => {
  const { item, profile, taskList } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {};

  const partnerConfrim = posts => {
    firebase
      .database()
      .ref(getDocument(`posts/${posts.id}/partnerSelect/${profile.id}`))
      .update({
        selectStatus: AppConfig.PostsStatus.customerConfirm,
        selectStatusText: 'น้องๆแจ้งรับงาน รอลูกค้าขำระเงิน',
        sys_update_date: new Date().toUTCString(),
        place: profile.address,
        character: profile.character,
      });

    firebase
      .database()
      .ref(getDocument(`posts/${posts.id}`))
      .update({
        status: AppConfig.PostsStatus.waitCustomerPayment,
        statusText: 'รอลูกค้าชำระค่าดำเนินการ',
        sys_update_date: new Date().toUTCString(),
      });

    navigation.navigate('Partner-Dashboard');
  };

  const partnerReject = posts => {
    firebase
      .database()
      .ref(getDocument(`posts/${posts.id}/partnerSelect/${profile.id}`))
      .update({
        selectStatus: AppConfig.PostsStatus.partnerCancelWork,
        selectStatusText: 'น้องๆปฏิเสธงาน',
        sys_update_date: new Date().toUTCString(),
      });

    firebase
      .database()
      .ref(getDocument(`posts/${posts.id}`))
      .update({
        status: AppConfig.PostsStatus.closeJob,
        statusText: 'น้องๆปฏิเสธงาน',
        sys_update_date: new Date().toUTCString(),
      });

    navigation.navigate('Partner-Dashboard');
  };

  const onPressOptions = postDetail => {
    navigation.navigate('Task-Detail', { profile, postDetail });
  };

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onPress={() => onPressOptions(item)}
      containerStyle={{
        backgroundColor: null,
        borderRadius: 8,
        marginVertical: 5,
      }}
      underlayColor="pink">
      <ListItem.Content style={{ margin: 10 }}>
        <ListItem.Title
          style={{
            marginBottom: 5,
            fontSize: 22,
          }}>
          จำนวนน้องๆ ที่ต้องการ: {item.partnerWantQty || 0} คน
        </ListItem.Title>
        <ListItem.Title
          style={{
            marginBottom: 5,
            color: 'blue',
            fontSize: 22,
          }}>
          ลูกค้า: {item.customerName}
        </ListItem.Title>
        <ListItem.Title
          style={{
            marginBottom: 5,
            fontSize: 22,
          }}>
          Level: {item.customerLevel}
        </ListItem.Title>
        <ListItem.Title
          style={{
            marginBottom: 5,
            color: 'green',
            fontSize: 22,
          }}>
          สถานที่: {item.placeMeeting}
        </ListItem.Title>
        <ListItem.Title
          style={{
            marginBottom: 5,
            color: 'red',
            fontSize: 22,
          }}>
          เริ่ม: {item.startTime}, เลิก: {item.stopTime}
        </ListItem.Title>
        <ListItem.Title
          style={{
            marginBottom: 5,
            color: 'brown',
            fontSize: 22,
          }}>
          รายละเอียดเพิ่มเติม: {item.customerRemark}
        </ListItem.Title>
        <ListItem.Title
          style={{
            marginBottom: 5,
            fontSize: 22,
          }}>
          วันที่โพสท์:{' '}
          {Moment(item.sys_create_date).format('D MMM YYYY HH:mm:ss')}
        </ListItem.Title>
      </ListItem.Content>
      <ProgressCircle
        percent={30}
        radius={17}
        borderWidth={1.5}
        color="f580084"
        shadowColor="#FFF"
        bgColor="#FFF">
        <Image source={require('../../../../assets/icons/pl.png')} />
      </ProgressCircle>
    </ListItem>
  );

  const renderItemType4 = ({ item }) => (
    <ListItem
      bottomDivider
      containerStyle={{
        backgroundColor: null,
        borderRadius: 8,
        marginVertical: 5,
      }}
      underlayColor="pink">
      <ListItem.Content style={{ margin: 10 }}>
        <ListItem.Title
          style={{
            marginBottom: 5,
            backgroundColor: 'pink',
          }}>
          ref: {item.id}
        </ListItem.Title>
        <ListItem.Title
          style={{
            marginBottom: 5,
          }}>
          ลูกค้า: {item.customerName}
        </ListItem.Title>
        <ListItem.Title
          style={{
            marginBottom: 5,
          }}>
          Level: {item.customerLevel}
        </ListItem.Title>
        <ListItem.Title
          style={{
            marginBottom: 5,
          }}>
          เวลาที่จะไป: {item.timeMeeting}
        </ListItem.Title>
        <ListItem.Title
          style={{
            marginBottom: 5,
          }}>
          วันที่โพสท์:{' '}
          {Moment(item.sys_create_date).format('D MMM YYYY HH:mm:ss')}
        </ListItem.Title>
        {item.selectStatus !== AppConfig.PostsStatus.customerConfirm && (
          <View style={{ alignSelf: 'center' }}>
            <Button
              title="แจ้งรับงาน"
              buttonStyle={{
                backgroundColor: 'blue',
                margin: 5,
                width: '100%',
              }}
              onPress={() => partnerConfrim(item)}
            />
            <Button
              title="ปฏิเสธงาน"
              buttonStyle={{ backgroundColor: 'red', margin: 5, width: '100%' }}
              onPress={() => partnerReject(item)}
            />
          </View>
        )}
      </ListItem.Content>
    </ListItem>
  );

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <Text style={styles.textTopic}>โพสท์ทั้งหมดในระบบ</Text>
        <View
          style={{
            backgroundColor: 'chocolate',
            alignItems: 'center',
            width: '100%',
            height: 30,
            justifyContent: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 20 }}>
            โหมด: {item.name}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>
            จังหวัด: {getProvinceName(profile.province)}
          </Text>
        </View>
        <View style={styles.container}>
          {taskList.length === 0 && (
            <CardNotfound text="ไม่พบข้อมูลโพสท์ในระบบ" />
          )}
          {taskList.length > 0 && (
            <FlatList
              keyExtractor={item => item.id.toString()}
              data={taskList}
              renderItem={
                item.name === AppConfig.PartnerType.type4
                  ? renderItemType4
                  : renderItem
              }
              style={{
                height: 600,
                padding: 5,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => handleRefresh()}
                />
              }
            />
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnNewPost: {
    margin: 5,
    borderRadius: 75,
    height: 45,
    width: 250,
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

export default SelectProvinceTaskList;
