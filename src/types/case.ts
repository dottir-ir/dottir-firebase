import type { Timestamp } from 'firebase/firestore';

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
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
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