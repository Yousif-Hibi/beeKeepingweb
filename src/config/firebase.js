import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBDxWaOapX03TXYUWDrxlJ3caiApknK3o0",
  authDomain: "beekeeping-8f7e6.firebaseapp.com",
  projectId: "beekeeping-8f7e6",
  storageBucket: "beekeeping-8f7e6.appspot.com",
  messagingSenderId: "43486883566",
  appId: "1:43486883566:web:b512c45d93113b91548dff",
  measurementId: "G-SZ0PL1ERZG",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };


