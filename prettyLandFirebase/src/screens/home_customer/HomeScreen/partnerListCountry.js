import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';

import { getCountryList } from '../../../data/apis';

const PartnerListCountryScreen = ({ navigation, route }) => {
  const { item: data } = route.params;
  return (
    <View style={styles.cardDetail}>
      <Text style={styles.optionsNameDetail}>{data.title}</Text>
      <Image style={styles.optionsPhoto} source={data.img} />
      <Text style={styles.optionsInfo}>{data.info}</Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignContent: 'stretch',
          width: '100%',
        }}>
        <Text style={styles.headingText}>ค้นหาจังหวัด</Text>
        <SearchableDropdown
          onItemSelect={item => alert(JSON.stringify(item))}
          containerStyle={{ padding: 5 }}
          textInputStyle={{
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#FAF7F6',
          }}
          itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: '#FAF9F8',
            borderColor: '#bbb',
            borderWidth: 1,
          }}
          itemTextStyle={{
            color: '#222',
          }}
          itemsContainerStyle={{
            maxHeight: '60%',
          }}
          items={getCountryList}
          defaultIndex={2}
          placeholder="--------- เลือกจังหวัด ---------"
          resetValue={false}
          underlineColorAndroid="transparent"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardDetail: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    margin: 10,
  },
  optionsInfo: {
    marginTop: 3,
    marginBottom: 5,
    fontSize: 15,
  },
  optionsNameDetail: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
    marginBottom: 15,
    marginTop: 10,
  },
  optionsPhoto: {
    width: 350,
    height: 150,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },
  categoriesItemContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    justifyContent: 'center',
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 10,
    width: 350,
  },
  categoriesName: {
    fontSize: 16,
    color: 'blue',
  },
});

export default PartnerListCountryScreen;
