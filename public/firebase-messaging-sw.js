importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyCUOWAFCuUbr6fAq4JPfMVMENUXmPQPDaQ",
  authDomain: "tina-746c3.firebaseapp.com",
  projectId: "tina-746c3",
  storageBucket: "tina-746c3.firebasestorage.app",
  messagingSenderId: "116826675055",
  appId: "1:116826675055:web:f27d17aaceee229b73ba9a",
  measurementId: "G-SNCGB1NGYT",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.icon || "/apple-icon.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
