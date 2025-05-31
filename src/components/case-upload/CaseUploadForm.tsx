import React, { useState } from 'react';
import { Box, Button, Paper, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { CaseFormData } from '../../types/case';
import { PatientDemographicsStep } from './steps/PatientDemographicsStep';
import { ClinicalHistoryStep } from './steps/ClinicalHistoryStep';
import { FindingsStep } from './steps/FindingsStep';
import { TeachingPointsStep } from './steps/TeachingPointsStep';
import { TagsStep } from './steps/TagsStep';

const steps = [
  'Patient Demographics',
  'Clinical History',
  'Image Upload',
  'Findings & Diagnosis',
  'Teaching Points',
  'Tags'
];

const CaseUploadForm: React.FC = () => {
  const { currentUser } = useAuth();
  const isDoctor = currentUser?.role === 'doctor';
  const isVerified = currentUser?.doctorVerificationStatus === 'verified';
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CaseFormData>({
    patientDemographics: {
      age: 0,
      gender: 'male'
    },
    clinicalHistory: {
      presentation: '',
      history: ''
    },
    images: [],
    imagingFindings: '',
    differentialDiagnosis: [],
    finalDiagnosis: '',
    teachingPoints: [],
    tags: [],
    difficulty: 'beginner',
    title: '',
    description: '',
    content: '',
    category: '',
    status: 'draft'
  });

  const updateFormData = (data: Partial<CaseFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement draft saving to Firebase
      console.log('Saving draft:', formData);
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Process formData and submit
    console.log(formData);
    setIsSubmitting(false);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <PatientDemographicsStep
          key="demographics"
          formData={formData}
          updateFormData={updateFormData}
          nextStep={handleNext}
          prevStep={handleBack}
          isSubmitting={isSubmitting}
        />;
      case 1:
        return <ClinicalHistoryStep
          key="clinical"
          formData={formData}
          updateFormData={updateFormData}
          nextStep={handleNext}
          prevStep={handleBack}
          isSubmitting={isSubmitting}
        />;
      case 2:
        return <FindingsStep
          key="findings"
          formData={formData}
          updateFormData={updateFormData}
          nextStep={handleNext}
          prevStep={handleBack}
          isSubmitting={isSubmitting}
        />;
      case 3:
        return <TeachingPointsStep />;
      case 4:
        return <TagsStep />;
      default:
        return null;
    }
  };

  if (isDoctor && !isVerified) {
    return (
      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
        <Alert severity="warning">
          Your account is not verified. You cannot upload cases until your verification is approved.
        </Alert>
      </Paper>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {renderStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        
        <Box>
          <Button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            sx={{ mr: 1 }}
          >
            Save Draft
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              Submit Case
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </form>
  );
};

export default CaseUploadForm; 