// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAMRVZgWANDX3B0NPQCLjH1wkFm74eaBG0",
  authDomain: "proyecto-2026-1-g1-f2dfb.firebaseapp.com",
  projectId: "proyecto-2026-1-g1-f2dfb",
  storageBucket: "proyecto-2026-1-g1-f2dfb.firebasestorage.app",
  messagingSenderId: "283894782974",
  appId: "1:283894782974:web:81abcbee73133d86c47eaf",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);