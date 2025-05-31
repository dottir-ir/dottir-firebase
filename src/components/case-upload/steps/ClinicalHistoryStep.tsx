import type { CaseFormData } from '../../../types/case';

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
        {errors?.clinicalHistory?.presentation && (
          <span className="error">{errors.clinicalHistory.presentation.message}</span>
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
        {errors?.clinicalHistory?.history && (
          <span className="error">{errors.clinicalHistory.history.message}</span>
        )}
      </div>
      <div className="button-group">
        <button type="button" onClick={prevStep}>Back</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
}; 