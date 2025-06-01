import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase';
import type { CaseFormData } from '../../../types/case';
import type { StepProps } from '../../../types/form';

interface ImageObject {
  url: string;
  description: string;
  order: number;
}

export const ImageUploadStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  isSubmitting
}) => {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      const newImages = await Promise.all(
        acceptedFiles.map(async (file) => {
          const imageId = `${Date.now()}-${file.name}`;
          const storageRef = ref(storage, `case-images/${imageId}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          return {
            url: downloadURL,
            description: '',
            order: formData.images.length
          } as ImageObject;
        })
      );

      updateFormData({
        images: [...formData.images, ...newImages]
      });
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  }, [formData.images, updateFormData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: true
  });

  const handleRemoveImage = (imageId: string) => {
    updateFormData({
      images: formData.images.filter(img => img.url !== imageId)
    });
  };

  const handleImageDescriptionChange = (imageId: string, description: string) => {
    updateFormData({
      images: formData.images.map(img =>
        img.url === imageId ? { ...img, description } : img
      )
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Images
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          mb: 3
        }}
      >
        <input {...getInputProps()} />
        <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography>
          {isDragActive
            ? 'Drop the images here'
            : 'Drag and drop images here, or click to select files'}
        </Typography>
      </Box>

      {formData.images.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Uploaded Images
          </Typography>
          {formData.images.map((image, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1
              }}
            >
              <img
                src={image.url}
                alt={`Uploaded image ${index + 1}`}
                style={{ width: 100, height: 100, objectFit: 'cover', marginRight: 16 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Image {index + 1}
                </Typography>
                <input
                  type="text"
                  value={image.description}
                  onChange={(e) => handleImageDescriptionChange(image.url, e.target.value)}
                  placeholder="Add a description"
                  style={{ width: '100%', marginTop: 8 }}
                />
              </Box>
              <IconButton
                onClick={() => handleRemoveImage(image.url)}
                disabled={isSubmitting}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={prevStep}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={nextStep}
          disabled={isSubmitting}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}; 