import type { StepProps } from '../types';

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
        {errors?.imagingFindings && (
          <span className="error">{errors.imagingFindings.message}</span>
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
        {errors?.differentialDiagnosis && (
          <span className="error">{errors.differentialDiagnosis.message}</span>
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
        {errors?.finalDiagnosis && (
          <span className="error">{errors.finalDiagnosis.message}</span>
        )}
      </div>
      <div className="button-group">
        <button type="button" onClick={prevStep}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
}; 