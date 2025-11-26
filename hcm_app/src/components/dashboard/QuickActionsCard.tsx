import {
  CreditCardOutlined,
  DescriptionOutlined,
  EditOutlined,
  ReceiptOutlined,
} from '@mui/icons-material';
import { Box, Card, IconButton, Typography, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { paths } from '../../utils/paths';

interface QuickAction {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
}

const QuickActionsCard: React.FC = () => {
  const theme = useTheme();

  const quickActions: QuickAction[] = [
    {
      id: 'update-profile',
      title: 'Update profile',
      icon: EditOutlined,
      path: paths.profile,
      color: theme.palette.primary.main,
    },
    {
      id: 'view-pay-history',
      title: 'View pay history',
      icon: DescriptionOutlined,
      path: paths.payroll,
      color: theme.palette.warning.main,
    },
    {
      id: 'manage-direct-deposit',
      title: 'Direct deposit',
      icon: CreditCardOutlined,
      path: paths.directDeposit,
      color: theme.palette.secondary.main,
    },
    {
      id: 'update-tax-info',
      title: 'Tax withholding',
      icon: ReceiptOutlined,
      path: paths.taxWithholding,
      color: theme.palette.error.main,
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        border: '1px solid #f3f3f3',
        background: 'white',
      }}
    >
      <Typography
        variant="h5"
        color="text.primary"
        sx={{
          mb: 2,
        }}
      >
        Quick actions
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}
      >
        {quickActions.map((action) => (
          <IconButton
            key={action.id}
            component={RouterLink}
            to={action.path}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2.5,
              borderRadius: 2,
              background: '#f8fafc',
              border: '1px solid #f1f3f4',
              flex: 1,
              minHeight: 80,
              transition: 'all 0.15s ease-out',
              '&:hover': {
                background: '#f1f5f9',
                borderColor: `${action.color}40`,
                transform: 'translateY(-1px)',
                boxShadow: `0 1px 4px ${action.color}10`,
              },
              '&:active': {
                transform: 'translateY(0)',
                transition: 'all 0.1s ease-out',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: action.color,
                  color: 'white',
                  mb: 0.25,
                  transition: 'all 0.15s ease-out',
                }}
              >
                <action.icon sx={{ fontSize: 16 }} />
              </Box>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.primary"
                textAlign="center"
                sx={{
                  fontSize: '0.7rem',
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                  userSelect: 'none',
                }}
              >
                {action.title}
              </Typography>
            </Box>
          </IconButton>
        ))}
      </Box>
    </Card>
  );
};

export default QuickActionsCard;
