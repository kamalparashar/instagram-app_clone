import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfY9s9Px2uCfcTwutSTFJvfKxWSWEJ1sI",
  authDomain: "instagram-app-6a260.firebaseapp.com",
  projectId: "instagram-app-6a260",
  storageBucket: "instagram-app-6a260.appspot.com",
  messagingSenderId: "1041798983796",
  appId: "1:1041798983796:web:4213906e443c501ac26121"
};
                          
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();
                          
export {firebaseApp, db, storage};                          