import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import app from './firebaseConfigInitializer'; // Import the initialized app

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; // Export the app itself if needed elsewhere
