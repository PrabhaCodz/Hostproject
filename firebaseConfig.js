// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxsbtAvLzEWYNDlG4DDP1F78QmNkM6nE4",
  authDomain: "ai-dectector.firebaseapp.com",
  projectId: "ai-dectector",
  storageBucket: "ai-dectector.firebasestorage.app",
  messagingSenderId: "615036584977",
  appId: "1:615036584977:web:83d4bfb804cb2e90e75db0",
  measurementId: "G-NEZQ5DGQMF"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;