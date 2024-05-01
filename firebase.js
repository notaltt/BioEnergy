// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrZa6HmqUJzAzH-D6LMeEYXKYfyHQz61A",
  authDomain: "thesis-b6546.firebaseapp.com",
  projectId: "thesis-b6546",
  storageBucket: "thesis-b6546.appspot.com",
  messagingSenderId: "556642827591",
  appId: "1:556642827591:web:aaff29da51680eb352e062"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };