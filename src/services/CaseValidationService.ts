import type { Case, CaseUpload, CaseFormData } from '../types/case';
import { Timestamp } from 'firebase/firestore';
import { validateCaseUpload, convertFormDataToCaseUpload, prepareCaseForFirebase } from '../utils/caseValidation';

export class CaseValidationService {
  /**
   * Validates and prepares a case for creation
   */
  static async validateAndPrepareCase(
    formData: CaseFormData,
    authorId: string
  ): Promise<{ case: CaseUpload; errors: string[] }> {
    // Add authorId to form data
    const formDataWithAuthor = {
      ...formData,
      authorId
    };

    // Convert form data to case upload format
    const caseUpload = convertFormDataToCaseUpload(formDataWithAuthor);

    // Validate the case upload
    const validation = validateCaseUpload(caseUpload);

    if (!validation.isValid) {
      return {
        case: caseUpload,
        errors: validation.errors
      };
    }

    // Prepare the case for Firebase
    const preparedCase = prepareCaseForFirebase(caseUpload as Partial<Case>);

    return {
      case: preparedCase as CaseUpload,
      errors: []
    };
  }

  /**
   * Validates a case update
   */
  static async validateCaseUpdate(
    caseId: string,
    updates: Partial<Case>
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validate required fields if they are being updated
    if (updates.title !== undefined && !updates.title) {
      errors.push('Title cannot be empty');
    }

    if (updates.description !== undefined && !updates.description) {
      errors.push('Description cannot be empty');
    }

    if (updates.category !== undefined && !updates.category) {
      errors.push('Category cannot be empty');
    }

    // Validate status transitions
    if (updates.status !== undefined) {
      if (!['draft', 'published', 'archived'].includes(updates.status)) {
        errors.push('Invalid status value');
      }
    }

    // Validate difficulty
    if (updates.difficulty !== undefined) {
      if (!['beginner', 'intermediate', 'advanced'].includes(updates.difficulty)) {
        errors.push('Invalid difficulty value');
      }
    }

    // Validate arrays
    if (updates.tags !== undefined && !Array.isArray(updates.tags)) {
      errors.push('Tags must be an array');
    }

    if (updates.images !== undefined && !Array.isArray(updates.images)) {
      errors.push('Images must be an array');
    }

    if (updates.teachingPoints !== undefined && !Array.isArray(updates.teachingPoints)) {
      errors.push('Teaching points must be an array');
    }

    // Validate patient demographics if being updated
    if (updates.patientDemographics !== undefined) {
      const { age, gender, presentingComplaint } = updates.patientDemographics;
      if (age !== undefined && (typeof age !== 'number' || age <= 0)) {
        errors.push('Patient age must be a positive number');
      }
      if (gender !== undefined && !gender) {
        errors.push('Patient gender is required');
      }
      if (presentingComplaint !== undefined && !presentingComplaint) {
        errors.push('Presenting complaint is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitizes case data before saving to Firebase
   */
  static sanitizeCaseData(data: Partial<Case>): Partial<Case> {
    const sanitized = { ...data };

    // Remove any undefined values
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key as keyof Case] === undefined) {
        delete sanitized[key as keyof Case];
      }
    });

    // Ensure dates are Timestamps
    if (sanitized.createdAt && !(sanitized.createdAt instanceof Timestamp)) {
      sanitized.createdAt = Timestamp.fromDate(new Date(sanitized.createdAt as unknown as string));
    }
    if (sanitized.updatedAt && !(sanitized.updatedAt instanceof Timestamp)) {
      sanitized.updatedAt = Timestamp.fromDate(new Date(sanitized.updatedAt as unknown as string));
    }
    if (sanitized.publishedAt && !(sanitized.publishedAt instanceof Timestamp)) {
      sanitized.publishedAt = Timestamp.fromDate(new Date(sanitized.publishedAt as unknown as string));
    }

    return sanitized;
  }
} 