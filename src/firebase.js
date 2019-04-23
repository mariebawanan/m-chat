import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

import * as FIREBASE_CONFIG from './config';

const config = {
	apiKey: FIREBASE_CONFIG.API_KEY,
	authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
	databaseURL: FIREBASE_CONFIG.DATABASE_URL,
	projectId: FIREBASE_CONFIG.PROJECT_ID,
	storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
	messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID,
};
firebase.initializeApp(config);

export default firebase;
