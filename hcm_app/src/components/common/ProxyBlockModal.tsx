import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import React from 'react';

interface ProxyBlockModalProps {
  open: boolean;
  onClose: () => void;
  actionType?: 'POST' | 'DELETE';
}

const ProxyBlockModal: React.FC<ProxyBlockModalProps> = ({
  open,
  onClose,
  actionType = 'POST',
}) => {
  const getActionDescription = () => {
    if (actionType === 'POST') {
      return 'create or update data';
    } else if (actionType === 'DELETE') {
      return 'delete data';
    } else {
      return 'perform this action';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Action not allowed
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            You are currently proxying into another user
          </Typography>
        </Alert>

        <DialogContentText>
          <Typography variant="body1" paragraph>
            For security reasons, you cannot {getActionDescription()} while
            proxying into another user.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            This restriction helps prevent accidental data modifications that
            could affect the proxied user's account.
          </Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Understood
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProxyBlockModal;
