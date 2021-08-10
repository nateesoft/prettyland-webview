import React, { useState } from 'react';
import {
  View,
  ImageBackground,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Button, Text } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
// import { MaterialCommunityIcons } from 'react-native-vector-icons';

import { getCountryList, getProvinceName } from '../../../data/apis';
import { AppConfig } from '../../../Constants';

const SelectProvince = props => {
  const { navigation, route } = props;
  const { profile, item, userId } = route.params;

  const [partnerRequest, setPartnerRequest] = useState(item.name);
  const [openSelectCountry, setOpenSelectCountry] = useState(false);
  const [province, setProvince] = useState('');
  const [countryList, setCountryList] = useState(getCountryList());

  const nextStep = () => {
    if (!province) {
      Alert.alert('แจ้งเตือน', 'กรุณาระบุ จังหวัด', { props });
      return;
    }
    navigation.navigate('All-Customer-Post-List', {
      profile,
      province,
      provinceName: getProvinceName(province),
      userId,
      partnerRequest,
    });
  };

  return (
    <ImageBackground
      source={AppConfig.bgImage}
      style={styles.imageBg}
      resizeMode="contain">
      <SafeAreaView style={{ flex: 1, height: '100%' }}>
        <View style={styles.cardDetail}>
          <Text style={[styles.optionsNameDetail, { marginBottom: 10 }]}>
            เลือกจังหวัด
          </Text>
          <Text> โหมดงาน: {partnerRequest}</Text>
          <DropDownPicker
            placeholder="-- เลือกจังหวัด --"
            open={openSelectCountry}
            setOpen={setOpenSelectCountry}
            value={province}
            setValue={setProvince}
            items={countryList}
            setItems={setCountryList}
            style={styles.dropdownStyle}
            textStyle={{ fontSize: 18 }}
            zIndex={2}
            searchable={false}
            selectedItemContainerStyle={{ backgroundColor: '#facaff' }}
            listMode="SCROLLVIEW"
          />
          <View style={styles.buttonFooter}>
            <Button
              // icon={
              //   <MaterialCommunityIcons
              //     name="page-next-outline"
              //     size={20}
              //     color="white"
              //     style={{ marginHorizontal: 8 }}
              //   />
              // }
              iconLeft
              buttonStyle={{
                backgroundColor: '#ff2fe6',
                marginTop: 20,
                borderRadius: 5,
                width: 250,
                paddingHorizontal: 15,
                height: 45,
                borderWidth: 0.5,
              }}
              title="ถัดไป"
              onPress={() => nextStep()}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardDetail: {
    alignItems: 'center',
    padding: 5,
  },
  optionsNameDetail: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
    marginTop: 10,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    margin: 10,
  },
  dropdownStyle: {
    marginBottom: 10,
    borderColor: '#ff2fe6',
    borderWidth: 1.5,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  buttonFooter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  textInput: {
    backgroundColor: 'white',
    width: 350,
    fontSize: 16,
    marginVertical: 5,
    marginLeft: 15,
  },
  formControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    borderColor: '#00716F',
    backgroundColor: 'white',
    marginTop: 5,
    height: 50,
    borderRadius: 10,
  },
});

export default SelectProvince;
