import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

import * as FIREBASE_CONFIG from './firebaseConfig';

const config = {
  apiKey: FIREBASE_CONFIG.API_KEY,
  authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
  databaseURL: FIREBASE_CONFIG.DATABASE_URL,
  projectId: FIREBASE_CONFIG.PROJECT_ID,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID,
};
firebase.initializeApp(config);

const firebaseDB = firebase.database();
const firebaseUsers = firebaseDB.ref('users');
const firebaseGroupChats = firebaseDB.ref('groupChats');
const firebaseMessages = firebaseDB.ref('messages');
const firebaseStorage = firebase.storage().ref();
const firebaseUsersConnect = firebaseDB.ref('.info/connected');
const firebaseUserStatus = firebaseDB.ref('status');
const firebasePrivateMessages = firebaseDB.ref('privateMeesages');
const firebaseTypingUsers = firebaseDB.ref('typingUsers');

export {
  firebase,
  firebaseDB,
  firebaseUsers,
  firebaseGroupChats,
  firebaseMessages,
  firebaseStorage,
  firebaseUsersConnect,
  firebaseUserStatus,
  firebasePrivateMessages,
  firebaseTypingUsers,
};
