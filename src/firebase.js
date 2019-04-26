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

export { firebase, firebaseDB, firebaseUsers, firebaseGroupChats };
