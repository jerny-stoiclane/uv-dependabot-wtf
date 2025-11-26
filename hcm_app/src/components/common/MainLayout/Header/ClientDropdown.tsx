import { Avatar } from '@armhr/ui';
import { UnfoldMoreRounded } from '@mui/icons-material';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useState } from 'react';

import { useUser } from '../../../../hooks/useUser';

const CLIENT_NAME_OVERRIDES: Record<string, string> = {
  '623029': 'Acqualina Resort and Residences Executive',
};

const ClientDropdown: React.FC = () => {
  const { entity, entities, refreshEntity } = useUser();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (!entities || entities.length <= 1) {
    return null;
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClientChange = (entity: ClientEntity) => {
    refreshEntity(entity);
    handleMenuClose();
  };

  const getDisplayName = (entity: ClientEntity | undefined) => {
    if (!entity) return 'Choose a company';
    if (!entity.client_id)
      return entity.name || entity.client_name || 'Unknown Company';
    return (
      CLIENT_NAME_OVERRIDES[entity.client_id] ||
      entity.name ||
      entity.client_name ||
      'Unknown Company'
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <StyledButton
        aria-controls="client-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
        sx={{
          alignItems: 'center',
          ...(open && {
            backgroundColor: theme.palette.action.selected,
          }),
        }}
      >
        {entity ? (
          <>
            <TruncatedText>{getDisplayName(entity)}</TruncatedText>
          </>
        ) : (
          <Box sx={{ whiteSpace: 'nowrap' }}>Choose a company</Box>
        )}
        <Box sx={{ ml: 'auto', pl: 1, display: 'flex', alignItems: 'center' }}>
          <UnfoldMoreRounded sx={{ ml: 1, fontSize: '14px !important' }} />
        </Box>
      </StyledButton>

      <Menu
        id="client-menu"
        anchorEl={anchorEl}
        keepMounted
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        disableScrollLock
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              marginTop: '9px',
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'divider',
            },
          },
        }}
      >
        {entities?.map((entity, i) => (
          <MenuItem
            key={`${entity.client_id}-${i}`}
            onClick={() => handleClientChange(entity)}
          >
            <Avatar
              name={getDisplayName(entity)}
              sx={{ width: 24, height: 24, fontSize: 12, mr: 1 }}
            />{' '}
            <Box sx={{ whiteSpace: 'nowrap' }}>{getDisplayName(entity)}</Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

const StyledButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  padding: '8px',
  fontSize: '14px',
  fontWeight: 500,
  width: '100%',
  color: '#000',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const TruncatedText = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
  textAlign: 'left',
  pr: 1,
});

export default ClientDropdown;
