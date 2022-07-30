// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgoJOyoeFbGPQEpjDUaauVTgyvFLDSRJs",
  authDomain: "this-is-working.firebaseapp.com",
  projectId: "this-is-working",
  storageBucket: "this-is-working.appspot.com",
  messagingSenderId: "933417181714",
  appId: "1:933417181714:web:7c8e21e60907b70411eecb",
  measurementId: "G-1CFR6J0RPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);