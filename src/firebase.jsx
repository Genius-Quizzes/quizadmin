// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Your Firebase config (replace with your actual config from Firebase console)
const firebaseConfig = {
    apiKey: "AIzaSyDBL4aKnDQ47c7n3D8BesxOUg5DfBBeJY8",
    authDomain: "my-cool-quiz.firebaseapp.com",
    projectId: "my-cool-quiz",
    storageBucket: "my-cool-quiz.firebasestorage.app",
    messagingSenderId: "267732359628",
    appId: "1:267732359628:web:8bfd8f9814612832c4a569"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
