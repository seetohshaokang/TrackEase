// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNnc3d11hwEFuXsnt6HspXDr0xRWEdD-Q",
  authDomain: "trackease-426009.firebaseapp.com",
  projectId: "trackease-426009",
  storageBucket: "trackease-426009.appspot.com",
  messagingSenderId: "782042170774",
  appId: "1:782042170774:web:88a88a48dcb2b16e0649b7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Intialise Firebase authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
