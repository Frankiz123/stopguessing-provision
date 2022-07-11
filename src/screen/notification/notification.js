import PushNotification from 'react-native-push-notification';

export default class notification {
    //onNotificaitn is a function passed in that is to be called when a
    //notification is to be emitted.
  constructor(onNotification) {
    this.configure(onNotification);
    this.lastId = 0;
  }

  configure(onNotification) {
    PushNotification.configure({
      requestPermissions: Platform.OS === 'ios',
      onNotification: onNotification,
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      // requestPermissions: false,

      popInitialNotification: true,
    });
  }

    //Appears after a specified time. App does not have to be open.12 * 60 * 60 * 1000
  scheduleNotification() {
    this.lastId++;
    PushNotification.localNotificationSchedule({
      date: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000 )), //30 seconds
      title: "Message from Stop Guessing", 
      message: "Please scan your face",
      playSound: true, 
      soundName: 'default',         
    });
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelNotif() {
    PushNotification.cancelLocalNotifications({id: '' + this.lastId});
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }
}