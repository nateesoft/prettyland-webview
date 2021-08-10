import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableNativeFeedback,
  Alert,
  ImageBackground,
  ScrollView,
} from 'react-native';
// import Video from 'react-native-video';
import { Button, Text } from 'react-native-elements';
import { Ionicons, Feather, AntDesign } from 'react-native-vector-icons';
import Moment from 'moment';
// import { ActivityIndicator } from 'react-native-paper';

import { AppConfig } from '../../../Constants';
import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';

const MemberDetailScreen = ({ navigation, route }) => {
  const { navigate } = navigation;
  const { item, topic } = route.params;
  const video = useRef(null);
  const [status, setStatus] = useState({});

  const confirmRemovePermanent = () => {
    firebase
      .database()
      .ref(getDocument(`members/${item.id}`))
      .remove();
    navigate('List-All-Member');
  };

  const handleRemovePermanent = () => {
    Alert.alert(
      'ต้องการลบข้อมูลผู้ใช้ถาวร ใช่หรือไม่ ?',
      'กรุณายืนยันอีกครั้ง ถ้ากดลบข้อมูลจะไม่สามารถเรียกคืนได้อีก !!!',
      [
        {
          text: 'ยืนยันการลบ',
          onPress: () => confirmRemovePermanent(),
        },
        {
          text: 'ยกเลิก',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  const onPreviewImageList = index => {
    const images = [
      { url: item.imageUrl1 },
      { url: item.imageUrl2 },
      { url: item.imageUrl3 },
      { url: item.imageUrl4 },
      { url: item.imageUrl5 },
    ];
    navigate('Image-Preview', { index, images });
  };

  const approveMember = () => {
    // update status member
    firebase
      .database()
      .ref(getDocument(`members/${item.id}`))
      .update({
        status: AppConfig.MemberStatus.active,
        statusText: AppConfig.MemberStatus.activeMessage,
        status_priority: AppConfig.MemberStatus.activePriority,
        member_register_date: new Date().toUTCString(),
        member_update_date: new Date().toUTCString(),
        sys_update_date: new Date().toUTCString(),
      });
    navigation.navigate('List-All-Member');
  };

  const suspendMember = () => {
    // update status member
    firebase
      .database()
      .ref(getDocument(`members/${item.id}`))
      .update({
        status: AppConfig.MemberStatus.suspend,
        statusText: AppConfig.MemberStatus.suspendMessage,
        status_priority: AppConfig.MemberStatus.suspendPriority,
        member_update_date: new Date().toUTCString(),
        sys_update_date: new Date().toUTCString(),
      });
    navigation.navigate('List-All-Member');
  };

  const cancelSuspendMember = () => {
    // update status member
    firebase
      .database()
      .ref(getDocument(`members/${item.id}`))
      .update({
        status: AppConfig.MemberStatus.active,
        statusText: AppConfig.MemberStatus.activeMessage,
        status_priority: AppConfig.MemberStatus.activePriority,
        member_register_date: new Date().toUTCString(),
        member_update_date: new Date().toUTCString(),
        sys_update_date: new Date().toUTCString(),
      });
    navigation.navigate('List-All-Member');
  };

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <ScrollView
        style={{ height: '100%' }}
        showsHorizontalScrollIndicator={false}>
        <Text style={styles.textTopic}>แสดงรายละเอียดสมาชิก</Text>
        <View style={styles.viewCard}>
          {item.image && (
            <View style={{ alignItems: 'center' }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {item.imageUrl1 && (
                  <TouchableNativeFeedback
                    onPress={() => onPreviewImageList(0)}>
                    <View style={styles.mediaImageContainer}>
                      <Image
                        source={{ uri: item.imageUrl1 }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                  </TouchableNativeFeedback>
                )}
                {item.imageUrl2 && (
                  <TouchableNativeFeedback
                    onPress={() => onPreviewImageList(1)}>
                    <View style={styles.mediaImageContainer}>
                      <Image
                        source={{ uri: item.imageUrl2 }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                  </TouchableNativeFeedback>
                )}
                {item.imageUrl3 && (
                  <TouchableNativeFeedback
                    onPress={() => onPreviewImageList(2)}>
                    <View style={styles.mediaImageContainer}>
                      <Image
                        source={{ uri: item.imageUrl3 }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                  </TouchableNativeFeedback>
                )}
                {item.imageUrl4 && (
                  <TouchableNativeFeedback
                    onPress={() => onPreviewImageList(3)}>
                    <View style={styles.mediaImageContainer}>
                      <Image
                        source={{ uri: item.imageUrl4 }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                  </TouchableNativeFeedback>
                )}
                {/* {item.videoUrl && (
                  <View style={styles.mediaImageContainer}>
                    <Video
                      ref={video}
                      style={styles.video}
                      source={{ uri: item.videoUrl }}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                      onPlaybackStatusUpdate={status =>
                        setStatus(() => status)
                      }>
                      <ActivityIndicator style={styles.video} size="large" />
                    </Video>
                  </View>
                )} */}
              </ScrollView>
            </View>
          )}
          {item.memberType === 'partner' ? (
            <View
              style={{
                padding: 20,
                borderWidth: 1,
                borderRadius: 25,
                margin: 10,
              }}>
              <Text style={{ fontSize: 16, color: 'blue' }}>
                ชื่อ: {item.name || item.username}
              </Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                โหมดงาน: {topic}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                วันที่เป็นสมาชิก:{' '}
                {item.member_register_date
                  ? Moment(item.member_register_date).format('D MMM YYYY')
                  : '[ รออนุมัติ ]'}
              </Text>
              {item.memberType === 'admin' && (
                <Text style={{ fontSize: 16, marginVertical: 5 }}>
                  Level: {item.customerLevel || 0}
                </Text>
              )}
              {item.memberType === 'partner' && (
                <View>
                  <Text style={{ fontSize: 16 }}>
                    คะแนน: {item.point || 0} คะแนน
                  </Text>
                </View>
              )}
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                เบอร์ติดต่อ: {item.mobile || '[ ไม่พบข้อมูล ]'}
              </Text>
              <Text style={{ fontSize: 16 }}>สถานะ: {item.statusText}</Text>
            </View>
          ) : (
            <View
              style={{
                padding: 20,
                borderWidth: 1,
                borderRadius: 25,
                margin: 10,
              }}>
              <Text style={{ fontSize: 22, color: 'blue' }}>
                ชื่อ: {item.name || item.username || item.profile}
              </Text>
              {item.memberType === 'customer' && (
                <View>
                  <Text style={{ fontSize: 22 }}>ตำแหน่งงาน: ลูกค้า</Text>
                  <Text style={{ fontSize: 22 }}>
                    Level: {item.customerLevel}
                  </Text>
                </View>
              )}
              {item.customerType === 'admin' && (
                <Text style={{ fontSize: 22 }}>ตำแหน่งงาน: ผู้ดูแลระบบ</Text>
              )}
            </View>
          )}
        </View>
        <View style={{ alignItems: 'center' }}>
          {item.status === AppConfig.MemberStatus.newRegister && (
            <Button
              icon={
                <Feather
                  name="user-check"
                  size={24}
                  color="white"
                  style={{ marginRight: 5 }}
                />
              }
              iconLeft
              buttonStyle={{
                margin: 5,
                backgroundColor: 'green',
                width: 250,
                borderRadius: 10,
              }}
              title="อนุมัติข้อมูล"
              onPress={() => approveMember()}
            />
          )}
          {item.status &&
            item.status !== AppConfig.MemberStatus.newRegister &&
            item.status !== AppConfig.MemberStatus.suspend && (
              <Button
                icon={
                  <AntDesign
                    name="deleteuser"
                    size={24}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                }
                iconLeft
                buttonStyle={{
                  margin: 5,
                  backgroundColor: 'red',
                  width: 250,
                  borderRadius: 10,
                }}
                title="สั่งพักงาน"
                onPress={() => suspendMember()}
              />
            )}
          {item.status === AppConfig.MemberStatus.suspend && (
            <Button
              icon={
                <Ionicons
                  name="shield-checkmark-outline"
                  size={15}
                  color="white"
                  style={{ marginRight: 5 }}
                />
              }
              iconLeft
              buttonStyle={{
                margin: 5,
                backgroundColor: 'blue',
                width: 250,
                borderRadius: 10,
              }}
              title="ยกเลิกสั่งพักงาน"
              onPress={() => cancelSuspendMember()}
            />
          )}
          <Button
            icon={
              <Ionicons
                name="trash-bin-outline"
                size={24}
                color="white"
                style={{ marginRight: 5 }}
              />
            }
            iconLeft
            buttonStyle={{
              margin: 5,
              backgroundColor: 'red',
              width: 250,
              borderRadius: 10,
            }}
            title="ลบข้อมูลออกจากระบบ"
            onPress={() => handleRemovePermanent()}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardDetail: {
    flex: 1,
    padding: 5,
    margin: 10,
    alignSelf: 'center',
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
    borderRadius: 20,
    padding: 5,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  mediaImageContainer: {
    width: 250,
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 300,
    borderRadius: 25,
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

export default MemberDetailScreen;
