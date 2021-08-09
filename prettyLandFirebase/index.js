/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';

PushNotification.configure({
  onRegister: function (token) {
    //ios=4ed315e1b7492ae616607ae9f9f06894a6de16c789b793fbb3414d0757c6346c
    console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
  },
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

PushNotification.getChannels(function (channel_ids) {
  console.log(channel_ids);
});

PushNotification.channelExists('prettyland-message', function (exists) {
  console.log('prettyland-message is exists:', exists); // true/false
});

PushNotification.createChannel(
  {
    channelId: 'prettyland-message',
    channelName: 'My pretty-land channel',
    channelDescription: 'A channel to categorise your notifications',
    playSound: false,
    soundName: 'default',
    importance: Importance.HIGH,
    vibrate: true,
  },
  created => console.log(`createChannel returned '${created}'`),
);

AppRegistry.registerComponent(appName, () => App);
