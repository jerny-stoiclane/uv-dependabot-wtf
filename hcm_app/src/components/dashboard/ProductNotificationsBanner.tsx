import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import ProductUpdatesModal from '../common/MainLayout/Notifications/ProductUpdatesModal';

const STORAGE_KEY = 'product-notifications-banner-hidden';

const ProductNotificationsBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [openProductUpdates, setOpenProductUpdates] = useState<boolean>(false);

  useEffect(() => {
    const isHidden = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsVisible(!isHidden);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem(STORAGE_KEY, 'true');
    }, 300); // Match the transition duration
  };

  const handleModalClose = () => {
    setOpenProductUpdates(false);
    handleClose(); // Also dismiss the banner when modal is closed
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: '#f4f0ff',
          px: 3,
          py: 1.5,
          borderRadius: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transform: isClosing ? 'translateY(-100%)' : 'translateY(0)',
          opacity: isClosing ? 0 : 1,
          transition: 'all 0.3s ease-in-out',
          overflow: 'hidden',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              bgcolor: '#e0d7fa',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span role="img" aria-label="mobile">
              📱
            </span>
          </Box>
          <Typography variant="subtitle1" fontWeight={600} color="#6c4ccf">
            Product updates!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Introducing the new dashboard experience! See what's new.
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => setOpenProductUpdates(true)}
          >
            Learn more
          </Button>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
            aria-label="Close notification"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <ProductUpdatesModal
        open={openProductUpdates}
        onClose={handleModalClose}
      />
    </>
  );
};

export default ProductNotificationsBanner;
