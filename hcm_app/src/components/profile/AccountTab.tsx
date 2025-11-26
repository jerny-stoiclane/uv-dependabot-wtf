import { Section } from '@armhr/ui';
import PhoneIcon from '@mui/icons-material/Phone';
import SecurityIcon from '@mui/icons-material/Security';
import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';

import { useUser } from '../../hooks/useUser';
import UpdateEmailDialog from './UpdateEmailDialog';
import UpdatePasswordDialog from './UpdatePasswordDialog';

export const AccountTab: React.FC<{ profile: EmployeeProfile }> = ({
  profile,
}) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const { handleChange, setFieldValue, values } =
    useFormikContext<ProfileFormValues>();

  const handlePreferredEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFieldValue('primary_email_source', event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Section title="Account information" vertical={true}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              Change your Armhr account information and settings.
            </Typography>
          </Grid>

          <Grid item xs>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mb: 2,
                justifyContent: 'flex-end',
              }}
            >
              <UpdateEmailDialog
                open={open}
                onClose={() => setOpen(false)}
                email={user?.login_email!}
              />
              <UpdatePasswordDialog />
            </Box>
          </Grid>
        </Grid>
        <Grid container gap={2} mb={3} alignItems="center">
          <Grid item xs>
            <Box
              sx={{
                display: 'flex',
                position: 'relative',
                flexDirection: 'column',
                gap: 1,
                border: '1px solid transparent',
                padding: '1rem',
                borderRadius: '5px',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.875rem',
                  lineHeight: '1.4375em',
                  fontWeight: 400,
                  padding: 0,
                  position: 'absolute',
                  background: 'white',
                  display: 'block',
                  transformOrigin: 'top left',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 'calc(133% - 32px)',
                  left: 0,
                  top: 0,
                  transform: 'translate(14px, -9px) scale(0.75)',
                  zIndex: 1,
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  color: '#595959',
                }}
              >
                Armhr account email
              </Typography>
              <Typography>{profile?.login_email}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <FormControl>
              <RadioGroup
                row
                name="primary_email_source"
                value={values.primary_email_source}
                onChange={handlePreferredEmailChange}
              >
                <FormControlLabel
                  value="P"
                  control={<Radio />}
                  label="Use as Preferred email"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container gap={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              type="text"
              name="work_email_address"
              label="Work email address"
              onChange={handleChange}
              value={values.work_email_address}
            />
          </Grid>
          <Grid item>
            <FormControl>
              <RadioGroup
                row
                name="primary_email_source"
                value={values.primary_email_source}
                onChange={handlePreferredEmailChange}
              >
                <FormControlLabel
                  value="W"
                  control={<Radio />}
                  label="Use as Preferred email"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Section>

      <Section title="Account security" vertical={true}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              Your account security settings and multi-factor authentication
              status.
            </Typography>
          </Grid>
        </Grid>
        <Grid container gap={2} mb={2}>
          <Grid item xs>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                Multi-factor authentication
              </Typography>
              {getMFADisplay(profile?.mfa_authenticators)}
            </Box>
          </Grid>
        </Grid>
        {!!profile?.mfa_authenticators?.length && (
          <Grid container>
            <Grid item xs>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Need to reset your MFA?
                </Typography>
                <Typography variant="body1" paragraph>
                  If you've lost access to your authenticator app or changed
                  your phone number, you'll need to reset your multi-factor
                  authentication. This helps keep your account secure by
                  ensuring only you can access it.
                </Typography>
                <Typography variant="body1">
                  Email{' '}
                  <Link
                    href="mailto:security@armhr.com"
                    color="primary"
                    underline="always"
                  >
                    security@armhr.com
                  </Link>{' '}
                  with your employee ID and we'll help you set it up again.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Section>
    </Box>
  );
};

const getMFADisplay = (authenticators: MFAAuthenticator[] | undefined) => {
  if (!authenticators?.length) {
    return (
      <Typography color="text.secondary" variant="body2">
        Not enabled
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
      {authenticators.map((auth) => {
        if (auth.type === 'totp') {
          return (
            <Chip
              key={`${auth.id}-${auth.type}`}
              icon={<SecurityIcon />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Authenticator App
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    • Last used{' '}
                    {new Date(auth.last_auth_at || '').toLocaleDateString()}
                  </Typography>
                </Box>
              }
              color="primary"
              variant="outlined"
              sx={{
                '& .MuiChip-label': {
                  px: 1.5,
                  py: 0.5,
                },
                '& .MuiChip-icon': {
                  color: 'primary.main',
                  ml: 1,
                },
                height: 'auto',
                minHeight: 40,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'action.hover',
                },
              }}
            />
          );
        }
        if (auth.type === 'sms') {
          return (
            <Chip
              key={auth.id}
              icon={<PhoneIcon />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    SMS
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    • {auth.name}
                  </Typography>
                </Box>
              }
              color="primary"
              variant="outlined"
              sx={{
                '& .MuiChip-label': {
                  px: 1.5,
                  py: 0.5,
                },
                '& .MuiChip-icon': {
                  color: 'primary.main',
                  ml: 1,
                },
                height: 'auto',
                minHeight: 40,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'action.hover',
                },
              }}
            />
          );
        }
        return null;
      })}
    </Box>
  );
};
