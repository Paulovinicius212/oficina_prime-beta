// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFDRQyJkgiFzU3VklL5vD5rd3fyEwXtss",
  authDomain: "oficina-prime.firebaseapp.com",
  projectId: "oficina-prime",
  storageBucket: "oficina-prime.appspot.com",
  messagingSenderId: "89532398907",
  appId: "1:89532398907:web:9d5dcfddabb218b54c8b1e",
  measurementId: "G-5YFXE9FRSL",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
    console.log("Firebase Analytics inicializado com sucesso!");
  } else {
    console.warn("Firebase Analytics não é suportado neste ambiente.");
  }
});
