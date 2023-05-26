import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAv-wTb5VSfTs5SHLyu6W8RrExeS6Co0lw",
  authDomain: "tweetapp-87d13.firebaseapp.com",
  projectId: "tweetapp-87d13",
  storageBucket: "tweetapp-87d13.appspot.com",
  messagingSenderId: "635164137067",
  appId: "1:635164137067:web:d1cc335f48f46a6b80032e",
  measurementId: "G-VRYEXYL4VG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {app,auth}
