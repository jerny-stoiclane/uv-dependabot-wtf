import { Avatar, Transitions } from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  ButtonBase,
  Card,
  CardContent,
  ClickAwayListener,
  Divider,
  Grid,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef, useState } from 'react';

import { useUser } from '../../../../hooks/useUser';
import { getDisplayName } from '../../../../utils/profile';
import ProfileTab from './ProfileTab';

const Profile = () => {
  const theme = useTheme();
  const { user } = useUser();
  const { logout } = useAuth0();
  const anchorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event?: MouseEvent | TouchEvent) => {
    if (
      event &&
      anchorRef.current &&
      anchorRef.current.contains(event.target)
    ) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen =
    theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';

  return (
    <Box sx={{ flexShrink: 0 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          border: '1px solid transparent',
          borderRadius: 1,
          '&:hover': {
            bgcolor:
              theme.palette.mode === 'dark' ? 'secondary.light' : 'grey.50',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2,
          },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar
            sx={{ width: 24, height: 24, fontSize: 12 }}
            src={user?.profile_picture}
            name={getDisplayName(user!)}
          />
          <Typography variant="subtitle1">{getDisplayName(user!)}</Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            type="grow"
            position="top-right"
            in={open}
            {...TransitionProps}
          >
            <Box
              sx={{
                width: 290,
                minWidth: 240,
                maxWidth: 290,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 250,
                },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Card>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item>
                        <Stack
                          direction="row"
                          spacing={1.25}
                          alignItems="center"
                        >
                          <Avatar
                            name={getDisplayName(user!)}
                            src={user?.profile_picture}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Stack>
                            <Typography variant="h6">
                              {getDisplayName(user!)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {user?.login_email}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <ProfileTab onClose={handleClose} onLogout={handleLogout} />
                </Card>
              </ClickAwayListener>
            </Box>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
