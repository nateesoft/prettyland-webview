import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';

import BroadcastNews from '../../../components/BroadcastNews';

/* import data */
import firebase from '../../../util/firebase';
import { snapshotToArray, getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';
import { getConfigList, getModelDataList } from '../../../apis';

const AdminDashboard = ({ navigation, route }) => {
  const { userId } = route.params;
  const [items, setItems] = useState([]);
  const [sumType1, setSumType1] = useState('0');
  const [sumType2, setSumType2] = useState('0');
  const [sumType3, setSumType3] = useState('0');
  const [sumType4, setSumType4] = useState('0');

  const [postType1Count, setPostType1Count] = useState(null);
  const [postType2Count, setPostType2Count] = useState(null);
  const [postType3Count, setPostType3Count] = useState(null);
  const [postType4Count, setPostType4Count] = useState(null);

  const [modelData, setModelData] = useState([]);

  const getComputeGroup = snapshot => {
    return new Promise((resolve, reject) => {
      const arr = snapshotToArray(snapshot);
      let type1 = 0,
        type2 = 0,
        type3 = 0,
        type4 = 0;

      let countType1 = 0,
        countType2 = 0,
        countType3 = 0,
        countType4 = 0;

      arr.forEach(item => {
        const statusMatch =
          item.status === AppConfig.PostsStatus.customerNewPostDone ||
          item.status === AppConfig.PostsStatus.waitAdminConfirmPayment;
        if (item.partnerRequest === AppConfig.PartnerType.type1) {
          type1 = type1 + 1;
          if (statusMatch) {
            countType1 = countType1 + 1;
          }
        }
        if (item.partnerRequest === AppConfig.PartnerType.type2) {
          type2 = type2 + 1;
          if (statusMatch) {
            countType2 = countType2 + 1;
          }
        }
        if (item.partnerRequest === AppConfig.PartnerType.type3) {
          type3 = type3 + 1;
          if (statusMatch) {
            countType3 = countType3 + 1;
          }
        }
        if (item.partnerRequest === AppConfig.PartnerType.type4) {
          type4 = type4 + 1;
          if (
            statusMatch ||
            item.status === AppConfig.PostsStatus.waitAdminApprovePost
          ) {
            countType4 = countType4 + 1;
          }
        }
      });

      setSumType1(type1);
      setSumType2(type2);
      setSumType3(type3);
      setSumType4(type4);

      setPostType1Count(countType1);
      setPostType2Count(countType2);
      setPostType3Count(countType3);
      setPostType4Count(countType4);

      resolve(true);
    });
  };

  useEffect(() => {
    const ref = firebase.database().ref(getDocument('posts'));
    const listener = ref.on('value', snapshot => {
      getComputeGroup(snapshot).catch(err => Alert.alert(err));
      getConfigList()
        .then(res => setItems(res))
        .catch(err => Alert.alert(err));
    });
    return () => {
      ref.off('value', listener);
    };
  }, []);

  const onPressOptions = async item => {
    navigation.navigate('Post-List-All', { item, partnerRequest: item.value });
  };

  const DisplayCard = ({ data, count, badge }) => (
    <TouchableHighlight
      underlayColor="pink"
      onPress={() =>
        count > 0 ? onPressOptions(data) : console.log('count:0')
      }
      style={styles.box}>
      <View style={styles.inner}>
        {badge > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badge}>{badge}</Text>
          </View>
        )}
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
        <Text style={{ fontWeight: 'bold', color: 'blue' }}>
          จำนวน {count} งาน
        </Text>
      </View>
    </TouchableHighlight>
  );

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
      {modelData &&
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
        ))}
      {items.length > 0 && (
        <View style={styles.container}>
          <DisplayCard
            data={items[0]}
            count={sumType1}
            badge={postType1Count}
          />
          <DisplayCard
            data={items[1]}
            count={sumType2}
            badge={postType2Count}
          />
          <DisplayCard
            data={items[2]}
            count={sumType3}
            badge={postType3Count}
          />
          <DisplayCard
            data={items[3]}
            count={sumType4}
            badge={postType4Count}
          />
        </View>
      )}
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
    top: 15,
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

export default AdminDashboard;
