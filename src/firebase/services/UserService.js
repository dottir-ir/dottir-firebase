import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User as FirebaseUser, } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, UserProfile, UserRole } from '../config';
export class UserService {
    static async register(email, password, displayName) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Update profile
        await updateProfile(user, { displayName });
        // Create user profile in Firestore
        const userProfile = {
            uid: user.uid,
            email: user.email,
            displayName,
            role: 'user',
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
        return user;
    }
    static async login(email, password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    }
    static async logout() {
        await signOut(auth);
    }
    static async getUserProfile(uid) {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists() ? userDoc.data() : null;
    }
    static async updateUserRole(uid, role) {
        await updateDoc(doc(db, 'users', uid), {
            role,
            updatedAt: new Date(),
        });
    }
    static async verifyDoctor(uid) {
        await updateDoc(doc(db, 'users', uid), {
            isVerified: true,
            role: 'doctor',
            updatedAt: new Date(),
        });
    }
}
