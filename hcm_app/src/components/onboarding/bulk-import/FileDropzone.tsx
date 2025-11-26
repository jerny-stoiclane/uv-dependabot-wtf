import {
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';

interface FileDropzoneProps {
  onFileSelect: (file: File) => Promise<void>;
  isUploading: boolean;
  title?: string;
  description?: string;
  uploadButtonText?: string;
  templateButton?: React.ReactNode;
  showWorkflow?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  isUploading,
  title = 'Upload Your Excel File',
  description = 'Select an Excel file from your computer or drag it here',
  uploadButtonText = 'Upload File',
  templateButton,
  showWorkflow = false,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the dropzone container itself
    if (e.currentTarget === e.target) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        await onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await onFileSelect(file);
      }
      // Reset input
      e.target.value = '';
    },
    [onFileSelect]
  );

  if (showWorkflow) {
    return (
      <Box
        sx={{
          border: '2px dashed',
          borderColor: 'grey.300',
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: 'grey.50',
        }}
      >
        {/* Step 1: Download Template */}
        <Box
          sx={{
            p: 4,
            backgroundColor: 'white',
            textAlign: 'center',
          }}
        >
          <DownloadIcon
            sx={{
              fontSize: 40,
              color: 'primary.main',
              mb: 2,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Step 1: Download Excel Template
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Get the pre-populated template with your selected employees.
            Required fields are marked and sensitive data is masked.
          </Typography>
          <Box sx={{ pointerEvents: 'auto' }}>{templateButton}</Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed', borderWidth: 1 }} />

        {/* Step 2: Upload Completed */}
        <Box
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            p: 4,
            backgroundColor: isDragActive ? 'primary.50' : 'white',
            textAlign: 'center',
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <CloudUploadIcon
            sx={{
              fontSize: 40,
              color: isDragActive ? 'primary.main' : 'text.disabled',
              mb: 2,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Step 2: Upload Completed File
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, pointerEvents: 'none' }}
          >
            {isDragActive
              ? 'Drop your completed Excel file here'
              : 'Complete all required fields in the template, then drag & drop or upload the file here for review'}
          </Typography>
          <Button
            variant="contained"
            size="large"
            component="label"
            disabled={isUploading}
            sx={{ pointerEvents: 'auto' }}
          >
            {isUploading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              <span>{uploadButtonText}</span>
            )}
            <input
              type="file"
              accept=".xlsx"
              hidden
              onChange={handleFileInputChange}
              disabled={isUploading}
            />
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        py: 6,
        px: 4,
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.300',
        borderRadius: 1,
        backgroundColor: isDragActive ? 'primary.50' : 'grey.50',
        textAlign: 'center',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <CloudUploadIcon
        sx={{
          fontSize: 40,
          color: isDragActive ? 'primary.main' : 'text.disabled',
          mb: 1.5,
          pointerEvents: 'none',
        }}
      />
      <Typography
        variant="body1"
        gutterBottom
        sx={{ fontWeight: 500, pointerEvents: 'none' }}
      >
        {isDragActive ? 'Drop your Excel file here' : title}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 3, pointerEvents: 'none' }}
      >
        {isDragActive ? 'Release to upload' : description}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <Box sx={{ pointerEvents: 'auto' }}>{templateButton}</Box>
        <Button
          variant="contained"
          size="medium"
          component="label"
          disabled={isUploading}
          sx={{ pointerEvents: 'auto' }}
        >
          {isUploading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            <span>{uploadButtonText}</span>
          )}
          <input
            type="file"
            accept=".xlsx"
            hidden
            onChange={handleFileInputChange}
            disabled={isUploading}
          />
        </Button>
      </Box>
    </Box>
  );
};
