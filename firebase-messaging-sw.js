// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDe_cjESaihQoGiabRoLOZTmj6JrZVB9NY",
  authDomain: "arcastra-eba62.firebaseapp.com",
  projectId: "arcastra-eba62",
  storageBucket: "arcastra-eba62.firebasestorage.app",
  messagingSenderId: "547925747222",
  appId: "1:547925747222:web:01a6b875fe14624d777737"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title || 'Arc Astra';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new notification',
    icon: '/assets/logo.png',
    badge: '/assets/badge.png',
    tag: payload.data?.sessionId || 'default',
    requireInteraction: true,
    data: payload.data,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'claim',
        title: 'Claim Now',
        icon: '/assets/claim-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/close-icon.png'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  if (event.action === 'claim') {
    // Open app and navigate to mining page
    event.waitUntil(
      clients.openWindow('/?claim=' + event.notification.tag)
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default click - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
