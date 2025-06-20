import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize Firebase
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBDxWaOapX03TXYUWDrxlJ3caiApknK3o0",
  authDomain: "beekeeping-8f7e6.firebaseapp.com",
  projectId: "beekeeping-8f7e6",
  storageBucket: "beekeeping-8f7e6.appspot.com",
  messagingSenderId: "43486883566",
  appId: "1:43486883566:web:b512c45d93113b91548dff",
  measurementId: "G-SZ0PL1ERZG"
};

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);