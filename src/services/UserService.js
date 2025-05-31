import { collection, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, DocumentData, } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BaseService, ServiceError } from './BaseService';
import { Case, CaseMetadata } from '../types/case';
export class UserService extends BaseService {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "usersCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'users')
        });
        Object.defineProperty(this, "casesCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'cases')
        });
        Object.defineProperty(this, "savedCasesCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'savedCases')
        });
    }
    async getUserById(userId) {
        try {
            const userDoc = await getDoc(doc(this.usersCollection, userId));
            if (!userDoc.exists()) {
                throw new ServiceError('User not found', 'not-found');
            }
            return this.convertToUser(userDoc.data());
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async updateUserProfile(userId, profile) {
        try {
            const userRef = doc(this.usersCollection, userId);
            await updateDoc(userRef, {
                ...profile,
                updatedAt: new Date(),
            });
            return this.getUserById(userId);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getUserPublishedCases(userId) {
        try {
            const q = query(this.casesCollection, where('authorId', '==', userId), where('status', '==', 'published'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                title: doc.data().title,
                description: doc.data().description,
                authorId: doc.data().authorId,
                status: doc.data().status,
                tags: doc.data().tags,
                category: doc.data().category,
                difficulty: doc.data().difficulty,
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
                publishedAt: doc.data().publishedAt?.toDate(),
                viewCount: doc.data().viewCount,
                likeCount: doc.data().likeCount,
                commentCount: doc.data().commentCount,
                saveCount: doc.data().saveCount,
            }));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getUserSavedCases(userId) {
        try {
            const q = query(this.savedCasesCollection, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                savedAt: doc.data().savedAt?.toDate(),
                lastActive: doc.data().lastActive?.toDate(),
            }));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getUserLearningMetrics(userId) {
        try {
            const savedCases = await this.getUserSavedCases(userId);
            const completedCases = savedCases.filter((case_) => case_.progress === 100);
            return {
                casesCompleted: completedCases.length,
                averageScore: this.calculateAverageScore(savedCases),
                timeSpent: this.calculateTotalTimeSpent(savedCases),
                lastActive: this.getLastActiveDate(savedCases),
            };
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async deleteCase(caseId) {
        try {
            await deleteDoc(doc(this.casesCollection, caseId));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    calculateAverageScore(cases) {
        if (cases.length === 0)
            return 0;
        const totalScore = cases.reduce((sum, case_) => sum + (case_.score || 0), 0);
        return Math.round(totalScore / cases.length);
    }
    calculateTotalTimeSpent(cases) {
        return cases.reduce((total, case_) => total + case_.timeSpent, 0);
    }
    getLastActiveDate(cases) {
        if (cases.length === 0)
            return new Date();
        return new Date(Math.max(...cases.map((case_) => case_.lastActive.getTime())));
    }
    async deleteUser(userId) {
        try {
            await deleteDoc(doc(this.usersCollection, userId));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async searchUsers(searchQuery) {
        try {
            const q = query(this.usersCollection, where('displayName', '>=', searchQuery), where('displayName', '<=', `${searchQuery}\uf8ff`));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => this.convertToUser(doc.data()));
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    convertToUser(data) {
        return {
            id: data.id,
            email: data.email,
            displayName: data.displayName,
            photoURL: data.photoURL,
            role: data.role,
            title: data.title,
            specialization: data.specialization,
            institution: data.institution,
            bio: data.bio,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            lastLoginAt: data.lastLoginAt?.toDate(),
            doctorVerificationStatus: data.doctorVerificationStatus,
            verificationDocuments: data.verificationDocuments,
            // Student-specific fields
            medicalSchool: data.medicalSchool,
            yearOfStudy: data.yearOfStudy,
            areasOfInterest: data.areasOfInterest,
        };
    }
}
export const userService = new UserService();
