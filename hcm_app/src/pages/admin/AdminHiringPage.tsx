import { PageSpinner, useNotifications } from '@armhr/ui';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { AppBar, Box, Button, Modal, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';

const AdminHiringPage: React.FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  const { showNotification } = useNotifications();
  const [prismLoading, setPrismLoading] = useState(false);
  const { data: redirectUrl, loading } = useApiData<string>((api) =>
    api.profiles.getPrismRedirect('HTG_TEST')
  );
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  const handleNewTab = async () => {
    try {
      setPrismLoading(true);
      const resp = await api.profiles.getPrismRedirect('HTG_TEST');
      if (resp) {
        window.open(resp.results, '_blank');
      } else {
        showNotification({
          message:
            'There was an error opening the Back office portal. Refresh and try again',
          severity: 'error',
        });
      }
    } catch (error) {
      showNotification({
        message:
          'There was an error opening the Back office portal. Refresh and try again',
        severity: 'error',
      });
    } finally {
      setPrismLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Applicant Tracking | Armhr</title>
        <meta
          name="description"
          content="Manage job applicants and hiring workflow."
        />
      </Helmet>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="enrollment-modal-title"
        aria-describedby="enrollment-modal-description"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: [0, 1, 4],
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100vw',
            maxWidth: 1920,
            height: ['100vh', 'calc(100vh - 24px)', 'calc(100vh - 96px)'],
            bgcolor: 'background.paper',
          }}
        >
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <strong>Applicant Tracking Software</strong>
              </Typography>
              <LoadingButton
                onClick={handleNewTab}
                sx={{ color: 'inherit', mr: 2 }}
                aria-label="close"
                variant="outlined"
                color="info"
                loading={prismLoading}
              >
                Open in new tab
              </LoadingButton>
              <Button
                onClick={handleClose}
                sx={{ color: 'inherit' }}
                aria-label="close"
                variant="outlined"
                color="info"
                endIcon={<Close />}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
          {loading && <PageSpinner color="secondary" />}
          {redirectUrl && (
            <iframe
              src={redirectUrl}
              title="PrismHR"
              id="prism"
              style={{
                width: '100%',
                height: 'calc(100% - 60px)',
                border: 'none',
                visibility: loading ? 'hidden' : 'visible',
              }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AdminHiringPage;
