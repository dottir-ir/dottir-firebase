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

export default function ImageUploadStep() {
  const { setValue, watch } = useFormContext<CaseUpload>();
  const [uploading, setUploading] = useState(false);
  const images = watch('images') || [];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const imageId = uuidv4();
        const storageRef = ref(storage, `case-images/${imageId}`);
        
        // Upload file to Firebase Storage
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const newImage: ImageUpload = {
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
    } catch (error) {
      console.error('Error uploading images:', error);
      // TODO: Add error handling UI
    } finally {
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

  const removeImage = (imageId: string) => {
    setValue('images', images.filter(img => img.id !== imageId));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Image Upload
      </Typography>

      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          mb: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <CircularProgress />
        ) : (
          <>
            <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography>
              {isDragActive
                ? 'Drop the images here'
                : 'Drag and drop images here, or click to select files'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Supported formats: JPEG, PNG, GIF, DICOM (max 10MB)
            </Typography>
          </>
        )}
      </Paper>

      {images.length > 0 && (
        <Grid container spacing={2}>
          {images.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <Paper
                sx={{
                  p: 1,
                  position: 'relative',
                  '&:hover .delete-button': {
                    opacity: 1,
                  },
                }}
              >
                <img
                  src={image.url}
                  alt={image.fileName}
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  className="delete-button"
                  onClick={() => removeImage(image.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <Typography variant="caption" noWrap>
                  {image.fileName}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
} 