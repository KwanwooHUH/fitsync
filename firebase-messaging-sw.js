importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAmCrwZ1KToKdnHJky5OX3JyD88ZCrzTBE",
    authDomain: "fitsync-9f15d.firebaseapp.com",
    projectId: "fitsync-9f15d",
    storageBucket: "fitsync-9f15d.firebasestorage.app",
    messagingSenderId: "696294571061",
    appId: "1:696294571061:web:1beecc54a3734aefc1857c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/fitsync/icons/icon-192x192.png'
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});