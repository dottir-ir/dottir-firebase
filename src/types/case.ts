import { Timestamp } from 'firebase/firestore';

export interface Case {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorImage?: string;
  authorName?: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  saveCount: number;
  likes: string[];
  saves: string[];
  clinicalHistory: string;
  clinicalPresentation: string;
  imagingFindings: string;
  differentialDiagnosis: string[];
  finalDiagnosis: string;
  patientDemographics: {
    age: number;
    gender: string;
    presentingComplaint: string;
  };
  images: {
    url: string;
    description: string;
    order: number;
  }[];
  teachingPoints: {
    title: string;
    description: string;
    order: number;
  }[];
}

// Type guard to check if an object is a valid Case
export function isValidCase(data: any): data is Case {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    typeof data.authorId === 'string' &&
    typeof data.status === 'string' &&
    ['draft', 'published', 'archived'].includes(data.status) &&
    Array.isArray(data.tags) &&
    typeof data.category === 'string' &&
    typeof data.difficulty === 'string' &&
    ['beginner', 'intermediate', 'advanced'].includes(data.difficulty) &&
    data.createdAt instanceof Timestamp &&
    data.updatedAt instanceof Timestamp &&
    (data.publishedAt === undefined || data.publishedAt instanceof Timestamp) &&
    typeof data.viewCount === 'number' &&
    typeof data.likeCount === 'number' &&
    typeof data.commentCount === 'number' &&
    typeof data.saveCount === 'number' &&
    Array.isArray(data.likes) &&
    Array.isArray(data.saves) &&
    typeof data.clinicalHistory === 'string' &&
    typeof data.clinicalPresentation === 'string' &&
    typeof data.imagingFindings === 'string' &&
    Array.isArray(data.differentialDiagnosis) &&
    typeof data.finalDiagnosis === 'string' &&
    typeof data.patientDemographics === 'object' &&
    data.patientDemographics !== null &&
    typeof data.patientDemographics.age === 'number' &&
    typeof data.patientDemographics.gender === 'string' &&
    typeof data.patientDemographics.presentingComplaint === 'string' &&
    Array.isArray(data.images) &&
    Array.isArray(data.teachingPoints)
  );
}

export interface CaseMetadata {
  id: string;
  title: string;
  description: string;
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  saveCount: number;
}

export interface CaseUpload {
  title: string;
  description: string;
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  clinicalHistory: string;
  patientDemographics: {
    age: number;
    gender: string;
    presentingComplaint: string;
  };
  images: {
    url: string;
    description: string;
    order: number;
  }[];
  teachingPoints: {
    title: string;
    description: string;
    order: number;
  }[];
}

export interface PatientDemographics {
  age: number;
  gender: 'male' | 'female' | 'other';
  ethnicity?: string;
  height?: number;
  weight?: number;
  bmi?: number;
}

export interface ClinicalHistory {
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory?: string;
  medications?: string[];
  allergies?: string[];
  familyHistory?: string;
  socialHistory?: string;
}

export interface ImageUpload {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  size: number;
  annotations?: ImageAnnotation[];
  uploadDate: Date;
}

export interface ImageAnnotation {
  id: string;
  type: 'circle' | 'rectangle' | 'arrow' | 'text';
  coordinates: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  label?: string;
  color: string;
}

export interface FindingsAndDiagnosis {
  findings: string;
  diagnosis: string;
  differentialDiagnosis?: string[];
  confidence: number; // 1-5 scale
}

export interface TeachingPoints {
  keyPoints: string[];
  references?: string[];
  relatedCases?: string[];
}

export interface CaseTags {
  specialties: string[];
  modalities: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  customTags?: string[];
}

export interface CaseFormData {
  authorId: string;
  patientDemographics: {
    age: number;
    gender: 'male' | 'female' | 'other';
  };
  clinicalHistory: {
    presentation: string;
    history: string;
  };
  images: {
    url: string;
    description: string;
    order: number;
  }[];
  imagingFindings: string;
  differentialDiagnosis: string[];
  finalDiagnosis: string;
  teachingPoints: {
    title: string;
    description: string;
    order: number;
  }[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  content: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
} 