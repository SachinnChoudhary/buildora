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

// Firebase configuration - loaded from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
    localStorage.removeItem('ba_token'); // Clean up old key if exists
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
