import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  StyleSheet,
  Image,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import ProgressCircle from 'react-native-progress-circle';
import Moment from 'moment';

import CardNotfound from '../../../components/CardNotfound';
import { updatePosts } from '../../../apis';
import firebase from '../../../util/firebase';
import { snapshotToArray, getDiffHours, getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';

const PostListAllScreen = ({ navigation, route }) => {
  const { item: itemData, partnerRequest } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);

  const handleRefresh = () => {};

  const onPressOptions = (item, status) => {
    if (status === AppConfig.PostsStatus.waitAdminConfirmPayment) {
      navigation.navigate('Verify-Payment-Slip', { item, topic: itemData.name });
    } else {
      navigation.navigate('Detail-Task', { item, topic: itemData.name });
    }
  };

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onPress={() => onPressOptions(item, item.status)}
      containerStyle={{
        backgroundColor: null,
        borderRadius: 8,
        marginVertical: 5,
      }}
      underlayColor="pink">
      <ListItem.Content style={{ marginLeft: 10 }}>
        <ListItem.Title style={{ color: 'blue', fontSize: 16 }}>
          ชื่อลูกค้า: {item.customerName}
        </ListItem.Title>
        <ListItem.Title
          style={{ marginVertical: 5, fontSize: 16, fontWeight: 'bold' }}
        >
          Level: {item.customerLevel}
        </ListItem.Title>
        <ListItem.Subtitle style={{ fontSize: 16 }}>
          ประเภทงาน: {itemData.name}
        </ListItem.Subtitle>
        <ListItem.Subtitle
          style={{ marginVertical: 5, fontSize: 16, fontWeight: 'bold' }}
        >
          Status: {item.statusText}
        </ListItem.Subtitle>
        <ListItem.Subtitle style={{ marginVertical: 5, fontSize: 14 }}>
          วันที่: {Moment(item.sys_update_date).format('DD/MM/YYYY HH:mm:ss')}
        </ListItem.Subtitle>
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

  const getFilterData = postsList => {
    return new Promise((resolve, reject) => {
      const newData = postsList.filter((item, index) => {
        const countHours = getDiffHours(item.sys_update_date);
        const todayDate = Moment().format('DD/MM/YYYY');
        const tomorrowDate = Moment().add(1, 'day').format('DD/MM/YYYY');
        const yesterDate = Moment().add(-1, 'day').format('DD/MM/YYYY');
        const dbDate = Moment(item.sys_update_date).format('DD/MM/YYYY');
        const isDateValid =
          todayDate === dbDate ||
          tomorrowDate === dbDate ||
          yesterDate === dbDate;
        if (
          isDateValid &&
          item.status !== AppConfig.PostsStatus.closeJob &&
          item.status !== AppConfig.PostsStatus.notApprove &&
          item.status !== AppConfig.PostsStatus.postTimeout
        ) {
          if (item.status === AppConfig.PostsStatus.customerNewPostDone) {
            if (countHours <= 24) {
              return item;
            } else {
              // update timeout
              updatePosts(item.id, {
                status: AppConfig.PostsStatus.postTimeout,
                statusText: 'ข้อมูลการโพสท์ใหม่หมดอายุ',
                sys_update_date: new Date().toUTCString(),
              });
            }
          }

          if (item.status === AppConfig.PostsStatus.adminConfirmNewPost) {
            if (countHours <= 2) {
              return item;
            } else {
              // update timeout
              updatePosts(item.id, {
                status: AppConfig.PostsStatus.postTimeout,
                statusText:
                  'ข้อมูลการโพสท์หมดอายุ หลังจากอนุมัติเกิน 2 ชั่วโมง',
                sys_update_date: new Date().toUTCString(),
              });
            }
          }

          if (item.status === AppConfig.PostsStatus.startWork) {
            if (countHours <= 2) {
              return item;
            } else {
              // update timeout
              updatePosts(item.id, {
                status: AppConfig.PostsStatus.closeJob,
                statusText: 'ระบบปิดโพสท์อัตโนมัติ หลังจาก 2 ชั่วโมง',
                sys_update_date: new Date().toUTCString(),
              });

              // ให้ star/rate สำหรับน้องๆ โพสท์นั้นๆ (เต็ม 5 ดาว)
              for (let key in item.partnerSelect) {
                const partnerData = item.partnerSelect[key];
                firebase
                  .database()
                  .ref(
                    getDocument(
                      `partner_star/${partnerData.partnerId}/${item.id}`,
                    ),
                  )
                  .update({
                    star: 5,
                    sys_date: new Date().toUTCString(),
                  });
              }
            }
          } else {
            return item;
          }
        }
      });
      resolve(newData);
    });
  };

  useEffect(() => {
    let ref = firebase
      .database()
      .ref(getDocument('posts'))
      .orderByChild('partnerRequest')
      .equalTo(partnerRequest);
    const listener = ref.on('value', (snapshot) => {
      const postsList = snapshotToArray(snapshot);
      getFilterData(postsList).then(res => {
        setPosts(
          res.sort((a, b) => {
            return new Date(b.sys_update_date) - new Date(a.sys_update_date);
          }),
        );
      });
    });
    return () => ref.off('value', listener);
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <Text style={styles.textTopic}>รายการโพสท์หางาน</Text>
        <View style={styles.container}>
          {posts.length === 0 && <CardNotfound text="ไม่พบข้อมูลโพสท์ในระบบ" />}
          {posts.length > 0 && (
            <FlatList
              keyExtractor={item => item.id.toString()}
              data={posts}
              renderItem={renderItem}
              style={{
                height: 600,
                borderWidth: 1,
                borderColor: '#eee',
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
    padding: 5,
  },
  textTopic: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#ff2fe6',
    padding: 10,
  },
  btnNewPost: {
    backgroundColor: '#35D00D',
    margin: 5,
    borderRadius: 75,
    height: 45,
    width: 250,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',,
  },
});

export default PostListAllScreen;
