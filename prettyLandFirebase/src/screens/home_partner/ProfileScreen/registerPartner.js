import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  ImageBackground,
  ScrollView,
} from 'react-native';
// import { AntDesign } from 'react-native-vector-icons';
import { Button } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInputMask } from 'react-native-masked-text';

import { getCountryList, getDistrictList } from '../../../data/apis';
import { GetIcon } from '../../../components/GetIcons';
import { AppConfig } from '../../../Constants';
import { getMemberProfile } from '../../../apis';

const RegisterPartnerForm = ({ navigation, route }) => {
  const { navigate } = navigation;
  const { userId, status, planData, appconfig } = route.params;
  const { type4 } = planData;
  const [mobile, setMobile] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [lineId, setLineId] = useState('');

  const [openSelectProvince, setOpenSelectProvince] = useState(false);
  const [provinceList, setProvinceList] = useState(getCountryList());

  const [openSelectDistrict, setOpenSelectDistrict] = useState(false);
  const [districtList, setDistrictList] = useState([]);

  const handleNextData = () => {
    if (!lineId) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ Line Id');
      return;
    }
    if (!mobile) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุเบอร์โทรศัพท์ เพื่อติดต่อ');
      return;
    }
    if (!province) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุจังหวัดที่รับงานได้');
      return;
    }
    if (type4 && !address) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุรายละเอียดที่อยู่เพิ่มเติม');
      return;
    }

    // save data
    const partnerData = {
      ...planData,
      mobile,
      province,
      district,
      address,
      lineId,
    };

    navigate('Partner-Register-Bank-Form', {
      userId,
      status,
      partnerData,
      appconfig,
    });
  };

  useEffect(() => {
    getMemberProfile(userId).then(data => {
      setLineId(data.lineId || '');
      setMobile(data.mobile || '');
      setProvince(data.province || '');
      setDistrict(data.district || '');
      setAddress(data.address || '');
    });
  }, []);

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.textFormInfo}>จังหวัดที่รับงาน</Text>
            <Text style={{ marginBottom: 5 }}>(Ways to get a job)</Text>
          </View>
          <View style={{ width: '80%', alignSelf: 'center' }}>
            <Text style={{ fontSize: 16, padding: 5 }}>Line Id</Text>
            <View style={styles.formControl}>
              <GetIcon type="fa5" name="line" />
              <TextInput
                value={`${lineId}`}
                onChangeText={value => setLineId(value)}
                style={styles.textInput}
                placeholder="LINE ID"
              />
            </View>
            <Text style={{ fontSize: 16, padding: 5, marginTop: 5 }}>
              เบอร์โทรศัพท์
            </Text>
            <View style={styles.formControl}>
              <GetIcon type="fa" name="mobile-phone" />
              <TextInputMask
                type="custom"
                options={{
                  mask: '(099)-999-9999',
                }}
                value={mobile}
                onChangeText={text => setMobile(text)}
                style={styles.textInput}
              />
            </View>
            <Text style={{ color: '#123456', marginTop: 5 }}>
              * เบอร์โทรศัพท์จะไม่แสดงให้ลูกค้าเห็น
            </Text>
            <View style={{ alignSelf: 'center' }}>
              <Text style={{ fontSize: 16, padding: 5, marginTop: 10 }}>
                จังหวัด
              </Text>
              <DropDownPicker
                placeholder="-- เลือกจังหวัด --"
                open={openSelectProvince}
                setOpen={setOpenSelectProvince}
                value={province}
                setValue={setProvince}
                items={provinceList}
                setItems={setProvinceList}
                textStyle={{ fontSize: 18 }}
                searchable={false}
                zIndex={4}
                selectedItemContainerStyle={{ backgroundColor: '#facaff' }}
                listMode="SCROLLVIEW"
              />

              <Text style={{ fontSize: 16, padding: 5, marginTop: 5 }}>
                อำเภอ
              </Text>
              <DropDownPicker
                placeholder="-- เลือก เขต/อำเภอ --"
                open={openSelectDistrict}
                setOpen={setOpenSelectDistrict}
                value={district}
                setValue={setDistrict}
                items={getDistrictList(province)}
                setItems={setDistrictList}
                searchable={false}
                textStyle={{ fontSize: 18 }}
                zIndex={3}
                selectedItemContainerStyle={{ backgroundColor: '#facaff' }}
                listMode="SCROLLVIEW"
              />
              {type4 && (
                <View>
                  <View style={styles.formControl}>
                    <GetIcon type="mi" name="home-work" />
                    <TextInput
                      value={`${address}`}
                      onChangeText={value => setAddress(value)}
                      style={styles.textInput}
                      placeholder="คอนโด/ตึก/หมู่บ้าน"
                    />
                  </View>
                  <Text style={{ color: '#123456', marginVertical: 5 }}>
                    * สำหรับประเภทนวดแผนไทย
                  </Text>
                </View>
              )}
              <Button
                title="ถัดไป"
                iconLeft
                // icon={
                //   <AntDesign
                //     name="bank"
                //     color="white"
                //     size={24}
                //     style={{ marginHorizontal: 15 }}
                //   />
                // }
                buttonStyle={{
                  backgroundColor: '#65A3E1',
                  marginTop: 20,
                  borderRadius: 25,
                  paddingHorizontal: 15,
                  height: 45,
                  borderWidth: 0.5,
                  marginBottom: 20,
                }}
                onPress={() => handleNextData()}
              />
            </View>
          </View>
        </ScrollView>
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

export default RegisterPartnerForm;
