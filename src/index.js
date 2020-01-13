import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

// var firebaseConfig = {
//     apiKey: "AIzaSyDmreyiKM0KurAqflojYXtfcNym0GzPm3s",
//     authDomain: "phc3-d948d.firebaseapp.com",
//     databaseURL: "https://phc3-d948d.firebaseio.com",
//     projectId: "phc3-d948d",
//     storageBucket: "phc3-d948d.appspot.com",
//     messagingSenderId: "917669295920",
//     appId: "1:917669295920:web:83f30e475c875e74677af5",
//     measurementId: "G-SDCT6LZYE7"
//   };
// firebase.initializeApp(firebaseConfig);
//   firebase.analytics(); 

var firebaseConfig = {
  apiKey: "AIzaSyC3BCU_3v_kFnQp-lt60vvrU5fYlJnIm4Q",
  authDomain: "feedback-beb57.firebaseapp.com",
  databaseURL: "https://feedback-beb57.firebaseio.com",
  projectId: "feedback-beb57",
  storageBucket: "feedback-beb57.appspot.com",
  messagingSenderId: "211570371404",
  appId: "1:211570371404:web:f781b483e59e428bc4fde9"

};
firebase.initializeApp(firebaseConfig);
// firebase.analytics(); 


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

serviceWorker.register();


