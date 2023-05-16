import { initializeApp, getApps } from "firebase/app";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, Functions } from "firebase/functions";
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from "firebase/firestore/lite";
import {
  getStorage,
  connectStorageEmulator,
  FirebaseStorage,
} from "firebase/storage";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

let auth: Auth;
let firestore: Firestore;
let functions: Functions;
let storage: FirebaseStorage;

const apps = getApps();
const appInitialised = apps.length;

const initFirebaseApp = () => initializeApp(config);

if (!appInitialised) {
  const app = initFirebaseApp();

  auth = getAuth(app);
  firestore = getFirestore(app);
  functions = getFunctions(app, "europe-west2");
  storage = getStorage(app);

  if (process.env.NODE_ENV === "development") {
    connectAuthEmulator(auth, "http://127.0.0.1:9099/");
    connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
  }
}

export { firestore, functions, auth, storage };
