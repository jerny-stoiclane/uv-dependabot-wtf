import { Section } from '@armhr/ui';
import { DevicesOther, Email, Home, Phone, Sms } from '@mui/icons-material';
import { Avatar, Box, Grid, Paper, Typography } from '@mui/material';
import { useState } from 'react';

import AddEmergencyContactDialog from './AddEmergencyContactDialog';
import UpdateEmergencyContactsDialog from './UpdateEmergencyContactsDialog';

export const EmergencyContactsTab: React.FC<{
  profile: EmployeeProfile;
  refreshProfile: () => void;
}> = ({ profile, refreshProfile }) => {
  const [open, setOpen] = useState(false);

  const emergencyContactsPrism: FormikEmergencyContact[] =
    (profile?.emergency_contact as FormikEmergencyContact[]) || [];
  const emergencyContacts = emergencyContactsPrism;
  const personChecksum = profile!.miscellaneous.person_checksum;

  return (
    <Section title="Emergency contacts" vertical={true}>
      <Grid container gap={2} rowGap={2}>
        <Grid item xs={6}>
          <Typography variant="body1" gutterBottom>
            Update or add new emergency contacts
          </Typography>
        </Grid>
        <Grid item xs>
          <Box
            sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'flex-end' }}
          >
            <AddEmergencyContactDialog
              open={open}
              onClose={() => setOpen(false)}
              emergencyContacts={emergencyContacts}
              personChecksum={personChecksum}
              refreshProfile={refreshProfile}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {emergencyContacts?.map((contact, index) => (
          <Grid item xs={12} sm={6} key={`ec-${index}`}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                },
              }}
            >
              <Grid container alignItems="start" spacing={2}>
                <Grid item>
                  <Avatar sx={{ width: 36, height: 36, mt: 1 }}>
                    {contact.contact_name?.charAt(0)}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" component="div">
                    {contact.contact_name}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {contact.contact_relationship}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs
                  sx={{ justifyContent: 'flex-end', display: 'flex' }}
                >
                  <UpdateEmergencyContactsDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    emergencyContacts={emergencyContacts}
                    personChecksum={personChecksum}
                    ecIndex={index}
                  />
                </Grid>
              </Grid>
              <Typography
                variant="body1"
                sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
              >
                {{
                  PHONE: <Phone sx={{ mr: 1 }} />,
                  ADDRESS: <Home sx={{ mr: 1 }} />,
                  EMAIL: <Email sx={{ mr: 1 }} />,
                  TEXT: <Sms sx={{ mr: 1 }} />,
                  OTHER: <DevicesOther sx={{ mr: 1 }} />,
                }[contact.contact_type] || null}
                {contact.contact_info}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
};
