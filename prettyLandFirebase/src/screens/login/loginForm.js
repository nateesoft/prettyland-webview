import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  Alert,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';
// import Icon from 'react-native-vector-icons/AntDesign';
import { loginApp } from '../../apis';

import bg from '../../../assets/login.png';
import { AppConfig } from '../../Constants';

const LoginForm = ({ navigation, route }) => {
  const { navigate } = navigation;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signIn = () => {
    loginApp(username, password).then(res => {
      const { valid, member } = res;
      if (valid) {
        if (
          member.memberType === 'superadmin' ||
          member.memberType === 'admin'
        ) {
          console.log('go to admin screen');
          navigation.navigate('AdminHome', {
            userId: member.id,
            screen: 'admin',
          });
        } else if (member.memberType === 'partner') {
          console.log('go to partner screen');
          navigation.navigate('PartnerHome', {
            userId: member.id,
            screen: 'partner',
          });
        } else if (member.memberType === 'customer') {
          console.log('go to customer screen');
          navigation.navigate('CustomerHome', {
            userId: member.id,
            screen: 'customer',
          });
        } else {
          navigation.navigate('Notification');
        }
      } else {
        Alert.alert(
          'แจ้งเตือน',
          'กรุณาระบุข้อมูลผู้ใช้งาน และรหัสผ่านให้ครบถ้วน !!!',
        );
      }
    });
  };

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ height: '100%' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center' }}>
            <Image style={styles.image} source={bg} />
            <Text style={styles.textLogo}>PRETTY LAND</Text>
            <Text
              style={[
                styles.textLogo,
                { fontSize: 20, fontStyle: 'normal', marginBottom: 5 },
              ]}>
              Thailand
            </Text>
            <View style={{ width: '80%', alignSelf: 'center' }}>
              <Text style={{ fontSize: 16, padding: 5 }}>
                ข้อมูลผู้ใช้งาน (Username)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 0.5,
                  paddingHorizontal: 10,
                  borderColor: '#00716F',
                  backgroundColor: 'white',
                  height: 40,
                  borderRadius: 10,
                }}>
                {/* <Icon name="user" color="#00716F" size={20} /> */}
                <TextInput
                  style={styles.textInput}
                  placeholder="ข้อมูลผู้ใช้งาน (Username)"
                  value={username}
                  onChangeText={value => setUsername(value)}
                />
              </View>
              <Text style={{ fontSize: 16, padding: 5 }}>
                ข้อมูลรหัสผ่าน (Password)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 0.5,
                  paddingHorizontal: 10,
                  borderColor: '#00716F',
                  backgroundColor: 'white',
                  marginTop: 5,
                  height: 40,
                  borderRadius: 10,
                }}>
                {/* <Icon name="lock" color="#00716F" size={20} /> */}
                <TextInput
                  secureTextEntry={true}
                  style={styles.textInput}
                  placeholder="รหัสผาน (Password)"
                  value={password}
                  onChangeText={value => setPassword(value)}
                />
              </View>
            </View>
            <Button
              title="LOGIN"
              buttonStyle={{
                backgroundColor: '#ff2fe6',
                marginTop: 20,
                borderRadius: 5,
                width: 250,
                paddingHorizontal: 15,
                height: 45,
                borderWidth: 0.5,
              }}
              onPress={() => signIn()}
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

            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Text style={styles.textFooter1}>Contact Us</Text>
              <Text style={styles.textFooter2}>
                Tel : 09-7874-7874 (24Hr) / Line : @Prettylandthailand / Fb:
                PrettyLand - Thailand / Email : Prettylandthailand@gmail.com
              </Text>
              <Text style={styles.textFooter3}>
                คุณเห็นด้วยกับเงื่อนไขการให้บริการ และ นโยบายความเป็นส่วนตัว
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    height: 100,
    width: 100,
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
    marginBottom: 20,
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
  textOr: {
    fontSize: 14,
    color: 'gray',
    marginTop: 50,
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
  textFooter: {
    position: 'absolute',
    bottom: 80,
    width: '90%',
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: 'gray',
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  textFooter1: {
    textAlign: 'center',
    fontSize: 12,
    color: 'red',
  },
  textFooter2: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: 'black',
  },
  textFooter3: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: 'green',
  },
});

export default LoginForm;
