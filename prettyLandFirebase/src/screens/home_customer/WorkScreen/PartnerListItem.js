import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { Button } from 'react-native-elements';

import { AppConfig } from '../../../Constants';
import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';

export default function PartnerListItem(props) {
  const { items, status, postId, navigation } = props;
  const [showButton, setShowButton] = useState('show');

  const saveStartWork = () => {
    firebase
      .database()
      .ref(getDocument(`posts/${postId}`))
      .update({
        status: AppConfig.PostsStatus.startWork,
        statusText: 'เริ่มปฏิบัติงาน',
        sys_update_date: new Date().toUTCString(),
        start_work_date: new Date().toUTCString(),
      });
    navigation.navigate('Post-List');
  };

  const saveToCloseJob = () => {};

  return (
    <SafeAreaView>
      <View>
        {status === AppConfig.PostsStatus.adminConfirmPayment && (
          <Button
            title="กดเริ่มงาน"
            style={styles.button}
            onPress={() => saveStartWork()}
          />
        )}
        {status === AppConfig.PostsStatus.customerStartWork && (
          <Button
            title="ให้คะแนนน้องๆ"
            style={styles.button}
            onPress={() => saveToCloseJob()}
          />
        )}
        {status === AppConfig.PostsStatus.customerCloseJob && (
          <View>
            <Text>สถานะ: </Text>
            <Text>คะแนนที่ได้รับ: </Text>
          </View>
        )}
        {showButton === 'process' && (
          <Text style={{ color: 'blue' }}>บันทึกข้อมูลเรียบร้อย</Text>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <View
            id={item.partnerId}
            key={`v_${item.id}_${index}`}
            style={{
              margin: 5,
              padding: 10,
              backgroundColor: 'red',
              height: 300,
              borderRadius: 15,
            }}>
            <View
              style={{
                backgroundColor: '#eee',
                padding: 5,
                marginLeft: -10,
                marginTop: -10,
                borderBottomRightRadius: 15,
              }}>
              <Text style={{ color: 'blue' }}>ชื่อ: {item.partnerName}</Text>
              <Text
                style={{ color: 'black', fontWeight: 'bold', color: 'blue' }}>
                ราคา: {item.amount}
              </Text>
            </View>
            <Image
              key={`img_${item.id}_${index}`}
              source={{ uri: item.image }}
              style={styles.image}
            />
            <Text style={{ color: 'white' }}>เบอร์โทร: {item.telephone}</Text>
            <Text style={{ color: 'white' }}>เพศ: {item.sex}</Text>
            <Text style={{ color: 'white' }}>บุคลิค: {item.character}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: 130,
    margin: 5,
    borderWidth: 1.5,
    borderRadius: 15,
  },
  button: {
    margin: 10,
    borderRadius: 5,
  },
});
