import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyL_aadGzyozNjU6QKoRgHjJ_jxlwWJxU",
  authDomain: "maple-educators-app.firebaseapp.com",
  projectId: "maple-educators-app",
  storageBucket: "maple-educators-app.firebasestorage.app",
  messagingSenderId: "782200920015",
  appId: "1:782200920015:web:7c87d1cb8868e7e02024ba",
  measurementId: "G-E4TB3CLH62",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
