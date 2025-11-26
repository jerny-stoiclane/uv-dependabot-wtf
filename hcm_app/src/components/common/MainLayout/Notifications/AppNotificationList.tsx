import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AppNotificationListProps {
  notifications: AppNotification[];
  loading: boolean;
  setOpen: (open: boolean) => void;
}

const AppNotificationList: React.FC<AppNotificationListProps> = ({
  notifications,
  loading,
  setOpen,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box py={1} px={3}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  return (
    <List
      component="nav"
      sx={{
        p: 0,
        '& .MuiListItemButton-root': {
          py: 0,
          '&.Mui-selected': {
            bgcolor: 'grey.50',
            color: 'text.primary',
          },
          '& .MuiAvatar-root': {
            width: 36,
            height: 36,
            '& .MuiSvgIcon-root': {
              width: 18,
              height: 18,
            },
          },
          '& .MuiListItemSecondaryAction-root': {
            mt: '6px',
            ml: 1,
            top: 'auto',
            right: 'auto',
            alignSelf: 'flex-start',
            transform: 'none',
            position: 'relative',
          },
        },
      }}
    >
      {notifications.map((notification, index) => (
        <ListItemButton
          onClick={() => {
            if (notification.onClick) {
              notification.onClick();
            } else if (notification.onClickPath) {
              navigate(notification.onClickPath);
            }
            setOpen(false);
          }}
          key={index}
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: notification.iconBgColor || 'error.light',
                color: notification.iconColor || 'error.main',
              }}
            >
              {notification.icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={notification.primaryText}
            secondary={notification.secondaryText}
          />
        </ListItemButton>
      ))}
    </List>
  );
};

export default AppNotificationList;
