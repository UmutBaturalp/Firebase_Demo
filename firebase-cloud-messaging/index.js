const admin = require('firebase-admin');

// Firebase Admin SDK ile Firebase'e bağlan
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

// Belirli bir kullanıcıya bildirim gönder
async function sendNotificationToUser(tokenList, message) {
  const messagePayload = {
    notification: {
      title: message.title,
      body: message.body,
    },
    tokens: tokenList,
  };

  try {
    const response = await admin.messaging().sendMulticast(messagePayload);
    console.log('Bildirim gönderildi:', response);
  } catch (error) {
    console.log('Bildirim gönderilemedi:', error);
  }
}

// Belirli bir topic'e bildirim gönder
async function sendNotificationToTopic(topic, message) {
  const messagePayload = {
    notification: {
      title: message.title,
      body: message.body,
    },
    topic: topic,
  };

  try {
    const response = await admin.messaging().send(messagePayload);
    console.log("Topic'e bildirim gönderildi:", response);
  } catch (error) {
    console.log('Bildirim gönderilemedi:', error);
  }
}

// Firestore’dan bir kullanıcının tokenlarını al
async function getUserTokens(userId) {
  const userDoc = await firestore.collection('users').doc(userId).get();
  if (userDoc.exists) {
    return userDoc.data().fcmTokens || [];
  }
  return [];
}

// Örnek kullanım: Kullanıcıya bildirim gönderme
getUserTokens('user_unique_id').then(tokens => {
  sendNotificationToUser(tokens, {
    title: 'Merhaba!',
    body: 'Bu kullanıcıya özel bir bildirim.',
  });
});

// Örnek kullanım: Topic'e bildirim gönderme
sendNotificationToTopic('araba', {
  title: 'Araba Haberleri',
  body: 'Yeni araba modelleri piyasaya çıktı!',
});
