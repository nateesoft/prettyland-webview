import uuid from 'react-native-uuid';
import Moment from 'moment';

import firebase from '../util/firebase';
import { getDocument } from '../util';
import { getBankName } from '../data/apis';
import { AppConfig } from '../Constants';

export const saveNewMember = (memberId, memberData) => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(getDocument(`members/${memberId}`))
      .set(memberData)
      .catch(err => {
        reject(err);
      });

    //send noti to admin
    getAllAdminNotification().then(listAdmin => {
      fetchExpoHosting({
        to: listAdmin,
        title: 'แจ้งเตือน',
        body: 'มีรายการรออนุมัติข้อมูล สำหรับสมาชิกใหม่',
      });
    });
    resolve(true);
  });
};

export const saveNewPosts = postData => {
  const newId = uuid.v4();
  const saveData = {
    id: newId,
    sys_create_date: new Date().toUTCString(),
    sys_update_date: new Date().toUTCString(),
    ...postData,
  };
  firebase
    .database()
    .ref(getDocument(`posts/${newId}`))
    .set(saveData);

  //send noti to all admin
  getAllAdminNotification().then(listAdmin => {
    fetchExpoHosting({
      to: listAdmin,
      title: 'แจ้งเตือน',
      body: 'มีรายการรออนุมัติข้อมูล',
    });
  });

  //send noti to all partner
  if (postData.partnerType !== 4) {
    getAllPartnerNotification().then(listPartner => {
      fetchExpoHosting({
        to: listPartner,
        title: 'แจ้งเตือน',
        body: 'มีโพสท์งานใหม่ในระบบ',
      });
    });
  }
};

export const updatePosts = (postId, data) => {
  firebase
    .database()
    .ref(getDocument(`posts/${postId}`))
    .update(data);
};

export const partnerAcceptJobWaitCustomerReview = (item, profile) => {
  const { id: postId } = item;

  // update post status
  updatePosts(postId, {
    status: AppConfig.PostsStatus.waitCustomerSelectPartner,
    statusText: 'รอลูกค้าเลือกน้องๆ',
    sys_update_date: new Date().toUTCString(),
  });

  // update partnerSelect
  const data = {
    partnerId: profile.id,
    partnerName: profile.name,
    amount: profile.amount,
    age: profile.age,
    image: profile.image || null,
    sex: profile.sex,
    character: profile.character,
    telephone: profile.mobile,
    selectStatus: AppConfig.PostsStatus.waitCustomerSelectPartner,
    selectStatusText: 'เสนอรับงาน',
    bankNo: profile.bankNo,
    bankCode: profile.bank,
    bankName: getBankName(profile.bank)[0].label,
    lineId: profile.lineId,
  };
  firebase
    .database()
    .ref(getDocument(`posts/${postId}/partnerSelect/${profile.id}`))
    .update(data);
};

export const getConfigList = () => {
  return new Promise((resolve, reject) => {
    const ref = firebase.database().ref(getDocument('appconfig'));
    ref.once('value', snapshot => {
      const dataItems = [];
      const appconfig = snapshot.val();
      dataItems.push({ ...appconfig.partner1 });
      dataItems.push({ ...appconfig.partner2 });
      dataItems.push({ ...appconfig.partner3 });
      dataItems.push({ ...appconfig.partner4 });
      resolve(dataItems);
    });
  });
};

export const savePaymentSlip = (dataPayment, item) => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(getDocument(`posts/${item.id}`))
      .update(dataPayment);

    resolve(true);
  });
};

export const adminConfirmNewPost = item => {
  return new Promise((resolve, reject) => {
    updatePosts(item.id, {
      status: AppConfig.PostsStatus.adminConfirmNewPost,
      statusText: 'อนุมัติโพสท์',
      sys_update_date: new Date().toUTCString(),
    });

    //send noti to customer
    getMemberProfile(item.customerId).then(customer => {
      fetchExpoHosting({
        to: customer.expo_token,
        title: 'แจ้งเตือน',
        body: 'รายการได้รับการอนุมัติแล้ว',
      });
    });

    resolve(true);
  });
};

export const getMemberProfile = userId => {
  return new Promise((resolve, reject) => {
    const ref = firebase.database().ref(getDocument(`members/${userId}`));
    ref.once('value', snapshot => {
      const data = { ...snapshot.val() };
      resolve(data);
    });
  });
};

export const adminSaveConfirmPayment = (item, listPartner) => {
  return new Promise((resolve, reject) => {
    // save to firebase
    firebase
      .database()
      .ref(getDocument(`posts/${item.id}`))
      .update({
        status: AppConfig.PostsStatus.adminConfirmPayment,
        statusText: 'ชำระเงินเรียบร้อยแล้ว',
        sys_update_date: new Date().toUTCString(),
      });

    //send noti to customer
    getMemberProfile(item.customerId).then(customer => {
      fetchExpoHosting({
        to: customer.expo_token,
        title: 'แจ้งเตือน',
        body: 'ข้อมูลการโอนเงินได้รับการอนุมัติแล้ว',
      });
    });

    // update status partner in list
    listPartner.forEach(obj => {
      firebase
        .database()
        .ref(getDocument(`posts/${item.id}/partnerSelect/${obj.partnerId}`))
        .update({
          selectStatus: AppConfig.PostsStatus.customerPayment,
          selectStatusText: 'ชำระเงินเรียบร้อยแล้ว',
          sys_update_date: new Date().toUTCString(),
        });
    });

    getMemberProfile(item.customerId).then(cust => {
      // update level to customer
      firebase
        .database()
        .ref(getDocument(`members/${item.customerId}`))
        .update({
          customerLevel: cust.customerLevel + 1,
        });
    });
    resolve(true);
  });
};

export const createMessageAlert = data => {
  const msg_id = uuid.v4();
  firebase
    .database()
    .ref(getDocument(`message_alert/${msg_id}`))
    .update({ ...data, sys_date: new Date().toUTCString() });
};

export const updateReadMessageAlert = (userId, msg_id) => {
  firebase
    .database()
    .ref(getDocument(`message_alert/${msg_id}/read/${uuid.v4()}`))
    .update({
      member_id: userId,
    });
};

// for admin notification api
export const getAdminDashboardType = type => {
  return new Promise((resolve, reject) => {
    const ref = firebase.database().ref(getDocument('message_alert'));
    ref.once('value', snapshot => {
      const data = snapshot.val();
      let count = 0;
      for (let key in data) {
        const obj = data[key];
        if (
          obj.show_admin === 'all' &&
          (obj.func_type === 'new_post' || obj.func_type === 'validate_slip') &&
          obj.show_dashboard_type === `${type}`
        ) {
          const arr = obj.read;
          for (let a in arr) {
            if (arr[a].member_id !== userId) {
              count = count + 1;
            }
          }
          if (!arr) {
            count = count + 1;
          }
        }
      }
      resolve(count);
    });
  });
};

// for partner notification api
export const getPartnerDashboardType1 = () => {
  return new Promise((resolve, reject) => {
    resolve(0);
  });
};
export const getPartnerDashboardType2 = () => {
  return new Promise((resolve, reject) => {
    resolve(0);
  });
};
export const getPartnerDashboardType3 = () => {
  return new Promise((resolve, reject) => {
    resolve(0);
  });
};
export const getPartnerDashboardType4 = () => {
  return new Promise((resolve, reject) => {
    resolve(0);
  });
};

// for notifaction alert
// iPhone12proMax=ExponentPushToken[HnkDpzOkj3U7O92pm948mR]
// iPhone7=ExponentPushToken[CIp5G5DMKGix23ggpwrxHx]
export const fetchExpoHosting = ({ to, title, body }) => {
  fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, title, body }),
  });
};

// export const registerForPushNotificationsAsync = async () => {
//   let token;
//   if (Constants.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// };

export const saveExponentPushToken = ({ userId, token, member_type }) => {
  firebase
    .database()
    .ref(getDocument(`notifications/${userId}`))
    .update({
      member_type: member_type,
      member_id: userId,
      expo_token: token,
      active: true,
    });

  // update member exists
  firebase
    .database()
    .ref(getDocument(`members/${userId}`))
    .update({
      expo_token: token,
    });
};

const existUserReadBroadcast = (data, userId) => {
  return new Promise((resolve, reject) => {
    for (let key in data) {
      if (key === userId) {
        return resolve(true);
      }
    }
    resolve(false);
  });
};

export const getModelDataList = (snapshot, userId) => {
  return new Promise((resolve, reject) => {
    const list = snapshot.val();
    const listModel = [];
    for (let key in list) {
      const obj = list[key];
      if (obj.status === 'active') {
        const list2 = obj.users;
        existUserReadBroadcast(list2, userId).then(res => {
          if (!res) {
            listModel.push(obj);
          }
        });
        if (!list2) {
          listModel.push(obj);
        }
      }
    }
    resolve(listModel);
  });
};

export const getAllPartnerNotification = () => {
  return new Promise((resolve, reject) => {
    const ref = firebase.database().ref(getDocument('notifications'));
    ref.once('value', snapshot => {
      const data = snapshot.val();
      const listPartner = [];
      for (let key in data) {
        const obj = data[key];
        if (obj.member_type === 'partner') {
          listPartner.push(obj.expo_token);
        }
      }
      resolve(listPartner);
    });
  });
};

export const getAllAdminNotification = () => {
  return new Promise((resolve, reject) => {
    const ref = firebase.database().ref(getDocument('notifications'));
    ref.once('value', snapshot => {
      const data = snapshot.val();
      const listAdmin = [];
      for (let key in data) {
        const obj = data[key];
        if (obj.member_type === 'admin' || obj.member_type === 'superadmin') {
          listAdmin.push(obj.expo_token);
        }
      }
      resolve(listAdmin);
    });
  });
};

export const checkToSendAllBroadcastToAllUser = snaphost => {
  return new Promise((resolve, reject) => {
    const broadcastList = { ...snaphost.val() };
    for (let key in broadcastList) {
      const obj = broadcastList[key];

      // date information
      const currentDate = Moment();
      const dateStart = Moment(obj.date_start, 'DD/MM/YYYY');
      const dateFinish = Moment(obj.date_finish, 'DD/MM/YYYY');
      const validDate = currentDate.isBetween(dateStart, dateFinish);

      // time information
      const currentTime = Moment();
      const startTime = Moment(obj.time_send, 'HH:mm');
      const finishTime = Moment('23:59', 'HH:mm');
      const validTime = currentTime.isBetween(startTime, finishTime);

      if (validDate && validTime) {
        //send noti to all users
        getAllMemberNotification().then(listMembers => {
          fetchExpoHosting({
            to: listMembers,
            title: 'แจ้งเตือน',
            body: 'มีรายการรออนุมัติข้อมูล',
          });
        });
        resolve(true);
      } else {
        resolve(false);
      }
    }
  });
};

export const getAllMemberNotification = () => {
  return new Promise((resolve, reject) => {
    const ref = firebase.database().ref(getDocument('notifications'));
    ref.once('value', snapshot => {
      const data = snapshot.val();
      const listUsers = [];
      for (let key in data) {
        const obj = data[key];
        listUsers.push(obj.expo_token);
      }
      resolve(listUsers);
    });
  });
};

export const updateWorkingStatus = (userId, isEnabled) => {
  firebase
    .database()
    .ref(getDocument(`members/${userId}`))
    .update({
      work_status: isEnabled ? 'working' : 'available',
    });
};
