import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import type { UserProfile, UserRole } from '../config';
import { auth, db } from '../config';

export class UserService {
  static async register(email: string, password: string, displayName: string): Promise<FirebaseUser> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role: 'user',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return user;
  }

  static async login(email: string, password: string): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  static async logout(): Promise<void> {
    await signOut(auth);
  }

  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
  }

  static async updateUserRole(uid: string, role: UserRole): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      role,
      updatedAt: new Date(),
    });
  }

  static async verifyDoctor(uid: string): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      isVerified: true,
      role: 'doctor',
      updatedAt: new Date(),
    });
  }
} 