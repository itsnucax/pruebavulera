import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABj0fld0oe4TTE1bGzoaRcCyw5sZAeXj0",
  authDomain: "easyconta-d5d20.firebaseapp.com",
  projectId: "easyconta-d5d20",
  storageBucket: "easyconta-d5d20.firebasestorage.app",
  messagingSenderId: "599569431255",
  appId: "1:599569431255:web:0d6f748e9c6234b95b8e92",
  measurementId: "G-9FSFJZ7X69"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);