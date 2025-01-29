import {
    initializeApp as initializeClientApp,
    getApps as getClientApps,
  } from 'firebase/app';
  import { getFirestore as getClientFirestore } from 'firebase/firestore';
  import { getStorage as getClientStorage } from 'firebase/storage';
  
  const firebaseConfig = {
    apiKey: import.meta.env['VITE_PUBLIC_FIREBASE_API_KEY'],
    authDomain: import.meta.env['VITE_PUBLIC_FIREBASE_AUTH_DOMAIN'],
    projectId: import.meta.env['VITE_PUBLIC_FIREBASE_PROJECT_ID'],
    storageBucket: import.meta.env['VITE_PUBLIC_FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: import.meta.env[
      'VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
    ],
    appId: import.meta.env['VITE_PUBLIC_FIREBASE_APP_ID'],
  };
  
  const initializeClientFirebase = () => {
      // Use Client SDK
      const clientApp =
        getClientApps().length === 0
          ? initializeClientApp(firebaseConfig)
          : getClientApps()[0];
    
      return {
        app: clientApp,
        db: getClientFirestore(clientApp),
        storage: getClientStorage(clientApp),
      };
    };
  
    export { initializeClientFirebase };