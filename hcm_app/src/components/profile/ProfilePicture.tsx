import { CameraOutlined } from '@mui/icons-material';
import { Avatar, Box, Stack, Typography } from '@mui/material';

import { useApi } from '../../hooks/useApi';
import { useUser } from '../../hooks/useUser';
import ImageEditorUpload from '../common/ImageEditorUpload';

const ProfilePicture: React.FC<{
  profile: EmployeeProfile;
  refreshProfile: () => void;
}> = ({ profile, refreshProfile }) => {
  const { refresh: refreshUser } = useUser();
  const api = useApi();

  const handleSave = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob!, `${profile?.id}.png`);

    try {
      await api.profiles.uploadProfilePicture(formData);
      refreshUser();
      refreshProfile();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <ImageEditorUpload
        editorHeight={248}
        editorWidth={248}
        editorBorderRadius={248}
        initialImage={profile?.profile_picture || ''}
        onRemove={async () => {
          try {
            await api.profiles.deleteProfilePicture();
            refreshUser();
            refreshProfile();
          } catch (error) {
            console.error(error);
          }
        }}
        previewComponent={({ previewImage }) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" mb={2}>
              Preview:
            </Typography>
            <Avatar
              src={previewImage!}
              sx={{ width: 100, height: 100, borderRadius: '50%', mb: 2 }}
            />
            <Avatar
              src={previewImage!}
              sx={{ width: 50, height: 50, borderRadius: '50%' }}
            />
          </Box>
        )}
        onSave={handleSave}
      >
        <Box
          sx={{
            position: 'relative',
            margin: 'auto',
            width: 124,
            height: 124,
            borderRadius: '50%',
            overflow: 'hidden',
            '&:hover > .editor-overlay': {
              opacity: 1,
            },
            cursor: 'pointer',
          }}
        >
          <Avatar
            alt="Avatar"
            src={profile?.profile_picture || ''}
            sx={{ width: 124, height: 124, m: 'auto' }}
          />
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
            }}
          >
            <CameraOutlined style={{ color: 'white', fontSize: '2rem' }} />
          </Box>
        </Box>
      </ImageEditorUpload>

      <Stack my={2} spacing={0.5} alignItems="center">
        <Typography variant="h5">
          {profile?.nickname || profile?.first_name} {profile?.last_name}
        </Typography>
        <Typography color="secondary">
          {profile?.position?.employee_title}
        </Typography>
      </Stack>
    </Box>
  );
};

export default ProfilePicture;
