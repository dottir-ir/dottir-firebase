import React from 'react';
import type { CaseFormData } from '../../../types/case';
import type { StepProps, FormError } from '../../../types/form';

export const FindingsStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  errors
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  // Handle differential diagnosis as an array
  const handleDifferentialChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    // Split by new lines to create an array
    const diagnoses = value.split('\n').filter(d => d.trim() !== '');
    updateFormData({ differentialDiagnosis: diagnoses });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const getErrorMessage = (field: string): string | undefined => {
    const error = errors?.[field];
    if (error && 'message' in error) {
      return error.message;
    }
    return undefined;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Findings and Diagnosis</h2>
      <div className="form-group">
        <label htmlFor="imagingFindings">Imaging Findings</label>
        <textarea
          id="imagingFindings"
          name="imagingFindings"
          value={formData.imagingFindings || ''}
          onChange={handleChange}
          required
        />
        {getErrorMessage('imagingFindings') && (
          <span className="error">{getErrorMessage('imagingFindings')}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="differentialDiagnosis">Differential Diagnosis (one per line)</label>
        <textarea
          id="differentialDiagnosis"
          name="differentialDiagnosis"
          value={Array.isArray(formData.differentialDiagnosis) ? formData.differentialDiagnosis.join('\n') : ''}
          onChange={handleDifferentialChange}
          required
        />
        {getErrorMessage('differentialDiagnosis') && (
          <span className="error">{getErrorMessage('differentialDiagnosis')}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="finalDiagnosis">Final Diagnosis</label>
        <input
          type="text"
          id="finalDiagnosis"
          name="finalDiagnosis"
          value={formData.finalDiagnosis || ''}
          onChange={handleChange}
          required
        />
        {getErrorMessage('finalDiagnosis') && (
          <span className="error">{getErrorMessage('finalDiagnosis')}</span>
        )}
      </div>
      <div className="button-group">
        <button type="button" onClick={prevStep}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
}; 