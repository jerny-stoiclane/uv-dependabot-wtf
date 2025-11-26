import { PageSpinner } from '@armhr/ui';
import { ArrowBack } from '@mui/icons-material';
import { AppBar, Box, Button, Modal, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';

import OpenEnrollmentCard from '../../components/dashboard/OpenEnrollmentCard';
import { useApiData } from '../../hooks/useApiData';

const OpenEnrollmentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: redirectUrl, refresh } = useApiData<string>((api) =>
    api.benefits.getOpenEnrollmentRedirect(location.state?.origin)
  );
  const [open, setOpen] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  useEffect(() => {
    // we want to show the spinner for at least 5 seconds while ALSO loading
    // the iframe in the background because Prism takes over 10 seconds to load on its own
    if (open && redirectUrl) {
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [open, redirectUrl]);

  return (
    <>
      <Helmet>
        <title>Open Enrollment | Armhr</title>
        <meta
          name="description"
          content="Complete your open enrollment for benefits."
        />
      </Helmet>
      <OpenEnrollmentCard
        onClick={() => {
          refresh();
          setOpen(true);
        }}
      />
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
                <strong>Benefits Enrollment</strong>
              </Typography>
              <Button
                onClick={handleClose}
                sx={{ color: 'inherit' }}
                aria-label="close"
                variant="outlined"
                color="info"
                startIcon={<ArrowBack />}
              >
                Back to Employee Portal
              </Button>
            </Toolbar>
          </AppBar>
          {showSpinner && <PageSpinner color="secondary" />}
          {redirectUrl && (
            <>
              <Box
                sx={{
                  background: 'white',
                  position: 'absolute',
                  top: 70,
                  right: 20,
                  width: '280px',
                  height: '52px',
                  content: '""',
                  '@media (max-width: 1462px)': {
                    width: '120px',
                  },
                  '@media (max-width: 1087px)': {
                    display: 'none',
                  },
                }}
              >
                {/* this is an empty div to hide the logout button on the iframe */}
              </Box>
              <iframe
                src={redirectUrl}
                title="PrismHR"
                id="prism"
                style={{
                  width: '100%',
                  height: 'calc(100% - 60px)',
                  border: 'none',
                  visibility: showSpinner ? 'hidden' : 'visible',
                }}
              />
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default OpenEnrollmentPage;
