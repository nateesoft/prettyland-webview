import React, { useState, useEffect } from 'react';
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

import { getMemberProfile } from '../../../apis';
import CardNotfound from '../../../components/CardNotfound';
import { AppConfig } from '../../../Constants';

const AllTaskListScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const [profile, setProfile] = useState({});

  const handleRefresh = () => {};

  const onPressOptions = item => {
    navigation.navigate('All-Customer-Post-List', {
      profile,
      item: { ...item },
    });
  };

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onPress={() => onPressOptions(item)}
      containerStyle={{
        borderRadius: 8,
        marginVertical: 5,
        backgroundColor: null,
      }}
      underlayColor="pink">
      <ListItem.Content style={{ margin: 10 }}>
        <ListItem.Title
          style={{
            fontSize: 20,
            marginBottom: 5,
            paddingHorizontal: 5,
            fontWeight: 'bold',
          }}>
          จังหวัด: {item.provinceName}
        </ListItem.Title>
        {profile.type1 && (
          <ListItem.Title
            style={{
              marginLeft: 15,
              marginBottom: 5,
              paddingHorizontal: 5,
            }}>
            {AppConfig.PartnerType.type1} ({item.partner1})
          </ListItem.Title>
        )}
        {profile.type2 && (
          <ListItem.Title
            style={{
              marginLeft: 15,
              marginBottom: 5,
              paddingHorizontal: 5,
            }}>
            {AppConfig.PartnerType.type2} ({item.partner2})
          </ListItem.Title>
        )}
        {profile.type3 && (
          <ListItem.Title
            style={{
              marginLeft: 15,
              marginBottom: 5,
              paddingHorizontal: 5,
            }}>
            {AppConfig.PartnerType.type3} ({item.partner3})
          </ListItem.Title>
        )}
        {profile.type4 && (
          <ListItem.Title
            style={{
              marginLeft: 15,
              marginBottom: 5,
              paddingHorizontal: 5,
            }}>
            {AppConfig.PartnerType.type4} ({item.partner4})
          </ListItem.Title>
        )}
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

  useEffect(() => {
    getMemberProfile(userId).then(data => {
      setProfile(data);
    });
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <Text style={styles.textTopic}>โพสท์ทั้งหมดในระบบ</Text>
        <View style={styles.container}>
          {filterList.length === 0 && (
            <CardNotfound text="ไม่พบข้อมูลโพสท์ในระบบ" />
          )}
          {filterList.length > 0 && (
            <FlatList
              keyExtractor={item => item.provinceId.toString()}
              data={filterList}
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

export default AllTaskListScreen;
