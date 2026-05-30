importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyAmCrwZ1KToKdnHJky5OX3JyD88ZCrzTBE",
  authDomain:        "fitsync-9f15d.firebaseapp.com",
  projectId:         "fitsync-9f15d",
  storageBucket:     "fitsync-9f15d.firebasestorage.app",
  messagingSenderId: "696294571061",
  appId:             "1:696294571061:web:1beecc54a3734aefc1857c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'FITSYNC', {
    body:    body || '내일 PT 수업이 있습니다.',
    icon:    '/fitsync/icon-192.png',
    badge:   '/fitsync/icon-192.png',
    tag:     'fitsync-reminder',
    vibrate: [200, 100, 200],
    data:    'https://kwanwoohuh.github.io/fitsync/',
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data || 'https://kwanwoohuh.github.io/fitsync/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url === url && 'focus' in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});
