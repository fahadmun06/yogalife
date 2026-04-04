// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";
// import { getAnalytics } from "firebase/analytics"; // careful: only works in browser
const API_KEY = "AIzaSyCUOWAFCuUbr6fAq4JPfMVMENUXmPQPDaQ";
const AUTH_DOMAIN = "tina-746c3.firebaseapp.com";
const PROJECT_ID = "tina-746c3";
const STORAGE_BUCKET = "tina-746c3.firebasestorage.app";
const MESSAGING_SENDER_ID = "116826675055";
const APP_ID = "1:116826675055:web:f27d17aaceee229b73ba9a";
const MEASUREMENT_ID = "G-SNCGB1NGYT";
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

// ✅ Avoid re-initializing Firebase during hot reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

// ✅ Analytics only in browser (avoids "window is not defined")
let analytics;

if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

// ✅ Messaging instance
let messaging;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export { app, auth, storage, db, analytics, messaging };
