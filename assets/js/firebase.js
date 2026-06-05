import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCfCCCZQz-fzNR6aSM85fHjJOeOdqrHDzM",
    authDomain: "testauth-b380f.firebaseapp.com",
    projectId: "testauth-b380f",
    storageBucket: "testauth-b380f.firebasestorage.app",
    messagingSenderId: "278543117601",
    appId: "1:278543117601:web:2b506250221f0c74f42260"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);