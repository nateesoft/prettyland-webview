import Moment from 'moment';

import { AppConfig } from '../Constants';

export const snapshotToArray = snapshot => {
  const returnArr = [];
  snapshot.forEach(childSnapshot => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;

    returnArr.push(item);
  });

  return returnArr;
};

export const snapshotToArrayProvinceGroup = snapshot => {
  const returnArr = [];
  snapshot.forEach(childSnapshot => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

export const getDiffHours = fromDate => {
  const date1 = Moment();
  const date2 = Moment(fromDate);

  const diffHours = date1.diff(date2, 'hours');
  return diffHours;
};

export const getDocument = tableName => {
  const path = AppConfig.env ? `${AppConfig.env}/` : '';
  return `${path}${tableName}`;
};
