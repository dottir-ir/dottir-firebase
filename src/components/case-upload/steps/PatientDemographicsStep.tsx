import React from 'react';
import type { CaseFormData } from '../../../types/case';
import type { StepProps, FormError } from '../../../types/form';

export const PatientDemographicsStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  errors
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Handle nested fields with dot notation
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      const sectionData = formData[section as keyof CaseFormData] as Record<string, any>;
      updateFormData({
        [section]: {
          ...sectionData,
          [field]: field === 'age' ? (value === '' ? undefined : Number(value)) : value
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
      <h2>Patient Demographics</h2>
      <div className="form-group">
        <label htmlFor="patientDemographics.age">Age</label>
        <input
          type="number"
          id="patientDemographics.age"
          name="patientDemographics.age"
          value={formData.patientDemographics?.age || ''}
          onChange={handleChange}
          required
        />
        {getErrorMessage('patientDemographics.age') && (
          <span className="error">{getErrorMessage('patientDemographics.age')}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="patientDemographics.gender">Gender</label>
        <select
          id="patientDemographics.gender"
          name="patientDemographics.gender"
          value={formData.patientDemographics?.gender || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {getErrorMessage('patientDemographics.gender') && (
          <span className="error">{getErrorMessage('patientDemographics.gender')}</span>
        )}
      </div>
      <div className="button-group">
        <button type="button" onClick={prevStep}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
}; 