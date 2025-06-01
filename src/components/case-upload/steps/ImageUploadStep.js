import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Typography, Paper, Grid, IconButton, Button, CircularProgress, } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { CaseUpload, ImageUpload } from '../../../types/case';
import { storage } from '../../../firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
export default function ImageUploadStep() {
    const { setValue, watch } = useFormContext();
    const [uploading, setUploading] = useState(false);
    const images = watch('images') || [];
    const onDrop = useCallback(async (acceptedFiles) => {
        setUploading(true);
        try {
            const uploadPromises = acceptedFiles.map(async (file) => {
                const imageId = uuidv4();
                const storageRef = ref(storage, `case-images/${imageId}`);
                // Upload file to Firebase Storage
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                const newImage = {
                    id: imageId,
                    url: downloadURL,
                    fileName: file.name,
                    fileType: file.type,
                    size: file.size,
                    uploadDate: new Date(),
                };
                return newImage;
            });
            const uploadedImages = await Promise.all(uploadPromises);
            setValue('images', [...images, ...uploadedImages]);
        }
        catch (error) {
            console.error('Error uploading images:', error);
            // TODO: Add error handling UI
        }
        finally {
            setUploading(false);
        }
    }, [images, setValue]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.dicom']
        },
        maxSize: 10 * 1024 * 1024, // 10MB
    });
    const removeImage = (imageId) => {
        setValue('images', images.filter(img => img.id !== imageId));
    };
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Image Upload" }), _jsxs(Paper, { ...getRootProps(), sx: {
                    p: 3,
                    mb: 3,
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                    cursor: 'pointer',
                    textAlign: 'center',
                }, children: [_jsx("input", { ...getInputProps() }), uploading ? (_jsx(CircularProgress, {})) : (_jsxs(_Fragment, { children: [_jsx(AddIcon, { sx: { fontSize: 40, color: 'primary.main', mb: 1 } }), _jsx(Typography, { children: isDragActive
                                    ? 'Drop the images here'
                                    : 'Drag and drop images here, or click to select files' }), _jsx(Typography, { variant: "caption", color: "textSecondary", children: "Supported formats: JPEG, PNG, GIF, DICOM (max 10MB)" })] }))] }), images.length > 0 && (_jsx(Grid, { container: true, spacing: 2, children: images.map((image) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsxs(Paper, { sx: {
                            p: 1,
                            position: 'relative',
                            '&:hover .delete-button': {
                                opacity: 1,
                            },
                        }, children: [_jsx("img", { src: image.url, alt: image.fileName, style: {
                                    width: '100%',
                                    height: 200,
                                    objectFit: 'cover',
                                } }), _jsx(IconButton, { className: "delete-button", onClick: () => removeImage(image.id), sx: {
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    },
                                }, children: _jsx(DeleteIcon, {}) }), _jsx(Typography, { variant: "caption", noWrap: true, children: image.fileName })] }) }, image.id))) }))] }));
}
