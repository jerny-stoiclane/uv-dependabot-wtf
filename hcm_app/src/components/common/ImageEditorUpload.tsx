import { useNotifications } from '@armhr/ui';
import {
  CameraAlt,
  ImageOutlined,
  Restore,
  RotateLeft,
  RotateRight,
  ZoomIn,
  ZoomOut,
} from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageEditorUpload: React.FC<
  {
    onSave: (blob: Blob) => Promise<void>;
    onRemove?: () => void;
    initialImage?: string | null;
    editorWidth?: number;
    editorHeight?: number;
    editorBorderRadius?: number;
    previewComponent?: React.ComponentType<{ previewImage: string | null }>;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({
  onSave,
  onRemove,
  initialImage,
  editorWidth = 400,
  editorHeight = 130,
  editorBorderRadius = 0,
  previewComponent: PreviewComponent,
  children,
}) => {
  const { showNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    initialImage || null
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const editorRef = useRef<AvatarEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!isValidFileType(file.name)) {
        showNotification({
          message: 'Invalid file type. Please select a valid image file.',
          severity: 'error',
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        showNotification({
          message:
            'File size is too large. Please select a file smaller than 5MB.',
          severity: 'error',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageUrl = event.target?.result;
        setSelectedImage(imageUrl as string);
        setPreviewImage(imageUrl as string);
        setOpen(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const updatePreview = useCallback(() => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const imageUrl = canvas.toDataURL();
      setPreviewImage(imageUrl);
    }
  }, []);

  const handleSave = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob(async (blob) => {
        await onSave(blob);
      }, 'image/png');
    }
    setOpen(false);
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    setScale((prevScale) => {
      let newScale = prevScale - e.deltaY * 0.001;
      return Math.max(newScale, 0.1);
    });
  }, []);

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.05, 2));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.05, 0.1));
  };

  const handleRotateLeft = () => {
    setRotate(rotate - 90);
  };

  const handleRotateRight = () => {
    setRotate(rotate + 90);
  };

  const handleReset = () => {
    setScale(1);
    setRotate(0);
    setPosition({ x: 0.5, y: 0.5 });
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    setOpen(false);
    onRemove?.();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(initialImage || null);
    setPreviewImage(initialImage || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Box onClick={() => setOpen(true)}>{children}</Box>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
        onClick={(e) => (e.currentTarget.value = '')}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        disableScrollLock={false}
      >
        <DialogContent
          onWheel={handleWheel}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
            <Badge
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Tooltip title="Upload new photo" placement="right" arrow>
                  <IconButton
                    onClick={triggerFileInput}
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid',
                      borderRadius: '50%',
                      borderColor: 'grey.400',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      '&:hover': {
                        backgroundColor: 'grey.50',
                        borderColor: 'grey.300',
                      },
                    }}
                  >
                    <CameraAlt />
                  </IconButton>
                </Tooltip>
              }
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selectedImage ? (
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    sx={{ mb: 2 }}
                  >
                    <IconButton onClick={handleZoomOut} color="primary">
                      <ZoomOut />
                    </IconButton>
                    <IconButton onClick={handleZoomIn} color="primary">
                      <ZoomIn />
                    </IconButton>
                    <IconButton onClick={handleRotateLeft} color="primary">
                      <RotateLeft />
                    </IconButton>
                    <IconButton onClick={handleRotateRight} color="primary">
                      <RotateRight />
                    </IconButton>
                    <IconButton onClick={handleReset} color="primary">
                      <Restore />
                    </IconButton>
                  </Stack>
                  <AvatarEditor
                    ref={editorRef}
                    image={selectedImage}
                    crossOrigin="anonymous"
                    width={editorWidth}
                    height={editorHeight}
                    border={20}
                    borderRadius={editorBorderRadius}
                    color={[0, 0, 0, 0.5]}
                    scale={scale}
                    rotate={rotate}
                    position={position}
                    onImageChange={updatePreview}
                    onPositionChange={setPosition}
                    disableBoundaryChecks
                  />
                </Box>
              ) : (
                <Stack
                  direction={'column'}
                  spacing={1}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <ButtonBase
                    onClick={triggerFileInput}
                    sx={{
                      '&:hover': {
                        '& .MuiBox-root': {
                          backgroundColor: 'grey.200',
                          borderColor: 'grey.300',
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: editorWidth,
                        height: editorHeight,
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'grey.50',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <ImageOutlined
                        sx={{ fontSize: 100, color: 'grey.500' }}
                      />
                    </Box>
                  </ButtonBase>
                </Stack>
              )}
            </Badge>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {PreviewComponent ? (
                <PreviewComponent previewImage={previewImage} />
              ) : (
                <Box>
                  <Typography variant="h6" mb={2}>
                    Preview:
                  </Typography>
                  <Box
                    sx={{
                      border: '1px dashed grey',
                      padding: '5px',
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    <Avatar
                      src={previewImage || ''}
                      variant="rounded"
                      sx={{ width: 200, height: 64 }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {onRemove && selectedImage && (
            <Button
              variant="outlined"
              onClick={handleRemoveImage}
              color="error"
            >
              Remove picture
            </Button>
          )}
          <Box sx={{ display: 'flex', ml: 'auto', gap: 1 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

const isValidFileType = (fileName) => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExtension = fileName
    .slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2)
    .toLowerCase();
  return validExtensions.includes('.' + fileExtension);
};

export default ImageEditorUpload;
