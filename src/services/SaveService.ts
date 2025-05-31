import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  DocumentData,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { CaseService } from './CaseService';

interface Save {
  id: string;
  userId: string;
  caseId: string;
  createdAt: Date;
  note?: string;
  tags?: string[];
}

export class SaveService extends BaseService {
  private readonly savesCollection = collection(db, 'saves');
  private readonly casesCollection = collection(db, 'cases');
  private readonly caseService: CaseService;

  constructor() {
    super();
    this.caseService = new CaseService();
  }

  async toggleSave(userId: string, caseId: string): Promise<boolean> {
    try {
      const existingSave = await this.getSave(userId, caseId);
      if (existingSave) {
        await this.unsave(userId, caseId);
        return false;
      } else {
        await this.save(userId, caseId);
        return true;
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getSave(userId: string, caseId: string): Promise<Save | null> {
    try {
      const q = query(
        this.savesCollection,
        where('userId', '==', userId),
        where('caseId', '==', caseId)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return null;
      }
      const doc = snapshot.docs[0];
      return this.convertToSave(doc.data() as DocumentData);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getSavedCases(userId: string): Promise<CaseMetadata[]> {
    try {
      const q = query(
        this.savesCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const saves = snapshot.docs.map((doc) => this.convertToSave(doc.data() as DocumentData));
      
      // Get case details for each save
      const cases = await Promise.all(
        saves.map(async (save) => {
          try {
            const case_ = await this.caseService.getCaseById(save.caseId);
            const metadata: CaseMetadata = {
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
          } catch (error) {
            console.error(`Error fetching case ${save.caseId}:`, error);
            return null;
          }
        })
      );

      return cases.filter((case_): case_ is CaseMetadata => case_ !== null);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateSaveNote(saveId: string, note: string): Promise<Save> {
    try {
      const saveRef = doc(this.savesCollection, saveId);
      await updateDoc(saveRef, { note });
      const saveDoc = await getDoc(saveRef);
      return this.convertToSave(saveDoc.data() as DocumentData);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateSaveTags(saveId: string, tags: string[]): Promise<Save> {
    try {
      const saveRef = doc(this.savesCollection, saveId);
      await updateDoc(saveRef, { tags });
      const saveDoc = await getDoc(saveRef);
      return this.convertToSave(saveDoc.data() as DocumentData);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async save(userId: string, caseId: string): Promise<void> {
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
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async unsave(userId: string, caseId: string): Promise<void> {
    try {
      const q = query(
        this.savesCollection,
        where('userId', '==', userId),
        where('caseId', '==', caseId)
      );
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
    } catch (error) {
      return this.handleError(error);
    }
  }

  private convertToSave(data: DocumentData): Save {
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