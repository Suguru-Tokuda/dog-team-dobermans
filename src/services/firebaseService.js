import firebase from 'firebase/app';
import 'firebase/storage';
import * as api from '../api.json';

const firebaseConfig = {
  apiKey: api.firebaseConfigParams.apiKey,
  authDomain: api.firebaseConfigParams.authDomain,
  databaseURL: api.firebaseConfigParams.databaseURL,
  projectId: api.firebaseConfigParams.projectId,
  storageBucket: api.firebaseConfigParams.storageBucket,
  messagingSenderId: api.firebaseConfigParams.messagingSenderId,
  appId: api.firebaseConfigParams.appId
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export {
    storage, firebase as default
};