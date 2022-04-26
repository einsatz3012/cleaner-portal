import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


var firebaseConfig = {
    apiKey: "AIzaSyC3BCU_3v_kFnQp-lt60vvrU5fYlJnIm4Q",
    authDomain: "feedback-beb57.firebaseapp.com",
    databaseURL: "https://feedback-beb57.firebaseio.com",
    projectId: "feedback-beb57",
    storageBucket: "feedback-beb57.appspot.com",
    messagingSenderId: "211570371404",
    appId: "1:211570371404:web:f781b483e59e428bc4fde9",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseDB = getDatabase(firebaseApp);

export default firebaseDB;
