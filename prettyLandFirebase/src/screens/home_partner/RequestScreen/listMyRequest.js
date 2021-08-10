import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  StyleSheet,
  Image,
  RefreshControl,
  ImageBackground,
  Alert,
} from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import ProgressCircle from 'react-native-progress-circle';
import moment from 'moment';

import CardNotfound from '../../../components/CardNotfound';
import firebase from '../../../util/firebase';
import { snapshotToArray, getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';

const ListMyWorkScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [filterList, setFilterList] = useState([]);

  const handleRefresh = () => {};

  const onPressOptions = item => {
    if (item.status !== AppConfig.PostsStatus.waitAdminConfirmPayment) {
      navigation.navigate('Work-Detail', { item });
    }
  };

  const getListMyWork = snapshot => {
    return new Promise((resolve, reject) => {
      const posts = snapshotToArray(snapshot);
      let myWorkList = [];
      posts.forEach(item => {
        const data = item.partnerSelect;
        for (let key in data) {
          const obj = data[key];
          const statusMatch =
            item.status === AppConfig.PostsStatus.waitPartnerConfrimWork ||
            item.status === AppConfig.PostsStatus.waitCustomerSelectPartner;
          if (obj.partnerId === userId && statusMatch) {
            myWorkList.push(item);
          }
        }
      });
      setFilterList(myWorkList);
      resolve(true);
    });
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
      <ListItem.Content style={{ marginLeft: 10 }}>
        {item.status !== AppConfig.PostsStatus.adminConfirmPayment && (
          <View style={{ marginBottom: 10 }}>
            <ListItem.Title>โหมดงาน: {item.partnerRequest}</ListItem.Title>
            <ListItem.Title>จังหวัด: {item.provinceName}</ListItem.Title>
            <ListItem.Title>
              วันที่แจ้ง: {moment(item.sys_create_date).format('D MMM YYYY')}
            </ListItem.Title>
            <Text>---------------------------------------</Text>
            <ListItem.Subtitle>ลูกค้า: {item.customerName}</ListItem.Subtitle>
            <ListItem.Subtitle>
              Lv.ลูกค้า: {item.customerLevel}
            </ListItem.Subtitle>
            <Text>---------------------------------------</Text>
            <ListItem.Title>หมายเหตุ: {item.customerRemark}</ListItem.Title>
          </View>
        )}
        {item.status === AppConfig.PostsStatus.adminConfirmPayment && (
          <View>
            <ListItem.Title>โหมดงาน: {item.partnerRequest}</ListItem.Title>
            <ListItem.Title>จังหวัด: {item.provinceName}</ListItem.Title>
            <ListItem.Title>
              วันที่แจ้ง: {moment(item.sys_create_date).format('D MMM YYYY')}
            </ListItem.Title>
            <Text>---------------------------------------</Text>
            <ListItem.Subtitle>ลูกค้า: {item.customerName}</ListItem.Subtitle>
            <ListItem.Subtitle>
              Lv.ลูกค้า: {item.customerLevel}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              เบอร์ติดต่อ: {item.customerPhone}
            </ListItem.Subtitle>
            <Text>---------------------------------------</Text>
          </View>
        )}
        <ListItem.Title
          style={{
            backgroundColor: 'blue',
            color: 'white',
            paddingHorizontal: 5,
          }}>
          สถานะ: {item.statusText}
        </ListItem.Title>
      </ListItem.Content>
      <ProgressCircle
        percent={30}
        radius={17}
        borderWidth={1.5}
        color="f580084">
        <Image source={require('../../../../assets/icons/pl.png')} />
      </ProgressCircle>
    </ListItem>
  );

  useEffect(() => {
    const ref = firebase.database().ref(getDocument('posts'));
    const listener = ref.on('value', snapshot => {
      getListMyWork(snapshot).catch(err => Alert.alert(err));
    });

    return () => ref.off('value', listener);
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <Text style={styles.textTopic}>งานที่เสนอทั้งหมด</Text>
        <View style={styles.container}>
          {filterList.length === 0 && (
            <CardNotfound text="ไม่พบข้อมูลโพสท์ในระบบ" />
          )}
          {filterList.length > 0 && (
            <FlatList
              keyExtractor={item => item.id.toString()}
              data={filterList}
              renderItem={renderItem}
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
  textTopicDetail: {
    fontSize: 16,
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
    justifyContent: 'center',
  },
});

export default ListMyWorkScreen;
