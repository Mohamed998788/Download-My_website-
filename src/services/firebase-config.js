// Firebase Configuration & Services
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy, 
    limit,
    where,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2Jujt76Nmuvxas-TRQeIQHBJno_cnn4I",
    authDomain: "red-s-a22d1.firebaseapp.com",
    projectId: "red-s-a22d1",
    storageBucket: "red-s-a22d1.firebasestorage.app",
    messagingSenderId: "121931518670",
    appId: "1:121931518670:web:b8318c7ee1ff8d5fad769f",
    measurementId: "G-7CGP1VP0MT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Authentication Service
export class AuthService {
    static async register(email, password, displayName) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName });
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static onAuthStateChange(callback) {
        return onAuthStateChanged(auth, callback);
    }

    static getCurrentUser() {
        return auth.currentUser;
    }
}

// Firestore Service
export class FirestoreService {
    // Player Settings
    static async savePlayerSettings(settingsData) {
        try {
            const docRef = await addDoc(collection(db, "playersSettings"), {
                ...settingsData,
                publishedAt: serverTimestamp(),
                userId: auth.currentUser?.uid || null
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getPlayerSettings(limitCount = 50) {
        try {
            const q = query(
                collection(db, "playersSettings"),
                orderBy("publishedAt", "desc"),
                limit(limitCount)
            );
            const querySnapshot = await getDocs(q);
            const settings = [];
            querySnapshot.forEach((doc) => {
                settings.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: settings };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getPlayerSettingsByUser(userId) {
        try {
            const q = query(
                collection(db, "playersSettings"),
                where("userId", "==", userId),
                orderBy("publishedAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const settings = [];
            querySnapshot.forEach((doc) => {
                settings.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: settings };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // User Settings
    static async saveUserSettings(userId, settings) {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                settings: settings,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getUserSettings(userId) {
        try {
            const userRef = doc(db, "users", userId);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                return { success: true, data: docSnap.data() };
            } else {
                return { success: false, error: "User not found" };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Chat History
    static async saveChatMessage(chatId, message) {
        try {
            const docRef = await addDoc(collection(db, "chats", chatId, "messages"), {
                ...message,
                timestamp: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getChatMessages(chatId, limitCount = 100) {
        try {
            const q = query(
                collection(db, "chats", chatId, "messages"),
                orderBy("timestamp", "asc"),
                limit(limitCount)
            );
            const querySnapshot = await getDocs(q);
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: messages };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Saved Sensitivities
    static async saveSensitivity(userId, sensitivityData) {
        try {
            const docRef = await addDoc(collection(db, "users", userId, "sensitivities"), {
                ...sensitivityData,
                createdAt: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getSavedSensitivities(userId) {
        try {
            const q = query(
                collection(db, "users", userId, "sensitivities"),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const sensitivities = [];
            querySnapshot.forEach((doc) => {
                sensitivities.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: sensitivities };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async deleteSensitivity(userId, sensitivityId) {
        try {
            await deleteDoc(doc(db, "users", userId, "sensitivities", sensitivityId));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Storage Service
export class StorageService {
    static async uploadFile(file, path) {
        try {
            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            return { success: true, url: downloadURL };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async uploadProfileImage(userId, file) {
        const path = `profiles/${userId}/${Date.now()}_${file.name}`;
        return this.uploadFile(file, path);
    }
}

// Export initialized instances
export { app, auth, db, storage, analytics };
