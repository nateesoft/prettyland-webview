import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableHighlight,
  View,
  Image,
  Dimensions,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import * as WebBrowser from 'expo-web-browser';
// import * as Linking from 'expo-linking';

import firebase from '../../util/firebase';
import { getDocument } from '../../util';

// onPress={() => Linking.openURL("https://pretty-land.web.app/")
// onPress={() => WebBrowser.openBrowserAsync("https://pretty-land.web.app/")

const BroadcastNews = ({
  visible,
  title,
  link,
  external = true,
  imageUrl,
  userId,
  id,
}) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const openBrowser = (to, broadcastId, userId) => {
    if (external) {
      // Linking.openURL(to);
    } else {
      // WebBrowser.openBrowserAsync(to);
    }
    handleClose(broadcastId, userId);
  };

  const handleClose = (broadcastId, userId) => {
    setModalVisible(!modalVisible);
    firebase
      .database()
      .ref(getDocument(`broadcast_news/${broadcastId}/users/${userId}`))
      .update({
        userId: userId,
      });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}
      presentationStyle="overFullScreen">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableHighlight
            underlayColor="white"
            onPress={() => handleClose(id, userId)}
            style={{
              backgroundColor: 'rgb(70, 240, 238)',
              position: 'absolute',
              zIndex: 2,
              right: 10,
              top: 10,
              padding: 5,
            }}>
            <AntDesign name="close" color="white" size={32} />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="white"
            onPress={() => openBrowser(link, id, userId)}>
            <Image
              source={{ uri: imageUrl }}
              style={{
                width: Dimensions.get('window').width - 50,
                height: 350,
                padding: 10,
                margin: 10,
              }}
            />
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: null,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: 250,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'red',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    fontSize: 18,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default BroadcastNews;
