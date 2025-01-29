import {
  initializeApp as initializeAdminApp,
  getApps as getAdminApps,
  cert,
} from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getStorage as getAdminStorage } from 'firebase-admin/storage';

interface InitializeOptions {
  credential: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  };
}

const initializeAdminFirebase = (options: InitializeOptions) => {
  const adminApp =
    getAdminApps().length === 0
      ? initializeAdminApp({
          credential: cert({
            projectId: options.credential.projectId,
            clientEmail: options.credential.clientEmail,
            privateKey: options.credential.privateKey.replace(/\\n/g, '\n'),
          }),
        })
      : getAdminApps()[0];

  return {
    app: adminApp,
    db: getAdminFirestore(),
    storage: getAdminStorage(adminApp),
  };
};

export { initializeAdminFirebase };
