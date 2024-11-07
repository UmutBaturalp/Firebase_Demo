const admin = require('firebase-admin');

// Firebase Admin SDK ile Firebase'e bağlan
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Belirli bir topic'e bildirim gönder
async function sendNotificationToTopic(topic, message) {
  const messagePayload = {
    notification: {
      title: message.title,
      body: message.body,
      image: message.image,
    },
    data: {
      title: message.title,
      desc: message.body,
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

// Örnek kullanım: Topic'e bildirim gönderme
sendNotificationToTopic('araba', {
  title: 'Bilgiayar Sistem Lab. Dersi Alan Öğrencilerin Dikkatine',
  body: `Bilgisayar Sistem Lab. Dersinin Deneyleri I. ve II. Öğretim birlikte yapılacaktır. \n Deney 3: 11 Kasım pazartesi günü saat 14.15'te yapılacaktır.  Diğer deneylerde her pazartesi aynı saatte yapılacaktır.`,
  image:
    'https://i.elazigmavihaber.com/c/90/1280x720/s/dosya/haber/firat-universitesi-ogrencileri_1720707713_OMVxu4.webp',
});
