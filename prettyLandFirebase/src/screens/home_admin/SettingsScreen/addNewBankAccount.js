import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInputMask } from 'react-native-masked-text';

import { GetIcon } from '../../../components/GetIcons';
import firebase from '../../../util/firebase';
import { getDocument } from '../../../util';
import { AppConfig } from '../../../Constants';
import { getBankList, getBankName } from '../../../data/apis';

const AddNewBankAccount = ({ navigation, route }) => {
  const [accountNo, setAccountNo] = useState('');
  const [bankCode, setBankCode] = useState('');

  const [openSelectBank, setOpenSelectBank] = useState(false);
  const [bankList, setBankList] = useState(getBankList());
  const [listBank, setListBank] = useState([]);

  const saveNewAdmin = () => {
    if (!accountNo) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุข้อมูลเลขที่บัญชี');
      return;
    }
    if (!bankCode) {
      Alert.alert('แจ้งเตือน', 'กรุณาเลือกธนาคาร');
      return;
    }

    const getBank = getBankName(bankCode);
    const bankData = { ...getBank[0] };

    const dataNewBank = {
      account_no: accountNo,
      bank_code: bankCode,
      bank_name: bankData.label,
      status: 'active',
    };

    firebase
      .database()
      .ref(getDocument(`bank_account/${bankCode}`))
      .update(dataNewBank)
      .then(res => {
        Alert.alert('เพิ่มข้อมูลบัญชีธนาคารแล้ว');
        setAccountNo('');
        setBankCode('');
      })
      .catch(err => Alert.alert(err));
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        padding: 10,
        borderWidth: 1,
        margin: 5,
        borderColor: 'green',
        borderRadius: 5,
      }}>
      <Text style={{ fontSize: 18 }}>
        {item.bank_name}: {item.account_no}
      </Text>
    </View>
  );

  const loadListBank = () => {
    return new Promise((resolve, reject) => {
      const ref = firebase.database().ref(getDocument('bank_account'));
      ref
        .once('value', snapshot => {
          const data = snapshot.val();
          const listB = [];
          for (let obj in data) {
            const objData = data[obj];
            listB.push(objData);
          }
          setListBank(listB);
        })
        .catch(err => {
          reject(err);
        });
      resolve(true);
    });
  };

  useEffect(() => {
    loadListBank().catch(err => Alert.alert(err));
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <Text style={styles.textTopic}>เพิ่มข้อมูลบัญชีธนาคาร</Text>
      <SafeAreaView style={{ flex: 1, height: '100%', alignItems: 'center' }}>
        <View style={styles.cardDetail}>
          <View style={{ alignSelf: 'center', zIndex: 1 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>ธนาคารในระบบ</Text>
            <DropDownPicker
              placeholder="-- เลือกธนาคาร --"
              open={openSelectBank}
              setOpen={setOpenSelectBank}
              value={bankCode}
              setValue={setBankCode}
              items={bankList}
              setItems={setBankList}
              textStyle={{ fontSize: 18 }}
              zIndex={2}
              searchable={false}
              selectedItemContainerStyle={{ backgroundColor: '#facaff' }}
              listMode="SCROLLVIEW"
              style={{ width: 350 }}
              containerStyle={{ width: 350 }}
            />
          </View>
          <View style={styles.viewCard}>
            <Text style={{ fontSize: 18 }}>เลชที่บัญชีธนาคาร</Text>
            <View style={styles.formControl}>
              <GetIcon type="ad" name="idcard" />
              <TextInputMask
                type="custom"
                options={{
                  mask: '999-999-9999',
                }}
                value={accountNo}
                onChangeText={text => setAccountNo(text)}
                style={styles.textInput}
              />
            </View>
          </View>
          <Button
            // icon={
            //   <Icon
            //     name="save"
            //     size={20}
            //     color="white"
            //     style={{ marginRight: 5 }}
            //   />
            // }
            iconLeft
            buttonStyle={styles.btnSave}
            title="อัพเดตข้อมูล"
            onPress={() => saveNewAdmin()}
          />
          <FlatList
            keyExtractor={item => item.bank_code.toString()}
            data={listBank}
            renderItem={renderItem}
            style={{
              height: 600,
              borderWidth: 1,
              borderColor: '#eee',
              padding: 5,
            }}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  btnSave: {
    margin: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    backgroundColor: '#ff2fe6',
  },
  cardDetail: {
    alignItems: 'center',
    padding: 5,
    margin: 10,
  },
  optionsNameDetail: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
    marginBottom: 15,
    marginTop: 10,
  },
  optionsNameDetail2: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
    marginBottom: 15,
    marginTop: 10,
  },
  viewCard: {
    width: '100%',
    borderRadius: 20,
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
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  inputForm: {
    width: '90%',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 5,
  },
  formControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    borderColor: '#ff2fe6',
    marginTop: 5,
    height: 50,
    borderRadius: 10,
    width: 350,
  },
  textInput: {
    width: '90%',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 5,
  },
});

export default AddNewBankAccount;
