import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Image,
  ImageBackground,
  Alert,
  SafeAreaView,
} from 'react-native';

// import BroadcastNews from '../../../components/BroadcastNews';

/* import data */
import { getModelDataList } from '../../../apis';
import firebase from '../../../util/firebase';
import { snapshotToArray, getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';

const CustomerDashboard = ({ navigation, route }) => {
  const { userId } = route.params;
  const [items, setItems] = useState([]);
  const [appconfigMaster, setAppConfigMaster] = useState({});

  const [sumGirl1, setSumGirl1] = useState('0');
  const [sumGirl2, setSumGirl2] = useState('0');
  const [sumGirl3, setSumGirl3] = useState('0');
  const [sumGirl4, setSumGirl4] = useState('0');

  const [sumBoy1, setSumBoy1] = useState('0');
  const [sumBoy2, setSumBoy2] = useState('0');
  const [sumBoy3, setSumBoy3] = useState('0');
  const [sumBoy4, setSumBoy4] = useState('0');

  const [modelData, setModelData] = useState([]);

  const getAllPartnerList = snapshot => {
    return new Promise((resolve, reject) => {
      const arr = snapshotToArray(snapshot);
      let typeGirl1 = 0,
        typeBoy1 = 0,
        typeGirl2 = 0,
        typeBoy2 = 0,
        typeGirl3 = 0,
        typeBoy3 = 0,
        typeGirl4 = 0,
        typeBoy4 = 0;
      arr.forEach(item => {
        if (item.type1) {
          if (item.sex === 'female') {
            typeGirl1 = typeGirl1 + 1;
          }
          if (item.sex === 'male') {
            typeBoy1 = typeBoy1 + 1;
          }
        }
        if (item.type2) {
          if (item.sex === 'female') {
            typeGirl2 = typeGirl2 + 1;
          }
          if (item.sex === 'male') {
            typeBoy2 = typeBoy2 + 1;
          }
        }
        if (item.type3) {
          if (item.sex === 'female') {
            typeGirl3 = typeGirl3 + 1;
          }
          if (item.sex === 'male') {
            typeBoy3 = typeBoy3 + 1;
          }
        }
        if (item.type4) {
          if (item.sex === 'female') {
            typeGirl4 = typeGirl4 + 1;
          }
          if (item.sex === 'male') {
            typeBoy4 = typeBoy4 + 1;
          }
        }
      });
      setSumGirl1(typeGirl1);
      setSumGirl2(typeGirl2);
      setSumGirl3(typeGirl3);
      setSumGirl4(typeGirl4);

      setSumBoy1(typeBoy1);
      setSumBoy2(typeBoy2);
      setSumBoy3(typeBoy3);
      setSumBoy4(typeBoy4);

      resolve(true);
    });
  };

  useEffect(() => {
    const ref = firebase.database().ref(getDocument('appconfig'));
    ref.once('value', snapshot => {
      const dataItems = [];
      const appconfig = snapshot.val();
      dataItems.push({ ...appconfig.partner1 });
      dataItems.push({ ...appconfig.partner2 });
      dataItems.push({ ...appconfig.partner3 });
      dataItems.push({ ...appconfig.partner4 });

      setAppConfigMaster(appconfig);
      setItems(dataItems);
    });
  }, []);

  const onPressOptions = item => {
    if (item.value === AppConfig.PartnerType.type4) {
      navigation.navigate('Select-Province-Form-Type4', {
        item,
        partnerGroup: items,
        appconfig: appconfigMaster,
      });
    } else {
      navigation.navigate('Select-Province-Form', {
        item,
        partnerGroup: items,
        appconfig: appconfigMaster,
      });
    }
  };

  const DisplayCard = ({ data, countGirl, countBoy }) => (
    <TouchableHighlight
      underlayColor="pink"
      onPress={() => onPressOptions(data)}
      style={styles.box}>
      <View style={styles.inner}>
        <Image
          source={{ uri: data.image_url }}
          style={{
            height: '80%',
            width: '90%',
            margin: 5,
            borderRadius: 5,
            borderColor: 'white',
            borderWidth: 3,
          }}
        />
        <Text style={styles.optionsName}>{data.name}</Text>
        <Text style={{ fontWeight: 'bold' }}>
          ( Boy : {countBoy} Girl : {countGirl} )
        </Text>
      </View>
    </TouchableHighlight>
  );

  useEffect(() => {
    const ref = firebase
      .database()
      .ref(getDocument('members'))
      .orderByChild('memberType')
      .equalTo('partner');
    const listener = ref.on('value', snapshot => {
      getAllPartnerList(snapshot).catch(err => Alert.alert(err));
    });
    return () => {
      ref.off('value', listener);
    };
  }, []);

  useEffect(() => {
    const ref = firebase.database().ref(getDocument('broadcast_news'));
    const listener = ref.on('value', snapshot => {
      getModelDataList(snapshot, userId).then(res => setModelData(res));
    });

    return () => ref.off('value', listener);
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '93%' }}>
        {/* {modelData &&
        modelData.map((item, index) => (
          <BroadcastNews
            key={`${userId}/${item.id}`}
            id={item.id}
            visible={item.status === 'active'}
            title={item.msg_title}
            link={item.link_connect}
            imageUrl={item.image_url}
            userId={userId}
          />
        ))} */}
        {items.length > 0 && (
          <View style={styles.container}>
            <DisplayCard
              data={items[0]}
              countGirl={sumGirl1}
              countBoy={sumBoy1}
            />
            <DisplayCard
              data={items[1]}
              countGirl={sumGirl2}
              countBoy={sumBoy2}
            />
            <DisplayCard
              data={items[2]}
              countGirl={sumGirl3}
              countBoy={sumBoy3}
            />
            <DisplayCard
              data={items[3]}
              countGirl={sumGirl4}
              countBoy={sumBoy4}
            />
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  box: {
    width: '50%',
    height: '50%',
    padding: 5,
  },
  inner: {
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  optionsInfo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    right: 13,
    top: 17,
    zIndex: 2,
  },
  badge: {
    color: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgb(70, 240, 238)',
    fontWeight: 'bold',
    fontSize: 32,
  },
});

export default CustomerDashboard;
