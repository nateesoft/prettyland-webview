import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInputMask } from 'react-native-masked-text';

import { getMemberProfile } from '../../../apis';
import { getBankList } from '../../../data/apis';
import { GetIcon } from '../../../components/GetIcons';
import { AppConfig } from '../../../Constants';

const RegisterPartnerBankForm = ({ navigation, route }) => {
  const { navigate } = navigation;
  const { userId, status, partnerData, appconfig, goTo } = route.params;
  const [bank, setBank] = useState('');
  const [bankNo, setBankNo] = useState('');

  const [openSelectBank, setOpenSelectBank] = useState(false);
  const [bankList, setBankList] = useState(getBankList());

  const handleNextData = () => {
    if (!bank) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุธนาคารที่รอรับเงินโอน');
      return;
    }
    if (!bankNo) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุเลขที่บัญชีธนาคาร');
      return;
    }

    // save data
    const bankData = {
      ...partnerData,
      bank,
      bankNo,
    };

    navigate(goTo ? goTo : 'Partner-Register-Image-Upload', {
      userId,
      status,
      bankData,
      appconfig,
    });
  };

  useEffect(() => {
    getMemberProfile(userId).then(data => {
      setBank(data.bank || '');
      setBankNo(data.bankNo || '');
    });
    if (!appconfig.partner_account) {
      // save data
      const bankData = {
        ...partnerData,
        bank: '',
        bankNo: '',
      };
      navigate('Partner-Register-Image-Upload', {
        userId,
        status,
        bankData,
        appconfig,
      });
    }
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.textFormInfo}>เพิ่มข้อมูลธนาคาร</Text>
        </View>

        <View style={{ width: '80%', alignSelf: 'center' }}>
          <Text style={{ fontSize: 16, padding: 5 }}>ธนาคาร</Text>
          <DropDownPicker
            placeholder="-- เลือกธนาคาร --"
            open={openSelectBank}
            setOpen={setOpenSelectBank}
            value={bank}
            setValue={setBank}
            items={bankList}
            setItems={setBankList}
            textStyle={{ fontSize: 18 }}
            searchable={false}
            selectedItemContainerStyle={{ backgroundColor: '#facaff' }}
          />

          <Text style={{ fontSize: 16, padding: 5, marginTop: 10 }}>
            เลขที่บัญชีธนาคาร
          </Text>
          <View style={styles.formControl}>
            <GetIcon type="fa5" name="money-check" />
            <TextInputMask
              type="custom"
              options={{
                mask: '999-999-9999',
              }}
              value={bankNo}
              onChangeText={text => setBankNo(text)}
              style={styles.textInput}
            />
          </View>
          <Button
            title="ถัดไป"
            iconLeft
            icon={
              <AntDesign
                name="picture"
                color="white"
                size={24}
                style={{ marginHorizontal: 8 }}
              />
            }
            buttonStyle={{
              backgroundColor: '#65A3E1',
              marginTop: 20,
              borderRadius: 25,
              paddingHorizontal: 15,
              height: 45,
              borderWidth: 0.5,
            }}
            onPress={() => handleNextData()}
          />
        </View>
      </SafeAreaView>
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
    borderRadius: 10,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default RegisterPartnerBankForm;
