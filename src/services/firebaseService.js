import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAECZwk3f30Nd3kcViscEEADiWW01VI9xs",
    authDomain: "dogteamdobermans.firebaseapp.com",
    databaseURL: "https://dogteamdobermans.firebaseio.com",
    projectId: "dogteamdobermans",
    storageBucket: "dogteamdobermans.appspot.com",
    messagingSenderId: "765501116399",
    appId: "1:765501116399:web:051a040ec68acc1b51f01a"
  };

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export {
    storage, firebase as default
};