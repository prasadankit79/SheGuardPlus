import { initializeApp, getApps, getApp } from 'firebase/app';
// --- THIS IS THE FIX ---
// We will use 'browserLocalPersistence' which is available in the main 'auth' module.
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
// -----------------------
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// This is the new, more compatible way to initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

const db = getFirestore(app);

export { auth, db };