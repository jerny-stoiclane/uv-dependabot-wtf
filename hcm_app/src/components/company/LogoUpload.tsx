import { FileUpload } from '@mui/icons-material';
import { Avatar, Box, Typography } from '@mui/material';

import { useApi } from '../../hooks/useApi';
import { useUser } from '../../hooks/useUser';
import ImageEditorUpload from '../common/ImageEditorUpload';

const LogoUpload = () => {
  const { company, refresh } = useUser();
  const api = useApi();

  const handleLogoSave = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob!, 'logo.png');

    try {
      await api.company.uploadLogo(formData);
      refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ImageEditorUpload
      editorHeight={128}
      editorWidth={400}
      onSave={handleLogoSave}
    >
      <Box
        sx={{
          position: 'relative',
          margin: 'auto',
          width: 200,
          height: 64,
          overflow: 'hidden',
          '&:hover > .editor-overlay': {
            opacity: 1,
          },
          cursor: 'pointer',
        }}
      >
        <Avatar
          alt="Avatar"
          src={company?.logo_url || ''}
          variant={company?.logo_url ? 'square' : 'rounded'}
          sx={{ width: 200, height: 64, m: 'auto' }}
        >
          <FileUpload style={{ color: 'white', fontSize: '2rem' }} />
          <Typography variant="body1" color="white">
            Upload logo
          </Typography>
        </Avatar>
        <Box
          className="editor-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 1000,
            opacity: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.3s',
            borderRadius: '4px',
          }}
        >
          <FileUpload style={{ color: 'white', fontSize: '2rem' }} />
          <Typography variant="body1" color="white">
            Upload logo
          </Typography>
        </Box>
      </Box>
    </ImageEditorUpload>
  );
};

export default LogoUpload;
