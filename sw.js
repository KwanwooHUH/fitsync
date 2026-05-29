// FITSYNC Service Worker
const CACHE_NAME = 'fitsync-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// 푸시 알림 수신
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title   = data.title   || 'FITSYNC';
  const options = {
    body:    data.body    || '내일 PT 수업이 있습니다.',
    icon:    data.icon    || '/fitsync/icon-192.png',
    badge:   data.badge   || '/fitsync/icon-192.png',
    tag:     data.tag     || 'fitsync-reminder',
    data:    data.url     || 'https://kwanwoohuh.github.io/fitsync/',
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open',   title: '앱 열기' },
      { action: 'close',  title: '닫기'    },
    ],
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// 알림 클릭 처리
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'close') return;
  const url = e.notification.data || 'https://kwanwoohuh.github.io/fitsync/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url === url && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
