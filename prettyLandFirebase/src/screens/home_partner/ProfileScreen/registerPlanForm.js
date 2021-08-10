import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';
import { MaterialIcons, FontAwesome } from 'react-native-vector-icons';
import { Button, CheckBox } from 'react-native-elements';
import RadioButtonRN from 'radio-buttons-react-native';
import { TextInputMask } from 'react-native-masked-text';

import { getDocument } from '../../../util';
import firebase from '../../../util/firebase';
import { GetIcon } from '../../../components/GetIcons';
import { AppConfig } from '../../../Constants';
import { getMemberProfile } from '../../../apis';

const sexData = [
  { label: 'ชาย (Male)', value: 'male' },
  { label: 'หญิง (Female)', value: 'female' },
  { label: 'อื่น ๆ (Other)', value: 'other' },
];

const RegisterPlanForm = ({ navigation, route }) => {
  const { navigate } = navigation;
  const { userId, status } = route.params;
  const [items, setItems] = useState([]);

  const [type1, setType1] = useState(true);
  const [type2, setType2] = useState(false);
  const [type3, setType3] = useState(false);
  const [type4, setType4] = useState(false);
  const [price4, setPrice4] = useState('');

  const [sex, setSex] = useState('male');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [character, setCharacter] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [stature, setStature] = useState('');

  const [appconfig, setAppConfig] = useState({});

  const handleNexData = () => {
    if (!type1 && !type2 && !type3 && !type4) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุประเภทงานที่ต้องการรับบริการ !!!');
      return;
    }
    if (!name) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุชื่อหรือชื่อเล่น เพื่อใช้เรียก');
      return;
    }
    if (type4 && !price4) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุราคา สำหรับประเภทนวดแผนไทย');
      return;
    }

    if (!type4) {
      setPrice4(0);
    }

    // save data
    const planData = {
      id: userId,
      type1,
      type2,
      type3,
      type4,
      sex,
      name,
      age,
      height,
      stature,
      weight,
      price4: !price4 ? 0 : price4,
      character,
    };

    navigate('Register-Partner-Form', { userId, status, planData, appconfig });
  };

  const getAppConfigItem = snapshot => {
    return new Promise((resolve, reject) => {
      const appconfig = snapshot.val();
      const dataItems = [];
      dataItems.push({ ...appconfig.partner1 });
      dataItems.push({ ...appconfig.partner2 });
      dataItems.push({ ...appconfig.partner3 });
      dataItems.push({ ...appconfig.partner4 });

      setAppConfig(appconfig);
      resolve(dataItems);
    });
  };

  useEffect(() => {
    const ref = firebase.database().ref(getDocument('appconfig'));
    ref.once('value', snapshot => {
      getAppConfigItem(snapshot).then(res => {
        setItems(res);
      });
    });
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    getMemberProfile(userId).then(data => {
      setName(data.name || '');
      setAge(data.age || '');
      setHeight(data.height || '');
      setStature(data.stature || '');
      setWeight(data.weight || '');
      setType1(data.type1 || false);
      setType2(data.type2 || false);
      setType3(data.type3 || false);
      setType4(data.type4 || false);
      setPrice4(data.price4 || '');
      setSex(data.sex || 'male');
      setCharacter(data.character || '');
    });
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.textFormInfo}>รายละเอียดงานที่สมัคร</Text>
            <Text>(Work Details)</Text>
          </View>

          <View
            style={{ alignItems: 'center', width: '80%', alignSelf: 'center' }}>
            <Text
              style={{
                fontSize: 16,
                padding: 5,
                marginTop: 10,
                alignSelf: 'flex-start',
              }}>
              หมวดหมู่งาน
            </Text>
            <CheckBox
              containerStyle={styles.checkbox}
              title={(items[0] && items[0].name) || ''}
              checked={type1}
              onPress={() => setType1(!type1)}
            />
            <CheckBox
              containerStyle={styles.checkbox}
              title={(items[1] && items[1].name) || ''}
              checked={type2}
              onPress={() => setType2(!type2)}
            />
            <CheckBox
              containerStyle={styles.checkbox}
              title={(items[2] && items[2].name) || ''}
              checked={type3}
              onPress={() => setType3(!type3)}
            />
            <CheckBox
              containerStyle={[styles.checkbox, { marginTop: 50 }]}
              title={(items[3] && items[3].name) || ''}
              checked={type4}
              onPress={() => setType4(!type4)}
            />
            {type4 && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    padding: 5,
                    marginTop: 10,
                    alignSelf: 'flex-start',
                  }}>
                  ราคาสำหรับการนวดแผนไทยต่อ 1 ครั้ง
                </Text>
                <View style={styles.formControlPrice}>
                  <GetIcon type="fa" name="money" />
                  <TextInput
                    value={`${price4}`}
                    onChangeText={value => setPrice4(value)}
                    style={[styles.textInput, { width: 300 }]}
                    placeholder="จำนวนเงิน"
                  />
                </View>
              </>
            )}
          </View>

          <View style={{ width: '80%', alignSelf: 'center' }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, padding: 5, marginTop: 10 }}>
                เพศ
              </Text>
              <RadioButtonRN
                box={false}
                animationTypes={['shake']}
                data={sexData}
                selectedBtn={e => setSex(e.value)}
                icon={
                  <FontAwesome name="check-circle" size={25} color="#2c9dd1" />
                }
                initial={sex === 'male' ? 1 : sex === 'female' ? 2 : 3}
              />
            </View>
            <Text style={{ fontSize: 16, padding: 5 }}>
              ชื่อ/ ชื่อเล่น (Name/ Nickname)
            </Text>
            {!name && (
              <Text style={{ color: 'red' }}>
                ระบุชื่อหรือชื่อเล่น เพื่อใช้เรียก
              </Text>
            )}
            <View style={styles.formControl}>
              <GetIcon type="mci" name="card-account-details" />
              <TextInput
                value={`${name}`}
                onChangeText={value => setName(value)}
                style={styles.textInput}
                placeholder="ชื่อ/ ชื่อเล่น"
              />
            </View>
            <Text style={{ fontSize: 16, padding: 5 }}>อายุ</Text>
            <View style={styles.formControl}>
              <GetIcon type="mci" name="timeline-clock" />
              <TextInput
                value={`${age}`}
                onChangeText={value => setAge(value)}
                style={styles.textInput}
                placeholder="อายุ"
                keyboardType="numeric"
              />
            </View>
            <Text style={{ fontSize: 16, padding: 5 }}>
              นิสัยหรือบุคคลิก (character)
            </Text>
            {!character && (
              <Text style={{ color: 'red' }}>ระบุนิสัย บุคคลิก</Text>
            )}
            <View style={styles.formControl}>
              <GetIcon type="fa5" name="user-astronaut" />
              <TextInput
                value={`${character}`}
                onChangeText={value => setCharacter(value)}
                style={styles.textInput}
                placeholder="นิสัยหรือบุคคลิก (character)"
              />
            </View>
            <Text style={{ fontSize: 16, padding: 5 }}>ส่วนสูง</Text>
            <View style={styles.formControl}>
              <GetIcon type="mci" name="human-male-height" />
              <TextInput
                value={`${height}`}
                onChangeText={value => setHeight(value)}
                style={styles.textInput}
                placeholder="ส่วนสูง"
                keyboardType="numeric"
              />
            </View>
            <Text style={{ fontSize: 16, padding: 5 }}>สัดส่วน</Text>
            <View style={styles.formControl}>
              <GetIcon type="ii" name="md-woman-outline" />
              <TextInputMask
                type="custom"
                options={{
                  mask: '99-99-99',
                }}
                value={stature}
                onChangeText={text => setStature(text)}
                style={styles.textInput}
              />
            </View>
            <Text style={{ fontSize: 16, padding: 5 }}>น้ำหนัก</Text>
            <View style={styles.formControl}>
              <GetIcon type="fa5" name="weight" />
              <TextInput
                value={weight}
                onChangeText={value => setWeight(value)}
                style={styles.textInput}
                placeholder="น้ำหนัก"
                keyboardType="numeric"
              />
            </View>
            <Button
              title="ถัดไป"
              iconLeft
              icon={
                <MaterialIcons
                  name="meeting-room"
                  color="white"
                  size={24}
                  style={{ marginHorizontal: 15 }}
                />
              }
              buttonStyle={{
                backgroundColor: '#65A3E1',
                marginTop: 20,
                borderRadius: 25,
                paddingHorizontal: 15,
                height: 45,
                borderWidth: 0.5,
                marginBottom: 20,
              }}
              onPress={() => handleNexData()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 100,
    width: 100,
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
  textFormInfo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  formControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    borderColor: '#ff2fe6',
    marginTop: 5,
    height: 50,
    borderRadius: 5,
  },
  formControlPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    borderColor: '#ff2fe6',
    marginTop: 5,
    height: 50,
    borderRadius: 5,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  checkbox: { width: '100%', backgroundColor: null, borderColor: '#ff2fe6' },
});

export default RegisterPlanForm;
