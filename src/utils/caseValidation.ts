import type { Case, CaseUpload, CaseFormData } from '../types/case';
import { Timestamp } from 'firebase/firestore';

/**
 * Validates required fields for a case upload
 */
export function validateCaseUpload(data: Partial<CaseUpload>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required string fields
  const requiredStrings = ['title', 'description', 'authorId', 'category', 'clinicalHistory'];
  requiredStrings.forEach(field => {
    if (!data[field as keyof CaseUpload] || typeof data[field as keyof CaseUpload] !== 'string') {
      errors.push(`${field} is required and must be a string`);
    }
  });

  // Validate status
  if (!data.status || !['draft', 'published', 'archived'].includes(data.status)) {
    errors.push('status must be one of: draft, published, archived');
  }

  // Validate difficulty
  if (!data.difficulty || !['beginner', 'intermediate', 'advanced'].includes(data.difficulty)) {
    errors.push('difficulty must be one of: beginner, intermediate, advanced');
  }

  // Validate arrays
  if (!Array.isArray(data.tags)) {
    errors.push('tags must be an array');
  }

  // Validate patient demographics
  if (!data.patientDemographics) {
    errors.push('patientDemographics is required');
  } else {
    const { age, gender, presentingComplaint } = data.patientDemographics;
    if (typeof age !== 'number' || age <= 0) {
      errors.push('patient age must be a positive number');
    }
    if (typeof gender !== 'string' || !gender) {
      errors.push('patient gender is required');
    }
    if (typeof presentingComplaint !== 'string' || !presentingComplaint) {
      errors.push('presenting complaint is required');
    }
  }

  // Validate images array
  if (!Array.isArray(data.images)) {
    errors.push('images must be an array');
  } else {
    data.images.forEach((image, index) => {
      if (!image.url || typeof image.url !== 'string') {
        errors.push(`image ${index + 1} must have a valid URL`);
      }
      if (typeof image.order !== 'number') {
        errors.push(`image ${index + 1} must have a valid order number`);
      }
    });
  }

  // Validate teaching points
  if (!Array.isArray(data.teachingPoints)) {
    errors.push('teachingPoints must be an array');
  } else {
    data.teachingPoints.forEach((point, index) => {
      if (!point.title || typeof point.title !== 'string') {
        errors.push(`teaching point ${index + 1} must have a title`);
      }
      if (typeof point.order !== 'number') {
        errors.push(`teaching point ${index + 1} must have a valid order number`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Converts a CaseFormData to a CaseUpload format
 */
export function convertFormDataToCaseUpload(formData: CaseFormData): CaseUpload {
  return {
    title: formData.title,
    description: formData.description,
    authorId: formData.authorId || '',
    status: formData.status,
    tags: formData.tags,
    category: formData.category,
    difficulty: formData.difficulty,
    clinicalHistory: formData.clinicalHistory.history,
    patientDemographics: {
      age: formData.patientDemographics.age,
      gender: formData.patientDemographics.gender,
      presentingComplaint: formData.clinicalHistory.presentation
    },
    images: formData.images,
    teachingPoints: formData.teachingPoints
  };
}

/**
 * Prepares a case for Firebase storage by converting dates to timestamps
 */
export function prepareCaseForFirebase(caseData: Partial<Case>): Partial<Case> {
  const now = Timestamp.now();
  
  return {
    ...caseData,
    createdAt: caseData.createdAt || now,
    updatedAt: now,
    publishedAt: caseData.status === 'published' ? now : undefined
  };
} 