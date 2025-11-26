import { BellOutlined } from '@ant-design/icons';
import { MainCard, Transitions } from '@armhr/ui';
import {
  Badge,
  Box,
  ClickAwayListener,
  IconButton,
  Popper,
  keyframes,
  useTheme,
} from '@mui/material';
import React, { useRef, useState } from 'react';

import { PRODUCT_UPDATES_READ_KEY } from '../../../../utils/constants';
import AppNotificationList from './AppNotificationList';
import ProductUpdatesModal from './ProductUpdatesModal';
import useAppNotifications from './useAppNotifications';

const AppNotification: React.FC = () => {
  const theme = useTheme();
  const { notifications, loading, notificationCount } = useAppNotifications();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openProductUpdates, setOpenProductUpdates] = useState<boolean>(false);

  const handleCloseProductUpdates = () => {
    setOpenProductUpdates(false);
    localStorage.setItem(PRODUCT_UPDATES_READ_KEY, 'true');
  };

  // hack for now to setup the onClick for product updates modal
  const enhancedNotifications = notifications.map((notif) => {
    if (notif.type === 'productUpdates') {
      return {
        ...notif,
        onClick: () => setOpenProductUpdates(true),
      };
    }
    return notif;
  });

  return (
    <Box sx={{ flexShrink: 0 }}>
      <IconButton
        color="secondary"
        sx={{
          color: 'text.primary',
          bgcolor: open ? 'grey.300' : 'grey.100',
          '& .anticon-bell svg': {
            animation: !loading ? `${ring} 1.2s ease-in-out` : '',
          },
        }}
        ref={anchorRef}
        onClick={() => setOpen((prevOpen) => !prevOpen)}
      >
        <Badge
          badgeContent={loading ? 0 : notificationCount}
          sx={{ animation: `${fadeIn} 0.5s ease-in-out` }}
          color="primary"
          variant={loading ? 'dot' : 'standard'}
        >
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Transitions
            position="top"
            type="grow"
            in={open}
            {...TransitionProps}
          >
            <Box
              sx={{
                width: '100%',
                minWidth: 350,
                maxWidth: 420,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285,
                },
              }}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MainCard title="Notifications" content={false}>
                  <AppNotificationList
                    notifications={enhancedNotifications}
                    loading={loading}
                    setOpen={setOpen}
                  />
                </MainCard>
              </ClickAwayListener>
            </Box>
          </Transitions>
        )}
      </Popper>
      <ProductUpdatesModal
        open={openProductUpdates}
        onClose={handleCloseProductUpdates}
      />
    </Box>
  );
};

const ring = keyframes`
  0%, 100% { transform: rotate(0); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
  20%, 40%, 60%, 80% { transform: rotate(10deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export default AppNotification;
