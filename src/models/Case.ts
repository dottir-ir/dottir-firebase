export interface Case {
  id: string;
  title: string;
  description: string;
  content: string;
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
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  clinicalPresentation: string;
  imagingFindings: string;
  differentialDiagnosis: string;
  finalDiagnosis: string;
  teachingPoints?: {
    keyPoints: string[];
    references?: string[];
    relatedCases?: string[];
  };
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
  thumbnailUrl?: string;
  likedBy?: string[];
  savedBy?: string[];
}

export interface Case extends CaseMetadata {
  content: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  clinicalPresentation: string;
  imagingFindings: string;
  diagnosis: string;
  treatment: string;
  outcome: string;
  references: string[];
} 