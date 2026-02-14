import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { ErrorService } from './errorService';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];

let app;
let auth;
let firestore;
let functions;
let initError;

const hasConfig = () => requiredConfigKeys.every((key) => Boolean(firebaseConfig[key]));

const FirebaseService = {
  isConfigured() {
    return hasConfig();
  },

  initialize() {
    if (!hasConfig()) return false;
    if (app) return true;

    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      firestore = getFirestore(app);

      const region = process.env.REACT_APP_FIREBASE_FUNCTIONS_REGION || 'us-central1';
      functions = getFunctions(app, region);
      return true;
    } catch (error) {
      initError = error;
      ErrorService.log(error, 'backend_validation');
      return false;
    }
  },

  async ensureAnonymousAuth() {
    if (!this.initialize() || !auth) return null;

    if (auth.currentUser) return auth.currentUser;

    try {
      const credential = await signInAnonymously(auth);
      return credential.user;
    } catch (error) {
      ErrorService.log(error, 'backend_validation');
      return null;
    }
  },

  getAuth() {
    return auth || null;
  },

  getFirestore() {
    return firestore || null;
  },

  getFunctions() {
    return functions || null;
  },

  getInitError() {
    return initError || null;
  }
};

export { FirebaseService };
