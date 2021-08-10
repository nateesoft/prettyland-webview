import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  StyleSheet,
  RefreshControl,
  ImageBackground,
  Image,
} from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import Moment from 'moment';

import CardNotfound from '../../../components/CardNotfound';
import firebase from '../../../util/firebase';
import { snapshotToArray, getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';

import NoImage from '../../../../assets/avatar/1.png';

const MemberList = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const ref = firebase
      .database()
      .ref(getDocument('members'))
      .orderByChild('status_priority');
    ref.once('value', snapshot => {
      const memberInCloud = snapshotToArray(snapshot);
      setMembers(
        memberInCloud.filter((item, index) => item.memberType === 'customer'),
      );
    });
  }, []);

  const handleRefresh = () => {};

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      containerStyle={{
        backgroundColor: null,
        borderRadius: 8,
        marginVertical: 5,
      }}
      underlayColor="pink">
      <ListItem.Content style={{ marginLeft: 10 }}>
        <Image
          source={item.image ? { uri: item.image } : NoImage}
          style={{ width: 100, height: 100 }}
        />
        <ListItem.Title style={{ color: 'blue' }}>
          ชื่อ: {item.profile}
        </ListItem.Title>
        <ListItem.Title>ประเภท: {item.customerType}</ListItem.Title>
        <ListItem.Title>Level: {item.customerLevel}</ListItem.Title>
        <ListItem.Title>สถานะ: {item.status}</ListItem.Title>
        <View
          style={{
            padding: 5,
            borderWidth: 1,
            marginVertical: 5,
            borderColor: '#aaa',
          }}>
          <ListItem.Title>
            วันที่สมัคร:{' '}
            {Moment(item.sys_create_date).format('D/MM/YYYY HH:mm:ss')}
          </ListItem.Title>
          <ListItem.Title>
            ข้อมูลล่าสุด:{' '}
            {Moment(item.sys_update_date).format('D/MM/YYYY HH:mm:ss')}
          </ListItem.Title>
        </View>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <Text style={styles.textTopic}>รายงานการสมัครสมาชิก</Text>
        <View style={styles.container}>
          {members.length === 0 && (
            <CardNotfound text="ไม่พบข้อมูลสมาชิกในระบบ" />
          )}
          {members.length > 0 && (
            <FlatList
              keyExtractor={item => item.id.toString()}
              data={members}
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
  btnNewPost: {
    backgroundColor: '#35D00D',
    margin: 5,
    borderRadius: 75,
    height: 45,
    width: 250,
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
});

export default MemberList;
