// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // careful: only works in browser
const API_KEY = "AIzaSyCVhdzSLOQoQjHzlauWBZqBWMymHed-Y44";
const AUTH_DOMAIN = "yoga-3d345.firebaseapp.com";
const PROJECT_ID = "yoga-3d345";
const STORAGE_BUCKET = "yoga-3d345.firebasestorage.app";
const MESSAGING_SENDER_ID = "362250004867";
const APP_ID = "1:362250004867:web:4f47347b33c8baf32eeeb6";
const MEASUREMENT_ID = "G-4894YS69VV";
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

export { app, auth, storage, db, analytics };
