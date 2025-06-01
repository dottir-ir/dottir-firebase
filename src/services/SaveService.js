import { collection, doc, getDoc, getDocs, addDoc, deleteDoc, query, where, orderBy, increment, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { BaseService, ServiceError } from './BaseService';
import { Case, CaseMetadata } from '../types/case';
import { CaseService } from './CaseService';
export class SaveService extends BaseService {
    constructor() {
        super();
        Object.defineProperty(this, "savesCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'saves')
        });
        Object.defineProperty(this, "casesCollection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: collection(db, 'cases')
        });
        Object.defineProperty(this, "caseService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.caseService = new CaseService();
    }
    async toggleSave(userId, caseId) {
        try {
            const existingSave = await this.getSave(userId, caseId);
            if (existingSave) {
                await this.unsave(userId, caseId);
                return false;
            }
            else {
                await this.save(userId, caseId);
                return true;
            }
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getSave(userId, caseId) {
        try {
            const q = query(this.savesCollection, where('userId', '==', userId), where('caseId', '==', caseId));
            const snapshot = await getDocs(q);
            if (snapshot.empty) {
                return null;
            }
            const doc = snapshot.docs[0];
            return this.convertToSave(doc.data());
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async getSavedCases(userId) {
        try {
            const q = query(this.savesCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const saves = snapshot.docs.map((doc) => this.convertToSave(doc.data()));
            // Get case details for each save
            const cases = await Promise.all(saves.map(async (save) => {
                try {
                    const case_ = await this.caseService.getCaseById(save.caseId);
                    const metadata = {
                        id: case_.id,
                        title: case_.title,
                        description: case_.description,
                        authorId: case_.authorId,
                        status: case_.status,
                        tags: case_.tags,
                        category: case_.category,
                        difficulty: case_.difficulty,
                        createdAt: case_.createdAt,
                        updatedAt: case_.updatedAt,
                        publishedAt: case_.publishedAt,
                        viewCount: case_.viewCount,
                        likeCount: case_.likeCount,
                        commentCount: case_.commentCount,
                        saveCount: case_.saveCount,
                    };
                    return metadata;
                }
                catch (error) {
                    console.error(`Error fetching case ${save.caseId}:`, error);
                    return null;
                }
            }));
            return cases.filter((case_) => case_ !== null);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async updateSaveNote(saveId, note) {
        try {
            const saveRef = doc(this.savesCollection, saveId);
            await updateDoc(saveRef, { note });
            const saveDoc = await getDoc(saveRef);
            return this.convertToSave(saveDoc.data());
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async updateSaveTags(saveId, tags) {
        try {
            const saveRef = doc(this.savesCollection, saveId);
            await updateDoc(saveRef, { tags });
            const saveDoc = await getDoc(saveRef);
            return this.convertToSave(saveDoc.data());
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async save(userId, caseId) {
        try {
            const newSave = {
                userId,
                caseId,
                createdAt: new Date(),
            };
            await addDoc(this.savesCollection, newSave);
            // Update save count on case
            const caseRef = doc(this.casesCollection, caseId);
            await updateDoc(caseRef, {
                saveCount: increment(1),
            });
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    async unsave(userId, caseId) {
        try {
            const q = query(this.savesCollection, where('userId', '==', userId), where('caseId', '==', caseId));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const saveDoc = snapshot.docs[0];
                await deleteDoc(doc(this.savesCollection, saveDoc.id));
                // Update save count on case
                const caseRef = doc(this.casesCollection, caseId);
                await updateDoc(caseRef, {
                    saveCount: increment(-1),
                });
            }
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    convertToSave(data) {
        return {
            id: data.id,
            userId: data.userId,
            caseId: data.caseId,
            createdAt: data.createdAt?.toDate(),
            note: data.note,
            tags: data.tags,
        };
    }
}
