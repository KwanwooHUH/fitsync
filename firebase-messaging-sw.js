importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// 앱의 Firebase 설정 정보 동기화
firebase.initializeApp({
  apiKey:            "AIzaSyAmCrwZ1KToKdnHJky5OX3JyD88ZCrzTBE",
  authDomain:        "fitsync-9f15d.firebaseapp.com",
  projectId:         "fitsync-9f15d",
  storageBucket:     "fitsync-9f15d.firebasestorage.app",
  messagingSenderId: "696294571061",
  appId:             "1:696294571061:web:1beecc54a3734aefc1857c"
});

const messaging = firebase.messaging();

// 백그라운드 상태에서 알림 메시지를 수신했을 때의 처리 정의
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] 백그라운드 푸시 수신:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/fitsync/icons/icon-192x192.png' // 앱 아이콘 경로 설정
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});