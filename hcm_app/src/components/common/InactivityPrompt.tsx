import {
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';

type InactivityPromptProps = {
  onLogout: () => void;
  onContinue?: () => void;
  timeout?: number;
  promptBeforeIdle?: number;
};

const DEFAULT_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const DEFAULT_PROMPT_BEFORE_IDLE = 30 * 1000; // 30 seconds

const InactivityPrompt: FC<InactivityPromptProps> = ({
  onLogout,
  onContinue,
  timeout = DEFAULT_TIMEOUT,
  promptBeforeIdle = DEFAULT_PROMPT_BEFORE_IDLE,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(timeout);

  const handleOnIdle = () => {
    setModalOpen(true);
    onLogout();
  };

  const handleOnPrompt = () => {
    setModalOpen(true);
  };

  const handleLogout = () => {
    setModalOpen(false);
    onLogout();
  };

  const { reset, getRemainingTime } = useIdleTimer({
    timeout,
    promptBeforeIdle,
    onIdle: handleOnIdle,
    onPrompt: handleOnPrompt,
    throttle: 500,
  });

  const handleContinue = () => {
    reset();
    setModalOpen(false);
    onContinue && onContinue();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = Math.ceil(getRemainingTime() / 1000);
      setRemainingTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const progressValue = (remainingTime / (timeout / 1000)) * 100;
  const value = 100 - progressValue;

  return (
    <Dialog open={modalOpen} onClose={() => {}}>
      <DialogTitle>Are you still there?</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgressWithLabel
            variant="determinate"
            value={value}
            label={remainingTime}
            size={40}
          />
          <Box flexGrow={1}>
            <DialogContentText>
              For security reasons, you will be logged out if you remain
              inactive. <br />
              Please click Continue to stay logged in.
            </DialogContentText>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout} color="primary">
          Logout
        </Button>
        <Button
          onClick={handleContinue}
          color="primary"
          variant="contained"
          autoFocus
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CircularProgressWithLabel = (
  props: CircularProgressProps & { label: number }
) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
      {/* Gray background circle */}
      <CircularProgress
        variant="determinate"
        value={100}
        style={{ position: 'absolute', color: '#dcdcdc' }}
      />
      {/* Foreground circle (progress) */}
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {props.label}s
        </Typography>
      </Box>
    </Box>
  );
};

export default InactivityPrompt;
