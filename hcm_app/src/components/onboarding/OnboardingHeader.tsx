import { Avatar, Logo } from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { ChevronLeft, ExpandMore, Home, Logout } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import { paths } from '../../utils/paths';

const OnboardingHeader: React.FC<{
  logoLinkTo?: string;
}> = ({ logoLinkTo }) => {
  const { user, logout } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isOnboarding = location.pathname.includes(paths.onboardingWrapper);

  return (
    <AppBar
      elevation={0}
      component="nav"
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box px={3}>
        <Toolbar disableGutters>
          <Box flexGrow={{ xs: 1, sm: 0, md: 1, lg: 0 }}>
            {isOnboarding ? (
              <Button
                variant="contained"
                to={paths.startOnboarding}
                component={RouterLink}
              >
                <ChevronLeft sx={{ mr: 1 }} />
                Back
              </Button>
            ) : (
              <Link
                component={RouterLink}
                to={logoLinkTo || paths.startOnboarding}
                underline="none"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Logo width={50} />
              </Link>
            )}
          </Box>
          <Box display="flex" marginLeft="auto">
            {user && (
              <>
                <CustomIconButton color="inherit" onClick={handleMenuOpen}>
                  <Stack
                    direction="column"
                    sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                  >
                    <Typography variant="subtitle2" align="right">
                      {user.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      textTransform="none"
                      align="right"
                      sx={{ lineHeight: '1' }}
                    >
                      {user.email}
                    </Typography>
                  </Stack>

                  <Avatar name={user.name} />

                  <ExpandMore />
                </CustomIconButton>

                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={!!anchorEl}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  slotProps={{
                    paper: {
                      sx: {
                        overflow: 'visible',
                        mt: 1,
                        minWidth: 180,
                        boxShadow: 'none',
                        border: '1px solid',
                        borderColor: 'divider',
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate(logoLinkTo || paths.startOnboarding);
                    }}
                  >
                    <ListItemIcon>
                      <Home fontSize="small" />
                    </ListItemIcon>
                    Back to home
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      logout();
                      handleMenuClose();
                    }}
                  >
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: 'auto',
  padding: 0,
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '&:focus': {
    backgroundColor: 'transparent',
  },
}));

export default OnboardingHeader;
