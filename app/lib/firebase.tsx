
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDID24KKg3NV7EBJO-RiTGN4io9ZmO9aNc",
  authDomain: "work-test-42329.firebaseapp.com",
  projectId: "work-test-42329",
  storageBucket: "work-test-42329.firebasestorage.app",
  messagingSenderId: "775548827842",
  appId: "1:775548827842:web:2c56c1a8b752bfdd11235b",
  measurementId: "G-QHNRP6ZYZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);





















