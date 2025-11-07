import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBylcv1SiZLujKAS7vfkhyY-jx75vIHSsM",
  authDomain: "webg2-2025-2.firebaseapp.com",
  projectId: "webg2-2025-2",
  storageBucket: "webg2-2025-2.firebasestorage.app",
  messagingSenderId: "61296509279",
  appId: "1:61296509279:web:7f3f0c92e1ce407bb3f6ea"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
export default db;