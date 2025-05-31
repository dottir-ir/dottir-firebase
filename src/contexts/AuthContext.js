import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, UserCredential, updateProfile as firebaseUpdateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User as AppUser } from '../models/User';
import { UserRole } from '../services/AuthService';
const AuthContext = createContext(undefined);
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getErrorMessage = (err) => err?.message || 'An error occurred';
    const signIn = async (email, password) => {
        try {
            setError(null);
            return await signInWithEmailAndPassword(auth, email, password);
        }
        catch (err) {
            setError(getErrorMessage(err));
            throw err;
        }
    };
    const signOut = async () => {
        try {
            setError(null);
            await firebaseSignOut(auth);
        }
        catch (err) {
            setError(getErrorMessage(err));
            throw err;
        }
    };
    const register = async (email, password, role, userData) => {
        try {
            setError(null);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                email,
                role,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                ...userData
            });
            return userCredential;
        }
        catch (err) {
            setError(getErrorMessage(err));
            throw err;
        }
    };
    const resetPassword = async (email) => {
        try {
            setError(null);
            await sendPasswordResetEmail(auth, email);
        }
        catch (err) {
            setError(getErrorMessage(err));
            throw err;
        }
    };
    const updateProfile = async (data) => {
        if (!currentUser)
            return;
        try {
            setError(null);
            await updateDoc(doc(db, 'users', currentUser.id), {
                ...data,
                updatedAt: new Date(),
            });
            setCurrentUser({ ...currentUser, ...data, updatedAt: new Date() });
        }
        catch (err) {
            setError(getErrorMessage(err));
            throw err;
        }
    };
    const clearError = () => {
        setError(null);
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        setCurrentUser({
                            id: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            ...userDoc.data(),
                        });
                    }
                    else {
                        setCurrentUser(null);
                        setError('User profile not found');
                    }
                }
                catch (err) {
                    setError(getErrorMessage(err));
                    setCurrentUser(null);
                }
            }
            else {
                setCurrentUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    const value = {
        currentUser,
        loading,
        signIn,
        signOut,
        register,
        resetPassword,
        error,
        clearError,
        updateProfile,
        // Add any other methods referenced in your components
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
}
