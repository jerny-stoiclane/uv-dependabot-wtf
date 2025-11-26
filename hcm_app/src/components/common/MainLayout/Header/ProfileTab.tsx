import {
  EditOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import {
  Badge,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PRODUCT_UPDATES_READ_KEY } from '../../../../utils/constants';
import { paths } from '../../../../utils/paths';
import ProductUpdatesModal from '../Notifications/ProductUpdatesModal';

const ProfileTab = ({
  onClose,
  onLogout,
}: {
  onClose: () => void;
  onLogout: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openProductUpdates, setOpenProductUpdates] = useState(false);

  const handleSupport = () => {
    window.location.href = 'mailto:hr@armhr.com';
  };

  const handleCloseProductUpdates = () => {
    setOpenProductUpdates(false);
    localStorage.setItem(PRODUCT_UPDATES_READ_KEY, 'true');
  };

  return (
    <>
      <List
        component="nav"
        sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}
      >
        <ListItemButton
          selected={location.pathname === '/profiles'}
          onClick={() => {
            navigate(paths.profile);
            onClose();
          }}
        >
          <ListItemIcon>
            <EditOutlined />
          </ListItemIcon>
          <ListItemText primary="Edit profile" />
        </ListItemButton>
        <ListItemButton onClick={handleSupport}>
          <ListItemIcon>
            <QuestionCircleOutlined />
          </ListItemIcon>
          <ListItemText primary="Support" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            setOpenProductUpdates(true);
          }}
        >
          <ListItemIcon>
            <SolutionOutlined />
          </ListItemIcon>
          <ListItemText primary="Product updates" />
          <ListItemSecondaryAction>
            <Badge
              color="primary"
              variant="dot"
              invisible={!!localStorage.getItem(PRODUCT_UPDATES_READ_KEY)}
            />
          </ListItemSecondaryAction>
        </ListItemButton>
        <ListItemButton onClick={onLogout}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>

      <ProductUpdatesModal
        open={openProductUpdates}
        onClose={handleCloseProductUpdates}
      />
    </>
  );
};

export default ProfileTab;
