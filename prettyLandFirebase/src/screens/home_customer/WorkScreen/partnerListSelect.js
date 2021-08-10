import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { Text } from 'react-native';
import { Button } from 'react-native-elements';
import { MaterialIcons } from 'react-native-vector-icons';

import firebase from '../../../util/firebase';
import { snapshotToArray, getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';

const PartnerListSelect = ({ navigation, route }) => {
  const { postItem } = route.params;
  const [listSelect, setListSelect] = useState([]);
  const [paymentActive, setPaymentActive] = useState(false);

  const onPressShowPartnerDetail = item => {
    navigation.navigate('Partner-Image', { postItem, partnerItem: item });
  };

  const DisplayCard = ({ data }) => (
    <ImageBackground
      source={{ uri: data.image }}
      style={{
        width: 180,
        height: 300,
        margin: 5,
      }}>
      <View
        style={{
          position: 'absolute',
          bottom: 65,
          backgroundColor: '#0471AB',
          width: '100%',
          height: 30,
          alignItems: 'center',
          opacity: 0.75,
        }}>
        <Text style={{ color: 'white', marginTop: 5 }}>{data.character}</Text>
      </View>
      <View
        style={{
          bottom: 0,
          flex: 1,
          justifyContent: 'center',
          position: 'absolute',
          backgroundColor: 'pink',
          width: '100%',
          height: 65,
          alignItems: 'flex-end',
          paddingRight: 15,
        }}>
        <Text
          style={{
            color: 'purple',
            fontSize: 18,
            fontWeight: 'bold',
            position: 'absolute',
            left: 0,
            top: 0,
            padding: 5,
          }}>
          {data.partnerName}
        </Text>
        <Text
          style={{
            color: 'red',
            fontSize: 18,
            fontWeight: 'bold',
            position: 'absolute',
            right: 0,
            top: 0,
            padding: 5,
          }}>
          อายุ: {data.age}
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontWeight: 'bold',
            position: 'absolute',
            right: 0,
            bottom: 0,
            padding: 5,
          }}>
          {data.sex == 'female' ? 'หญิง' : data.sex == 'male' ? 'ชาย' : 'อื่นๆ'}
        </Text>
        {data.selectStatus === AppConfig.PostsStatus.customerConfirm && (
          <Text
            style={{
              color: 'white',
              position: 'absolute',
              left: 0,
              bottom: 0,
              padding: 3,
              backgroundColor: 'chocolate',
              fontWeight: 'bold',
              borderRadius: 5,
            }}>
            เลือกสมาชิกคนนี้แล้ว
          </Text>
        )}
      </View>
    </ImageBackground>
  );

  useEffect(() => {
    const ref = firebase
      .database()
      .ref(getDocument(`posts/${postItem.id}/partnerSelect`));
    const listener = ref.on('value', snapshot => {
      const listData = snapshotToArray(snapshot);
      setListSelect(listData);
    });
    return () => ref.off('value', listener);
  }, []);

  useEffect(() => {
    const ref = firebase
      .database()
      .ref(getDocument(`posts/${postItem.id}/partnerSelect`))
      .orderByChild('selectStatus')
      .equalTo(AppConfig.PostsStatus.customerConfirm);
    const listener = ref.on('value', snapshot => {
      const sizePartner = snapshotToArray(snapshot);
      if (sizePartner.length > 0) {
        setPaymentActive(true);
      }
    });

    return () => ref.off('value', listener);
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <Text style={styles.textTopic}>น้องๆ พร้อมทำงาน</Text>
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {listSelect.map((item, index) => (
              <TouchableHighlight
                key={index}
                onPress={() => onPressShowPartnerDetail(item)}
                underlayColor="pink"
                style={{ height: 310 }}>
                <DisplayCard data={item} />
              </TouchableHighlight>
            ))}
          </ScrollView>
        </View>
        {paymentActive && (
          <View style={{ alignItems: 'center' }}>
            <Button
              title="เข้าหน้ารับชำระ"
              // icon={
              //   <MaterialIcons
              //     name="attach-money"
              //     size={20}
              //     color="white"
              //     style={{ marginRight: 10 }}
              //   />
              // }
              onPress={() =>
                navigation.navigate('Payment-Form', { item: postItem })
              }
              buttonStyle={{ width: 200, borderRadius: 5, marginTop: 10 }}
            />
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  cardContainer1: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  cardContainer2: {
    flex: 1,
    flexDirection: 'column',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  image: {
    width: 350,
    height: 250,
  },
  button: {},
  textTopic: {
    marginBottom: 15,
  },
  box: {
    flex: 1,
    flexDirection: 'column',
    width: '50%',
    height: '50%',
    padding: 5,
  },
  inner: {
    flex: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    height: 200,
    width: 100,
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

export default PartnerListSelect;
