import { ConfirmationDialog, PageSpinner, useNotifications } from '@armhr/ui';
import { Key as KeyIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';

type FilterState = {
  searchTerm: string;
};

const UserPasswordResetTab = () => {
  const { showNotification } = useNotifications();
  const api = useApi();
  const { user } = useUser();
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
  });
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    employeeId: string;
    userName: string;
  }>({
    open: false,
    employeeId: '',
    userName: '',
  });

  const { data: userDetails, loading } = useApiData<UserDetails[]>((api) =>
    api.admin.getUserDetails()
  );

  const users = useMemo(() => {
    if (!userDetails) return [];

    const currentUser = userDetails.find((c) => c.employee_id === user?.id);

    if (!currentUser || !currentUser.allowed_employees || !user) return [];

    return currentUser.allowed_employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      employeeId: employee.employee_id,
      firstName: employee.first_name,
      lastName: employee.last_name,
    }));
  }, [userDetails, user]);

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
      setFilterState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const filteredUsers = useMemo(() => {
    const { searchTerm } = filterState;
    const searchTermLower = searchTerm.toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        [user.name, user.employeeId].some((field) =>
          field?.toLowerCase().includes(searchTermLower)
        );

      return matchesSearch;
    });
  }, [users, filterState]);

  const handleSendPasswordReset = useCallback(
    async (employeeId: string) => {
      setLoadingStates((prev) => ({ ...prev, [employeeId]: true }));

      try {
        await api.admin.sendPasswordReset({ id: employeeId });

        showNotification({
          message: `Password reset email sent to employee ${employeeId}`,
          severity: 'success',
        });
      } catch (error) {
        console.error('Error sending password reset email:', error);
        showNotification({
          message: 'Failed to send password reset email.',
          severity: 'error',
        });
      } finally {
        setLoadingStates((prev) => ({ ...prev, [employeeId]: false }));
      }
    },
    [showNotification, api]
  );

  const handleSendPasswordResetClick = useCallback(
    (employeeId: string, userName: string) => {
      setConfirmationDialog({
        open: true,
        employeeId,
        userName,
      });
    },
    []
  );

  const handleConfirmSendPasswordReset = useCallback(() => {
    const { employeeId } = confirmationDialog;
    handleSendPasswordReset(employeeId);
    setConfirmationDialog((prev) => ({ ...prev, open: false }));
  }, [confirmationDialog, handleSendPasswordReset]);

  if (loading) return <PageSpinner />;

  return (
    <Box>
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Select an employee below to send them a password reset link via
            email. They will receive instructions to create a new password.
          </Typography>
        </Alert>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <TextField
            placeholder="Search by name or employee ID"
            value={filterState.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%' },
            }}
          />
        </Box>
      </Box>

      <Stack spacing={2}>
        {filteredUsers.map((user) => (
          <Box
            key={user.employeeId}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'grey.600',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={500}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.employeeId}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={
                  loadingStates[user.employeeId] ? (
                    <CircularProgress size={16} />
                  ) : (
                    <KeyIcon />
                  )
                }
                onClick={() =>
                  handleSendPasswordResetClick(user.employeeId, user.name)
                }
                disabled={loadingStates[user.employeeId]}
                size="small"
              >
                Send Reset Link
              </Button>
            </Box>
          </Box>
        ))}
      </Stack>

      <ConfirmationDialog
        open={confirmationDialog.open}
        onClose={() =>
          setConfirmationDialog((prev) => ({ ...prev, open: false }))
        }
        onConfirm={handleConfirmSendPasswordReset}
        title="Send password reset email"
        message={
          <>
            Are you sure you want to send a password reset email to{' '}
            <strong>{confirmationDialog.userName}</strong>?
          </>
        }
        confirmText="Send reset email"
        cancelText="Cancel"
      />
    </Box>
  );
};

export default UserPasswordResetTab;
