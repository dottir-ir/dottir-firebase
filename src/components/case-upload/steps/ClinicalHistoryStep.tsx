import React from 'react';
import type { CaseFormData } from '../../../types/case';
import type { StepProps, FormError } from '../../../types/form';

export const ClinicalHistoryStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  errors
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Handle nested fields with dot notation
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      const sectionData = formData[section as keyof CaseFormData] as Record<string, any>;
      updateFormData({
        [section]: {
          ...sectionData,
          [field]: value
        }
      });
    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const getErrorMessage = (field: string): string | undefined => {
    const [section, name] = field.split('.');
    const sectionErrors = errors?.[section];
    if (!sectionErrors || !('message' in sectionErrors)) {
      const fieldError = sectionErrors?.[name];
      if (fieldError && 'message' in fieldError) {
        return fieldError.message;
      }
    }
    return undefined;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Clinical History</h2>
      <div className="form-group">
        <label htmlFor="clinicalHistory.presentation">Presentation</label>
        <textarea
          id="clinicalHistory.presentation"
          name="clinicalHistory.presentation"
          value={formData.clinicalHistory?.presentation || ''}
          onChange={handleChange}
          required
        />
        {getErrorMessage('clinicalHistory.presentation') && (
          <span className="error">{getErrorMessage('clinicalHistory.presentation')}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="clinicalHistory.history">Medical History</label>
        <textarea
          id="clinicalHistory.history"
          name="clinicalHistory.history"
          value={formData.clinicalHistory?.history || ''}
          onChange={handleChange}
          required
        />
        {getErrorMessage('clinicalHistory.history') && (
          <span className="error">{getErrorMessage('clinicalHistory.history')}</span>
        )}
      </div>
      <div className="button-group">
        <button type="button" onClick={prevStep}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
}; 