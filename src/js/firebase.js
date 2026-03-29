/* ============================================
   BUILDORA — Firebase Authentication
   ============================================ */

import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqGhom9lQNzQ7M9Jn2Z7myjB7kCaMexeo",
    authDomain: "buildora-d2a04.firebaseapp.com",
    projectId: "buildora-d2a04",
    storageBucket: "buildora-d2a04.firebasestorage.app",
    messagingSenderId: "879594754068",
    appId: "1:879594754068:web:f22ac181f0e4a292405701",
    measurementId: "G-1BEJP01XRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- Auth Helper Functions ---

export async function loginWithEmail(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

export async function signupWithEmail(email, password, fullName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name
    await updateProfile(userCredential.user, { displayName: fullName });
    return userCredential.user;
}

export async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
}

export async function logout() {
    await signOut(auth);
    localStorage.removeItem('buildora_token');
    localStorage.removeItem('buildora_user');
}

export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

export async function getCurrentUserToken() {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
}

export { auth };
