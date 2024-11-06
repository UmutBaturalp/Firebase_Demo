import {StyleSheet, Text, View, Alert, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

const Demo = () => {
  const [notificationData, setNotificationData] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  // Kullanıcıdan bildirim izni iste
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  // Token'ı Firestore'a kaydet
  const saveTokenToDatabase = async token => {
    const userId = 'user_unique_id'; // Kullanıcı kimliğinizi dinamik hale getirin

    // Firestore'da 'users' koleksiyonunda kullanıcı için token kaydediyoruz
    await firestore()
      .collection('users')
      .doc(userId)
      .set(
        {
          fcmTokens: firestore.FieldValue.arrayUnion(token), // Yeni token'ı diziye ekleyin
        },
        {merge: true}, // Mevcut veriyi koruyarak güncellemeye izin verin
      );
    console.log('FCM token başarıyla kaydedildi:', token);
  };

  // Cihazın FCM tokenini al ve Firebase'e kaydet
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM TOKEN:', token);
    if (token) {
      await saveTokenToDatabase(token);
    }
  };

  // Bir topic’e abone ol
  const subscribeToTopic = async topic => {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Kullanıcı ${topic} topicine abone oldu`);
      setSelectedTopic(topic);
    } catch (error) {
      console.error('Topic abone olma hatası:', error);
    }
  };

  // Topic seçim fonksiyonu
  const selectTopic = async newTopic => {
    if (selectedTopic) {
      await messaging().unsubscribeFromTopic(selectedTopic);
    }
    subscribeToTopic(newTopic);
  };

  useEffect(() => {
    requestUserPermission();
    getToken();

    // Token yenilendiğinde kaydet
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token); // Yeni token'ı Firestore'a kaydet
    });

    // Ön planda bildirim dinleyicisi
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Ön planda bildirim:', remoteMessage);
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );
    });

    // Uygulama kapalı iken gelen bildirimler
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Kapalı durumda gelen bildirim:', remoteMessage);
          Alert.alert(
            remoteMessage.notification.title,
            remoteMessage.notification.body,
          );
          if (remoteMessage.data) {
            setNotificationData(JSON.stringify(remoteMessage.data.title));
          }
        }
      });

    // Uygulama arka planda iken gelen bildirimler
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Arka planda gelen bildirim:', remoteMessage);
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );

      if (remoteMessage.data) {
        setNotificationData(JSON.stringify(remoteMessage.data));
      }
    });

    // Arka plan mesajlarını işlemek için background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Arka planda gelen bildirim:', remoteMessage);
    });

    // Abonelikleri temizle
    return () => {
      unsubscribeOnMessage();
      unsubscribeTokenRefresh();
    };
  }, []);

  console.log('Seçili topic:', selectedTopic);
  return (
    <View style={styles.container}>
      <Text>Demo Bildirim Uygulaması</Text>
      {notificationData ? (
        <Text>Gelen Data: {notificationData}</Text>
      ) : (
        <Text>Henüz bir bildirim almadınız.</Text>
      )}
      <Text>Kullanıcı {selectedTopic} topicine abone oldu</Text>
      <Button
        title="Araba topicine abone ol"
        onPress={() => {
          setSelectedTopic('araba');
          selectTopic('araba');
        }}
      />
      <Button
        title="Bisiklet topicine abone ol"
        onPress={() => {
          setSelectedTopic('bisiklet');
          selectTopic('bisiklet');
        }}
      />
    </View>
  );
};

export default Demo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
