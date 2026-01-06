/**
 * Modern Firebase v9 Configuration
 * 
 * Uses modular SDK instead of compat mode
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const config = {
  apiKey: "AIzaSyCT-YNVbhvxt2UNttu36HZQvo3k2bgl3JY",
  authDomain: "bridgechampions.firebaseapp.com",
  databaseURL: "https://bridgechampions.firebaseio.com",
  projectId: "bridgechampions",
  storageBucket: "bridgechampions.appspot.com",
  messagingSenderId: "562622614107",
};

// Initialize Firebase
const app = initializeApp(config);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;




