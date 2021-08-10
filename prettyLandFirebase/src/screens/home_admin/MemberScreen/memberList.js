import React, { useEffect, useState } from 'react';
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
import { ListItem, Avatar, Text } from 'react-native-elements';
import ProgressCircle from 'react-native-progress-circle';

import CardNotfound from '../../../components/CardNotfound';
import firebase from '../../../util/firebase';
import { snapshotToArray, getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';
import FemaleSimple from '../../../../assets/avatar/1.png';
import MaleSimple from '../../../../assets/avatar/2.png';
import OtherSimple from '../../../../assets/avatar/3.png';
import { getConfigList } from '../../../apis';

const MemberAllListScreen = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [members, setMembers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getConfigList()
      .then(res => setItems(res))
      .catch(err => Alert.alert(err));
    const ref = firebase
      .database()
      .ref(getDocument('members'))
      .orderByChild('status_priority');
    const listener = ref.on('value', snapshot => {
      const memberInCloud = snapshotToArray(snapshot);
      setMembers(
        memberInCloud.filter((item, index) => item.memberType === 'partner'),
      );
    });

    return () => {
      ref.off('value', listener);
    };
  }, []);

  const getPartnerTypeFromFirebase = member => {
    if (member.memberType === 'partner') {
      const listType = [[]];
      if (member.type1) {
        listType.push(items[0].name);
      }
      if (member.type2) {
        listType.push(items[1].name);
      }
      if (member.type3) {
        listType.push(items[2].name);
      }
      if (member.type4) {
        listType.push(items[3].name);
      }
      return listType.toString();
    }
    return member.memberType;
  };

  const handleRefresh = () => {};

  const onPressOptions = (item, topic) => {
    navigation.navigate('Member-Detail', { item, topic });
  };

  const renderItem = ({ item }) =>
    item.memberType === 'partner' ? (
      <ListItem
        bottomDivider
        containerStyle={{
          backgroundColor: null,
          borderRadius: 8,
          marginVertical: 5,
        }}
        onPress={() => onPressOptions(item, getPartnerTypeFromFirebase(item))}
        underlayColor="pink">
        {item.image ? (
          <Avatar source={{ uri: item.image }} size={128} />
        ) : (
          <View>
            <Image
              source={
                item.sex === 'female'
                  ? FemaleSimple
                  : item.sex === 'male'
                  ? MaleSimple
                  : OtherSimple
              }
              style={styles.images}
              resizeMode="cover"
            />
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
        <ListItem.Content style={{ marginLeft: 10 }}>
          <ListItem.Title style={{ color: 'blue' }}>
            ชื่อ: {item.name || item.username}
          </ListItem.Title>
          <ListItem.Subtitle
            style={{
              borderWidth: 1,
              padding: 5,
              borderRadius: 10,
              borderColor: '#aaa',
              marginVertical: 5,
            }}>
            งานที่สมัคร: {getPartnerTypeFromFirebase(item)}
          </ListItem.Subtitle>
          <ListItem.Subtitle>สถานะ: {item.statusText}</ListItem.Subtitle>
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
    ) : (
      <ListItem
        bottomDivider
        containerStyle={{
          backgroundColor: null,
          borderRadius: 8,
          marginVertical: 5,
        }}
        onPress={() => onPressOptions(item, getPartnerTypeFromFirebase(item))}
        underlayColor="pink">
        {item.image ? (
          <Avatar source={{ uri: item.image }} size={128} />
        ) : (
          <View
            style={{
              width: 130,
              height: 130,
              borderWidth: 1,
              padding: 10,
              borderColor: '#aaa',
            }}>
            <Text style={{ alignSelf: 'center' }}>No Image</Text>
          </View>
        )}
        <ListItem.Content style={{ marginLeft: 10 }}>
          <ListItem.Title style={{ color: 'blue' }}>
            ชื่อ: {item.name || item.username || item.profile || item.email}
          </ListItem.Title>
          <ListItem.Subtitle style={{ fontSize: 16, fontWeight: 'bold' }}>
            {item.memberType === 'customer' ? (
              <View style={{ marginBottom: 5 }}>
                <Text>ลูกค้าใช้งาน</Text>
              </View>
            ) : (
              <View style={{ marginBottom: 5 }}>
                <Text>ผู้ดูแลระบบ</Text>
              </View>
            )}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={{ fontSize: 16, fontWeight: 'bold' }}>
            {item.memberType === 'customer' ? (
              item.customerType === 'facebook' ? (
                <View style={styles.tagFacebookLabel}>
                  <Text style={{ color: 'white' }}>
                    เข้าระบบด้วย: {item.customerType}
                  </Text>
                </View>
              ) : item.customerType === 'line' ? (
                <View style={styles.tagLineLabel}>
                  <Text>เข้าระบบด้วย: {item.customerType}</Text>
                </View>
              ) : item.customerType === 'apple' ? (
                <View style={styles.tagAppleLabel}>
                  <Text>เข้าระบบด้วย: {item.customerType}</Text>
                </View>
              ) : (
                <Text>ทาง: อื่น ๆ</Text>
              )
            ) : (
              <Text />
            )}
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

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <Text style={styles.textTopic}>รายชื่อผู้สมัครงาน</Text>
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
  images: { width: 128, height: 128, flex: 1 },
  noImageText: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'orange',
    padding: 5,
  },
  tagLineLabel: {
    backgroundColor: '#35d00D',
    marginTop: 5,
    paddingHorizontal: 5,
  },
  tagFacebookLabel: {
    backgroundColor: 'blue',
    marginTop: 5,
    paddingHorizontal: 5,
  },
  tagAppleLabel: {
    backgroundColor: 'white',
    marginTop: 5,
    paddingHorizontal: 5,
  },
});

export default MemberAllListScreen;
