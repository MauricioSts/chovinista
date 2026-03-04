// Importar funções necessárias
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDeE3OueCxFpHtvEoWoV9Ov3M1LeTIo63w",
  authDomain: "chovinista-822a6.firebaseapp.com",
  projectId: "chovinista-822a6",
  storageBucket: "chovinista-822a6.firebasestorage.app",
  messagingSenderId: "722021977779",
  appId: "1:722021977779:web:47c759e19530abd35eaac6",
  measurementId: "G-K995W7ET2M",
};

// Inicializa o app, Firestore e Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
