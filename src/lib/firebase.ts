import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyALk97npFS6n5Mv5JxcyzMsqZDq-dqMEpg",
  authDomain: "proyectopaginaweb-88e83.firebaseapp.com",
  projectId: "proyectopaginaweb-88e83",
  storageBucket: "proyectopaginaweb-88e83.firebasestorage.app",
  messagingSenderId: "155467723131",
  appId: "1:155467723131:web:99eea4de7826a245c6cdde"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
