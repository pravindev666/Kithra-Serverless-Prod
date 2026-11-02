/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA FIREBASE CLIENT AUTHENTICATION SERVICE
 * 
 * Client-side Firebase configuration and authentication methods for
 * consumer member sign-up, sign-in, token retrieval, and session lifecycle.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBldryZXPaSuXdzQ5bp4vTroInv8J3XUX8",
  authDomain: "kithra-d3ae1.firebaseapp.com",
  projectId: "kithra-d3ae1",
  storageBucket: "kithra-d3ae1.firebasestorage.app",
  messagingSenderId: "427750782405",
  appId: "1:427750782405:web:f82460a84171f8ba76c7ac",
  measurementId: "G-3PKJNEK6RW",
};

// Initialize or reuse existing Firebase app
export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(firebaseApp);

export interface AuthStateResult {
  user: User | null;
  idToken: string | null;
}

/**
 * Register a new member using email and password.
 */
export async function registerMemberWithFirebase(
  email: string,
  passwordPlain: string
): Promise<{ user: User; idToken: string }> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, passwordPlain);
  const user = userCredential.user;
  
  // Attempt to send email verification
  try {
    await sendEmailVerification(user);
  } catch {
    // Non-blocking in local development/staging
  }
  
  const idToken = await user.getIdToken(true);
  
  // Cache in session storage for local API requests
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem('kithra_firebase_id_token', idToken);
    window.sessionStorage.setItem('kithra_firebase_uid', user.uid);
  }
  
  return { user, idToken };
}

/**
 * Sign in an existing member using email and password.
 */
export async function loginMemberWithFirebase(
  email: string,
  passwordPlain: string
): Promise<{ user: User; idToken: string }> {
  const userCredential = await signInWithEmailAndPassword(auth, email, passwordPlain);
  const user = userCredential.user;
  const idToken = await user.getIdToken();
  
  // Cache in session storage for local API requests
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem('kithra_firebase_id_token', idToken);
    window.sessionStorage.setItem('kithra_firebase_uid', user.uid);
  }
  
  return { user, idToken };
}

/**
 * Signs out the current member and clears cached auth tokens.
 */
export async function logoutMemberFromFirebase(): Promise<void> {
  await signOut(auth);
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.removeItem('kithra_firebase_id_token');
    window.sessionStorage.removeItem('kithra_firebase_uid');
  }
}

/**
 * Dispatches a password reset email to the member's registered address.
 */
export async function resetPasswordWithFirebase(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Retrieves the current authenticated user's fresh ID token.
 */
export async function getAuthenticatedMemberIdToken(forceRefresh = false): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem('kithra_firebase_id_token');
    }
    return null;
  }
  return currentUser.getIdToken(forceRefresh);
}

/**
 * Subscribes to Firebase Auth state changes.
 */
export function subscribeToAuthState(
  onChanged: (result: AuthStateResult) => void
): () => void {
  return onAuthStateChanged(auth, async (user) => {
    let idToken: string | null = null;
    if (user) {
      try {
        idToken = await user.getIdToken();
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('kithra_firebase_id_token', idToken);
          window.sessionStorage.setItem('kithra_firebase_uid', user.uid);
        }
      } catch {
        idToken = null;
      }
    } else {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem('kithra_firebase_id_token');
        window.sessionStorage.removeItem('kithra_firebase_uid');
      }
    }
    onChanged({ user, idToken });
  });
}

