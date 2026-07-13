import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCa7YLhvt7uXzwooTcHkCIKPob5PXC8qY4",
  authDomain: "ilmai-34684.firebaseapp.com",
  projectId: "ilmai-34684",
  storageBucket: "ilmai-34684.firebasestorage.app",
  messagingSenderId: "321340615024",
  appId: "1:321340615024:web:5cacad11f60187a80947b5",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const ADMIN_EMAIL = "habbanaptech3y@gmail.com";
export { app, auth, db, storage };
