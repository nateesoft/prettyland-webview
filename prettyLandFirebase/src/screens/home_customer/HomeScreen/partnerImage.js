import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  ImageBackground,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import { AirbnbRating } from 'react-native-elements';

import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';

export default function PartnerImage({ navigation, route }) {
  const { data } = route.params;
  const { partnerProfile } = data;

  const video = useRef(null);
  const [selectStatus, setSelectStatus] = useState('');
  const [images, setImages] = useState([]);

  const [starCount, setStarCount] = useState(0);
  const [rate5, setRate5] = useState(0);
  const [rate4, setRate4] = useState(0);
  const [rate3, setRate3] = useState(0);
  const [rate2, setRate2] = useState(0);
  const [rate1, setRate1] = useState(0);

  const onPressSelectPartner = () => {
    navigation.navigate('Time-Price-Form', { data });
  };

  const cancelSelectPartner = () => {
    navigation.navigate('Partner-List-Select');
  };

  const onPreviewImageList = index => {
    navigation.navigate('Image-Preview', { index, images });
  };

  const ProgressBar = ({ rate, title }) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={{ color: 'white', marginRight: 5 }}>{title}</Text>
        <Progress.Bar
          progress={rate}
          width={200}
          color="green"
          style={styles.progress}
        />
      </View>
    );
  };

  const getStarFromPosts = snapshot => {
    return new Promise((resolve, reject) => {
      let count = 0;
      let point = 0;

      let r5 = 0;
      let r4 = 0;
      let r3 = 0;
      let r2 = 0;
      let r1 = 0;

      snapshot.forEach(item => {
        count = count + 1;
        const data = { ...item.val() };
        if (data.star === 5) {
          r5 = r5 + 1;
        }
        if (data.star === 4) {
          r4 = r4 + 1;
        }
        if (data.star === 3) {
          r3 = r3 + 1;
        }
        if (data.star === 2) {
          r2 = r2 + 1;
        }
        if (data.star === 1) {
          r1 = r1 + 1;
        }
        if (data.star) {
          point = point + data.star;
        }
      });
      setStarCount(point / count);
      setRate5(r5 / count);
      setRate4(r4 / count);
      setRate3(r3 / count);
      setRate2(r2 / count);
      setRate1(r1 / count);

      resolve(true);
    });
  };

  useEffect(() => {
    const ref = firebase
      .database()
      .ref(getDocument(`partner_star/${partnerProfile.partnerId}`));
    ref.once('value', snapshot => {
      if (snapshot.numChildren()) {
        getStarFromPosts(snapshot).catch(err => Alert.alert(err));
      }
    });

    setImages([
      { url: partnerProfile.imageUrl1 || null },
      { url: partnerProfile.imageUrl2 || null },
      { url: partnerProfile.imageUrl3 || null },
      { url: partnerProfile.imageUrl4 || null },
      { url: partnerProfile.imageUrl5 || null },
    ]);
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Text style={{ fontSize: 20, color: 'green', fontWeight: 'bold' }}>
            ข้อมูลน้องๆ
          </Text>
          <View
            style={{
              alignItems: 'center',
              padding: 10,
              marginTop: 10,
              borderWidth: 2.5,
              borderColor: '#ff2fe6',
              width: 350,
              borderRadius: 25,
            }}>
            <Text style={{ fontSize: 16, color: 'blue' }}>
              ชื่อน้องๆ: {partnerProfile.name}
            </Text>
            <Text style={{ fontSize: 16 }}>
              สัดส่วน {partnerProfile.stature} สูง {partnerProfile.height}
            </Text>
            <Text style={{ fontSize: 16 }}>
              ราคาที่เสนอ: {partnerProfile.price4} บาท
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              padding: 10,
              marginTop: 10,
              borderWidth: 2.5,
              borderColor: '#ff2fe6',
              backgroundColor: 'black',
              width: 350,
              borderRadius: 25,
            }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ width: '30%', flex: 1, alignItems: 'center' }}>
                <Text
                  style={{ color: 'white', fontSize: 36, fontWeight: 'bold' }}>
                  {starCount.toFixed(1)}
                </Text>
                <AirbnbRating
                  count={5}
                  isDisabled={true}
                  defaultRating={starCount.toFixed(0)}
                  reviews={['แย่', 'พอใช้', 'ดี', 'ดีมาก', 'ประทับใจ']}
                  size={12}
                  reviewSize={14}
                />
              </View>
              <View style={{ width: '70%' }}>
                <ProgressBar title="5" rate={rate5} />
                <ProgressBar title="4" rate={rate4} />
                <ProgressBar title="3" rate={rate3} />
                <ProgressBar title="2" rate={rate2} />
                <ProgressBar title="1" rate={rate1} />
              </View>
            </View>
          </View>
          {selectStatus !== AppConfig.PostsStatus.customerConfirm ? (
            <Button
              title="เลือกคนนี้"
              icon={
                <AntDesign
                  name="checkcircleo"
                  size={20}
                  style={{ marginRight: 5 }}
                  color="white"
                />
              }
              color="red"
              buttonStyle={{
                backgroundColor: '#ff2fe6',
                marginVertical: 10,
                borderRadius: 25,
                paddingHorizontal: 15,
              }}
              onPress={() => onPressSelectPartner()}
            />
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  backgroundColor: 'yellow',
                  marginTop: 10,
                }}>
                status: คุณเลือกสมาชิกคนนี้แล้ว
              </Text>
              <Button
                title="ยกเลิกการเลือก"
                buttonStyle={{
                  backgroundColor: 'red',
                  borderRadius: 5,
                  margin: 5,
                }}
                onPress={() => cancelSelectPartner()}
              />
            </View>
          )}
          <ScrollView showsHorizontalScrollIndicator={false}>
            {images.map((item, index) =>
              item.url ? (
                <TouchableNativeFeedback
                  onPress={() => onPreviewImageList(index)}
                  key={`t_${item.partnerId}_${index}`}>
                  <View
                    style={{
                      marginVertical: 5,
                      alignItems: 'center',
                      padding: 10,
                      borderRadius: 25,
                    }}>
                    <Image
                      key={`img_${item.partnerId}_${index}`}
                      source={{ uri: item.url }}
                      style={styles.image}
                    />
                  </View>
                </TouchableNativeFeedback>
              ) : null,
            )}
            {partnerProfile.videoUrl && (
              <View
                style={{
                  marginTop: 5,
                  alignItems: 'center',
                }}>
                <Video
                  ref={video}
                  style={styles.image}
                  source={{ uri: partnerProfile.videoUrl }}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                />
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 350,
    borderRadius: 25,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    height: 400,
    width: 350,
    margin: 5,
    padding: 10,
    borderWidth: 1.5,
    borderRadius: 25,
    borderColor: '#ff2fe6',
  },
  progress: {
    margin: 1,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
