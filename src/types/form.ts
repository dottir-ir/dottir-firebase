import type { CaseFormData } from './case';

export interface FormError {
  message: string;
}

export type NestedErrors = {
  [key: string]: FormError | {
    [key: string]: FormError;
  };
};

export interface StepProps {
  formData: CaseFormData;
  updateFormData: (data: Partial<CaseFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting?: boolean;
  errors?: {
    [key: string]: FormError | {
      [key: string]: FormError;
    };
  };
} 