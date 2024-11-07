import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const winWidth = Dimensions.get('window').width;
const winHeight = Dimensions.get('window').height;

const Demo = props => {
  const {navigation} = props;
  const [notificationData, setNotificationData] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    // AsyncStorage'dan son bildirimi çek
    const loadLastNotification = async () => {
      const lastNotification = await AsyncStorage.getItem('lastNotification');
      if (lastNotification) {
        setNotificationData(JSON.parse(lastNotification)); // JSON parse ile nesneye dönüştür
      }
    };
    loadLastNotification();

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data) {
        const newNotificationData = {
          title: remoteMessage.data.title,
          desc: remoteMessage.data.desc,
        };
        setNotificationData(newNotificationData);

        // AsyncStorage'a bildirimi nesne olarak kaydet
        await AsyncStorage.setItem(
          'lastNotification',
          JSON.stringify(newNotificationData),
        );
      }
    });

    return () => unsubscribeOnMessage();
  }, []);

  // Topic'e abone olma fonksiyonu
  const handleSubscribe = async topic => {
    if (selectedTopic) {
      await messaging().unsubscribeFromTopic(selectedTopic);
    }
    try {
      await messaging().subscribeToTopic(topic);
      setSelectedTopic(topic); // Seçilen topic'i kaydet
      console.log(`Successfully subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic: ${error}`);
    }
  };

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (remoteMessage.data) {
      const newNotificationData = {
        title: remoteMessage.data.title,
        desc: remoteMessage.data.desc,
      };
      await AsyncStorage.setItem(
        'lastNotification',
        JSON.stringify(newNotificationData),
      );
    }
  });

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <Text style={styles.headerText}>HOME</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Bölümden Duyuru</Text>
        </View>
        <View style={styles.content}>
          {notificationData ? (
            <View>
              <Text style={styles.titleText}>{notificationData.title}</Text>
              <Text style={styles.descText}>{notificationData.desc}</Text>
            </View>
          ) : null}

          {selectedTopic ? (
            <Text style={styles.selectedTopicText}>
              Seçilen topic: {selectedTopic}
            </Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Demo;

const styles = StyleSheet.create({
  container: {
    width: winWidth,
    height: winHeight,
    alignItems: 'center',
  },
  header: {
    width: winWidth,
    height: winHeight * 0.075,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bb1e33',
  },
  headerText: {
    fontSize: winWidth * 0.035,
    fontWeight: '500',
    color: '#fff',
  },
  content: {
    width: winWidth * 0.9,
    height: winHeight * 0.88,
    paddingVertical: winWidth * 0.05,
  },
  titleText: {
    fontSize: winWidth * 0.045,
    fontWeight: '500',
  },
  descText: {
    fontSize: winWidth * 0.04,
    fontWeight: '400',
    marginTop: winWidth * 0.025,
  },
  selectedTopicText: {
    fontSize: winWidth * 0.04,
    marginTop: winWidth * 0.025,
    fontWeight: '400',
    color: '#555',
  },
});
