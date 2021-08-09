import * as master from './master_data';
import { provinces } from './province';
import { districts } from './district';
import { banks } from './bank';

import { AppConfig } from '../Constants';

export const getPartnerGroupByType = member => {
  if (member.memberType === 'partner') {
    const typeList = [];
    if (member.type1) {
      typeList.push(AppConfig.PartnerType.type1);
    }
    if (member.type2) {
      typeList.push(AppConfig.PartnerType.type2);
    }
    if (member.type3) {
      typeList.push(AppConfig.PartnerType.type3);
    }
    if (member.type4) {
      typeList.push(AppConfig.PartnerType.type4);
    }
    return typeList.toString();
  }

  return member.memberType;
};

export const getCountryList = () => {
  return provinces.sort();
};

export const getCountry = () => {
  return provinces;
};

export const getMemberCategory = () => {
  return master.memberGroup;
};

export const getPostStatus = () => {
  return master.postStatus;
};

export const getBankList = () => {
  return banks;
};

export const getDistrictList = PROVINCE_ID => {
  return districts.filter((item, index) => item.PROVINCE_ID === PROVINCE_ID);
};

export const getProvinceName = provinceIndex => {
  return provinces
    .filter(function (obj) {
      return obj.id === provinceIndex;
    })
    .map(function (obj) {
      return obj.label;
    });
};

export const getDistrictName = districtIndex => {
  return districts
    .filter(function (obj) {
      return obj.value === districtIndex;
    })
    .map(function (obj) {
      return obj.label;
    });
};

export const getBankName = bankId => {
  return banks.filter((item, index) => item.value === bankId);
};
