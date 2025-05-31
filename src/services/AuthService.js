import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, User as FirebaseUser, UserCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User, UserProfile } from '../models/User';
class AuthService {
    async register(email, password, role, displayName, options) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userProfile = {
                id: user.uid,
                email,
                displayName: displayName || '',
                role,
                title: options?.title || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLoginAt: new Date(),
                doctorVerificationStatus: role === 'doctor' ? 'pending' : undefined,
                // Student-specific fields
                medicalSchool: role === 'student' ? options?.medicalSchool : undefined,
                yearOfStudy: role === 'student' ? options?.yearOfStudy : undefined,
                areasOfInterest: role === 'student' ? options?.areasOfInterest : undefined,
                // Doctor-specific fields
                verificationDocuments: role === 'doctor' ? options?.verificationDocuments : undefined,
            };
            // Create user profile in Firestore
            await setDoc(doc(db, 'users', user.uid), userProfile);
            return userProfile;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Fetch user profile from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                throw new Error('User profile not found');
            }
            const data = userDoc.data();
            return {
                ...data,
                id: user.uid,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                lastLoginAt: data.lastLoginAt?.toDate(),
            };
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async logout() {
        try {
            await signOut(auth);
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getCurrentUser() {
        const user = auth.currentUser;
        if (!user)
            return null;
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists())
                return null;
            const data = userDoc.data();
            return {
                ...data,
                id: user.uid,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                lastLoginAt: data.lastLoginAt?.toDate(),
            };
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async uploadDoctorVerification(userId, documentUrl) {
        try {
            await setDoc(doc(db, 'users', userId), {
                doctorVerificationDoc: documentUrl,
                doctorVerificationStatus: 'pending',
                updatedAt: new Date(),
            }, { merge: true });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    handleError(error) {
        console.error('Auth Error:', error);
        return new Error(error.message || 'An authentication error occurred');
    }
}
export const authService = new AuthService();
