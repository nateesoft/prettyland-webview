import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TouchableHighlight,
  Linking,
  TouchableNativeFeedback,
} from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';
// import Icon from 'react-native-vector-icons/AntDesign';

import { checkToSendAllBroadcastToAllUser } from '../apis';
import firebase from '../util/firebase';
import { getDocument } from '../util';
import bg from '../../assets/login.png';
import lineLogo from '../../assets/icons/LINE_APP.png';
import facebookLogo from '../../assets/icons/f_logo_RGB-Blue_58.png';
import { AppConfig } from '../Constants';

const LoginScreen = ({ navigation, route }) => {
  const { navigate } = navigation;
  const [lineContact, setLineContact] = useState('');
  const [appName, setAppName] = useState('PRETTY LAND');
  const [appVersion, setAppVersion] = useState('1.0');

  const signInFacebook = () => {};

  useEffect(() => {
    const ref = firebase.database().ref(getDocument('appconfig'));
    ref.once('value', snapshot => {
      const data = { ...snapshot.val() };
      setAppName(data.app_name);
      setAppVersion(data.app_version);
      setLineContact(data.line_contact_admin || 'https://lin.ee/DgRh5Mw');
    });
  }, []);

  const LinkToLineContact = () => {
    Linking.openURL(lineContact);
  };

  useEffect(() => {
    const ref = firebase.database().ref(getDocument('broadcast_news'));
    const listener = ref.on('value', snapshot => {
      checkToSendAllBroadcastToAllUser(snapshot).then(res => {
        if (res) {
          console.log('checkToSendAllBroadcastToAllUser:', res);
        }
      });
    });

    return () => ref.off('value', listener);
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <View style={styles.container}>
        <Image style={styles.image} source={bg} />
        <Text style={styles.textLogo}>{appName}</Text>
        <Text
          style={[
            styles.textLogo,
            { fontSize: 20, fontStyle: 'normal', marginBottom: 5 },
          ]}>
          Thailand
        </Text>
        <Text style={styles.textDetail}>( Version {appVersion} )</Text>
        <TouchableHighlight
          underlayColor="pink"
          style={styles.btnLineClickContain}
          onPress={() => navigate('Line-Login-Form')}>
          <View style={styles.btnContainer}>
            <Image source={lineLogo} style={{ width: 24, height: 24 }} />
            <Text
              style={{
                marginLeft: 10,
                color: 'snow',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              เข้าสู่ระบบด้วย LINE
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor="pink"
          style={[styles.btnClickContain, { marginBottom: 20 }]}
          onPress={() => signInFacebook()}>
          <View style={styles.btnContainer}>
            <Image source={facebookLogo} style={{ width: 24, height: 24 }} />
            <Text
              style={{
                marginTop: 2,
                marginLeft: 5,
                color: 'white',
                fontWeight: 'bold',
                fontSize: 14,
              }}>
              เข้าสู่ระบบด้วย facebook
            </Text>
          </View>
        </TouchableHighlight>
        {/* {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
            }
            cornerRadius={5}
            style={{ width: 200, height: 44 }}
            onPress={async () => {
              try {
                const credential = await AppleAuthentication.signInAsync({
                  requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                  ],
                });
                Alert.alert('Connect Apple authentication');
                const decodeData = jwtDecode(credential.identityToken);
                // signed in
                signInApple({
                  userId: credential.user,
                  email: decodeData.email,
                  fullName: decodeData.email,
                });
              } catch (e) {
                if (e.code === 'ERR_CANCELED') {
                  // handle that the user canceled the sign-in flow
                  console.log('apple login cancel');
                } else {
                  // handle other errors
                  console.log('error apple login:', e);
                  Alert.alert(`Apple Auth Error: ${e}`);
                }
              }
            }}
          />
        )} */}
        <Text style={styles.textOr}>------ OR ------</Text>
        <Button
          // icon={
          //   <Icon
          //     name="login"
          //     size={20}
          //     style={{ marginLeft: 10 }}
          //     color="white"
          //   />
          // }
          iconRight
          title="LOGIN"
          titleStyle={{
            fontWeight: 'bold',
            fontSize: 14,
          }}
          buttonStyle={{
            backgroundColor: '#ff2fe6',
            marginTop: 5,
            borderRadius: 5,
            width: 200,
            paddingHorizontal: 15,
            height: 45,
            borderWidth: 1,
            borderColor: 'gray',
          }}
          onPress={() => navigate('Login')}
        />
        <Button
          title="ลงทะเบียน (Register)"
          titleStyle={{
            color: 'blue',
            fontSize: 14,
            textDecorationLine: 'underline',
          }}
          buttonStyle={{
            borderRadius: 25,
            width: 250,
            height: 45,
          }}
          onPress={() => navigate('Register')}
        />
        <TouchableNativeFeedback onPress={() => LinkToLineContact()}>
          <Text style={styles.textFooter1}>Contact Us</Text>
        </TouchableNativeFeedback>
        <Text style={styles.textFooter2}>
          Tel : 09-7874-7874 (24Hr) / Line : @Prettylandthailand / Fb:
          PrettyLand - Thailand / Email : Prettylandthailand@gmail.com
        </Text>
        <Text style={styles.textFooter3}>
          คุณเห็นด้วยกับเงื่อนไขการให้บริการ และ นโยบายความเป็นส่วนตัว
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -120,
  },
  image: {
    height: 85,
    width: 85,
    marginBottom: 10,
  },
  textLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'purple',
  },
  textDetail: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
  },
  btnFacebook: {
    marginHorizontal: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    backgroundColor: 'blue',
    paddingVertical: 2,
    borderRadius: 23,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    textAlignVertical: 'center',
  },
  textOr: {
    marginVertical: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray',
  },
  textInput: {
    backgroundColor: 'white',
    width: 250,
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 5,
  },
  textRegister: {
    color: 'purple',
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textFooter1: {
    width: '90%',
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: 'gray',
    position: 'absolute',
    bottom: 135,
    color: 'red',
  },
  textFooter2: {
    width: '90%',
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: 'gray',
    position: 'absolute',
    bottom: 85,
    color: 'black',
  },
  textFooter3: {
    width: '90%',
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: 'gray',
    position: 'absolute',
    bottom: 60,
    color: 'green',
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  btnClickContain: {
    paddingTop: 11,
    paddingLeft: 10,
    marginBottom: 5,
    backgroundColor: '#0A69D6',
    borderRadius: 5,
    width: 200,
    height: 45,
  },
  btnLineClickContain: {
    paddingTop: 11,
    paddingLeft: 10,
    marginBottom: 5,
    backgroundColor: '#35D00D',
    marginTop: 10,
    borderRadius: 5,
    width: 200,
    height: 45,
  },
});

export default LoginScreen;
