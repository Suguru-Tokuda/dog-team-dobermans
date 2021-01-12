import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import * as api from '../api.json';

const isProd = window.location.toString().indexOf('https://dogteamdobermans.com/') !== -1;

console.log('production', isProd);

let apiParams;

if (isProd === true) {
  apiParams = api.production;
} else {
  apiParams = api.dev;
}

const firebaseConfig = {
  apiKey: apiParams.firebaseConfigParams.apiKey,
  authDomain: apiParams.firebaseConfigParams.authDomain,
  databaseURL: apiParams.firebaseConfigParams.databaseURL,
  projectId: apiParams.firebaseConfigParams.projectId,
  storageBucket: apiParams.firebaseConfigParams.storageBucket,
  messagingSenderId: apiParams.firebaseConfigParams.messagingSenderId,
  appId: apiParams.firebaseConfigParams.appId
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const provider = new firebase.auth.FacebookAuthProvider();


export {
    storage, 
    provider,
    firebase as default
};