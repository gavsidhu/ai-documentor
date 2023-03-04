// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCxfFK-zNTx6OC0FaoEUT6r3pJ8tTY0liI',
  authDomain: 'ai-documentor.firebaseapp.com',
  projectId: 'ai-documentor',
  storageBucket: 'ai-documentor.appspot.com',
  messagingSenderId: '802146400229',
  appId: '1:802146400229:web:e75d506a6f666fbbfb210c',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth();

export { app, auth };
