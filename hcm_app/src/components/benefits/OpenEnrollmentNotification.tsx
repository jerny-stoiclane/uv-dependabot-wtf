import { MainCard, Transitions } from '@armhr/ui';
import { Campaign } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import openSvg from '../../assets/open-enrollment.svg';
import { useUser } from '../../hooks/useUser';
import { paths } from '../../utils/paths';

const OpenEnrollmentNotification = () => {
  const anchorRef = useRef<any>(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  if (!user?.enrollment_status?.is_active) {
    return null;
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Button
        color="secondary"
        sx={{
          color: 'text.primary',
          bgcolor: open ? '#dcf0ff' : '#e6f4ff',
          '&:hover': {
            bgcolor: '#dcf0ff',
          },
        }}
        startIcon={<Campaign sx={{ fontSize: 10 }} />}
        ref={anchorRef}
        onClick={handleToggle}
      >
        Open enrollment
      </Button>
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [-90, 9],
              },
            },
          ],
        }}
        disablePortal
      >
        {({ TransitionProps }) => (
          <Transitions
            type="grow"
            position="top"
            in={open}
            {...TransitionProps}
          >
            <ClickAwayListener onClickAway={handleClose}>
              <MainCard elevation={3} border={true} content={false}>
                <Box sx={{ p: 2, pb: 2, display: 'flex' }}>
                  <img width={150} src={openSvg} alt="Welcome" />
                  <Stack>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      Open enrollment is live!
                    </Typography>
                    <Typography variant="h6">
                      Enroll or waive your benefits by{' '}
                      <strong>05/20/2024</strong>.
                    </Typography>
                    <Box
                      sx={{
                        textAlign: 'right',
                        mt: 1,
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        href="https://calendly.com/armhr/2024-open-enrollment"
                        target="_blank"
                      >
                        Schedule 1:1 Enrollment
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setOpen(false);
                          navigate(paths.openEnrollment, {
                            state: { origin: 'notification' },
                          });
                        }}
                      >
                        Go to Self Enrollment
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </MainCard>
            </ClickAwayListener>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default OpenEnrollmentNotification;
