import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
const winWidth = Dimensions.get('window').width;
const winHeight = Dimensions.get('window').height;

const Home = props => {
  const {navigation} = props;
  const [selectedTopic, setSelectedTopic] = useState('');
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

  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Araba topicine abone ol"
        onPress={() => handleSubscribe('araba')}
      />
      <Button
        title="Bisiklet topicine abone ol"
        onPress={() => handleSubscribe('bisiklet')}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Demo')}>
        <Text>Bildirim Sayfası</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
