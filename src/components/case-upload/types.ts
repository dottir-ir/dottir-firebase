import type { CaseFormData } from '../../types/case';

export interface StepProps {
  formData: CaseFormData;
  updateFormData: (data: Partial<CaseFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting?: boolean;
  errors?: Record<string, any>;
} 