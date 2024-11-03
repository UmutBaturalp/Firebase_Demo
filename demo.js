import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

const demo = () => {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('TOKEN = ', token);
  };
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification:', remoteMessage);
    // Uygulama ön planda ise bildirim gösterimi burada yapılabilir
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background notification:', remoteMessage);
    // Arka planda gelen bildirimleri işlemek için bu metodu kullanın
  });
  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  return (
    <View>
      <Text>demo</Text>
    </View>
  );
};

export default demo;

const styles = StyleSheet.create({});
