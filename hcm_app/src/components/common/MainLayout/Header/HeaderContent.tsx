import { AutoStoriesOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

import { useApiData } from '../../../../hooks/useApiData';
import { useUser } from '../../../../hooks/useUser';
import OpenEnrollmentNotification from '../../../benefits/OpenEnrollmentNotification';
import HandbookSignModal from '../../../dashboard/HandbookSignModal';
import UpdateUserDefinedFieldsModal from '../../../profile/UpdateUserDefinedFieldsModal';
import AppNotification from '../Notifications/AppNotification';
import ClientDropdown from './ClientDropdown';
import HeaderSearch from './HeaderSearch';
import MobileSection from './MobileSection';
import Profile from './Profile';

const HeaderContent: React.FC = () => {
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const [dialogOpen, setDialogOpen] = useState<boolean>(true);
  const [signDialogOpen, setSignDialogOpen] = useState<boolean>(false);
  const [customFieldsModalOpen, setCustomFieldsModalOpen] =
    useState<boolean>(false);

  const { data: handbooks, refresh } = useApiData((api) =>
    api.profiles.getMyHandbooks()
  );

  const { user } = useUser();

  const { data: customFields, refresh: refreshCustomFields } = useApiData(
    (api) => api.profiles.getEmployeeCustomFields()
  );

  const needsActionHBs = handbooks?.filter((hb) =>
    ['pending', 'overdue'].includes(hb.status)
  );
  const hasOverdue = needsActionHBs?.some((ha) => ha.status === 'overdue');

  // Check if user has required custom fields that need to be filled
  const hasRequiredCustomFields = user?.has_required_custom_fields || false;
  const customFieldsData: ProfileCustomFieldValue[] = customFields || [];

  // Show custom fields modal if user has required fields to fill
  useEffect(() => {
    if (hasRequiredCustomFields && customFieldsData.length > 0) {
      setCustomFieldsModalOpen(true);
    }
  }, [hasRequiredCustomFields, customFieldsData.length]);

  return (
    <>
      {!downLG && <HeaderSearch />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          ml: 'auto',
          gap: 1.5,
        }}
      >
        <ClientDropdown />
        <OpenEnrollmentNotification />
        <AppNotification />
        {!downLG && <Profile />}
        {downLG && <MobileSection />}
      </Box>
      {needsActionHBs && needsActionHBs.length > 0 && (
        <>
          <Dialog open={dialogOpen} maxWidth="xs">
            <DialogTitle sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="h4">
                  {hasOverdue
                    ? 'You have overdue handbook assignments!'
                    : 'You have assigned handbooks!'}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              {hasOverdue && (
                <Typography align="center" sx={{ fontWeight: 'bold', my: 1 }}>
                  IMMEDIATE ACTION REQUIRED
                </Typography>
              )}
              <Typography>
                Please review the handbooks and sign the acknowledgement
                statement to complete the process.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => setDialogOpen(false)}>
                Close
              </Button>

              <Button
                startIcon={<AutoStoriesOutlined />}
                variant="contained"
                onClick={() => {
                  setDialogOpen(false);
                  setSignDialogOpen(true);
                }}
              >
                Complete now
              </Button>
            </DialogActions>
          </Dialog>
          {signDialogOpen &&
            needsActionHBs.map((hb, idx) => (
              <HandbookSignModal
                key={`${hb.handbook_id}-${idx}`}
                refresh={refresh}
                handbook={hb}
              />
            ))}
        </>
      )}

      {customFieldsModalOpen && (
        <UpdateUserDefinedFieldsModal
          open={customFieldsModalOpen}
          onClose={() => setCustomFieldsModalOpen(false)}
          refreshProfile={refreshCustomFields}
          customFields={customFieldsData}
          isRequired={true}
        />
      )}
    </>
  );
};

export default HeaderContent;
