import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiAIPCL2nqMSokdxnlOcVEuAtNXTk3AxQ",
  authDomain: "personaport-4b50a.firebaseapp.com",
  projectId: "personaport-4b50a",
  storageBucket: "personaport-4b50a.appspot.com",
  messagingSenderId: "484666172777",
  appId: "1:484666172777:web:fef3ed66fc11c1a69d09f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);
