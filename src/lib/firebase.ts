import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0053797401",
  appId: "1:961928309218:web:d1ce7a956064a211d931bb",
  apiKey: "AIzaSyByEwCngCGioCfW-hNFjUqXlnvTQFJaFFs",
  authDomain: "gen-lang-client-0053797401.firebaseapp.com",
  storageBucket: "gen-lang-client-0053797401.firebasestorage.app",
  messagingSenderId: "961928309218",
  measurementId: "",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-observatrioedies-4317d0da-882f-46c0-8764-45adb1db20a4");
export const storage = getStorage(app);
export const auth = getAuth(app);
