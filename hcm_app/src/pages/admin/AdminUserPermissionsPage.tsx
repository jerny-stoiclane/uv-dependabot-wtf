import { PageSpinner } from '@armhr/ui';
import { Search as SearchIcon } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import {
  Autocomplete,
  Box,
  Chip,
  InputAdornment,
  Tooltip as MuiTooltip,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';

import UserPasswordResetTab from '../../components/admin/UserPasswordResetTab';
import UserPermissionCard from '../../components/admin/UserPermissionCard';
import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';
import { USER_ROLE_DESCRIPTIONS } from '../../utils/roles';

type FilterState = {
  searchTerm: string;
  selectedUserRoles: string[];
  selectedHrRoles: string[];
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-management-tabpanel-${index}`}
      aria-labelledby={`user-management-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const AdminUserPermissionsPage = () => {
  const { entity } = useUser();
  const [tabValue, setTabValue] = useState(0);
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    selectedUserRoles: [],
    selectedHrRoles: [],
  });

  const { data: userDetails, loading } = useApiData<UserDetails[]>((api) =>
    api.admin.getUserDetails()
  );

  const users = useMemo(() => {
    if (!userDetails) return [];

    return userDetails.map((user) => ({
      name: `${user.employee_first_name} ${user.employee_last_name}`,
      position: user.human_resource_role?.[0]?.desc || 'No position',
      userRoles: user.user_role || [],
      hrRoles: user.human_resource_role || [],
      employeeId: user.employee_id,
      firstName: user.employee_first_name,
      lastName: user.employee_last_name,
      email: user.email,
      allowed_employees: user.allowed_employees,
    }));
  }, [userDetails]);

  const { uniqueUserRoles, uniqueHrRoles } = useMemo(
    () => ({
      uniqueUserRoles: Array.from(
        new Set(users.flatMap((user) => user.userRoles))
      ).sort(),
      uniqueHrRoles: Array.from(
        new Set(users.flatMap((user) => user.hrRoles.map((role) => role.code)))
      ).sort(),
    }),
    [users]
  );

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
      setFilterState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const filteredUsers = useMemo(() => {
    const { searchTerm, selectedUserRoles, selectedHrRoles } = filterState;
    const searchTermLower = searchTerm.toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        [user.name, user.position, user.employeeId].some((field) =>
          field.toLowerCase().includes(searchTermLower)
        );

      const matchesUserRoles =
        selectedUserRoles.length === 0 ||
        selectedUserRoles.some((role) => (user.userRoles || []).includes(role));

      const matchesHrRoles =
        selectedHrRoles.length === 0 ||
        selectedHrRoles.some((role) =>
          user.hrRoles.some((hr) => hr.code === role)
        );

      return matchesSearch && matchesUserRoles && matchesHrRoles;
    });
  }, [users, filterState]);

  const renderRoleTooltip = useCallback(
    (roles: string[], getDescription: (role: string) => string) => (
      <Box sx={{ p: 1 }}>
        {roles.map((role) => (
          <Typography key={role} variant="body2" sx={{ py: 0.5 }}>
            {role}: {getDescription(role)}
          </Typography>
        ))}
      </Box>
    ),
    []
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) return <PageSpinner />;

  return (
    <Box>
      <Helmet>
        <title>User Permissions | Armhr</title>
        <meta
          name="description"
          content="Manage user permissions and account settings for your company."
        />
      </Helmet>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h2">
            <span>{entity?.name || 'Company'}</span>{' '}
            <span>User Management</span>
          </Typography>
          <Typography variant="body1">
            Manage user permissions and account settings for your company.
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="user management tabs"
          >
            <Tab
              label="Permissions"
              id="user-management-tab-0"
              aria-controls="user-management-tabpanel-0"
            />
            <Tab
              label="Password Reset"
              id="user-management-tab-1"
              aria-controls="user-management-tabpanel-1"
            />
          </Tabs>
        </Box>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', md: 'flex-start' },
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              flex: { xs: '1', md: '1' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                minWidth: { sm: 'auto' },
              }}
            >
              <TextField
                placeholder="Search"
                value={filterState.searchTerm}
                onChange={(e) =>
                  handleFilterChange('searchTerm', e.target.value)
                }
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: '100%', sm: '400px' },
                }}
              />
            </Box>
            <Autocomplete
              multiple
              options={uniqueUserRoles}
              value={filterState.selectedUserRoles}
              onChange={(_, newValue) =>
                handleFilterChange('selectedUserRoles', newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  placeholder="Filter by user roles"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.length > 1 ? (
                  <MuiTooltip
                    title={renderRoleTooltip(
                      value,
                      (role) => USER_ROLE_DESCRIPTIONS[role]?.desc || role
                    )}
                    arrow
                  >
                    <Chip
                      {...getTagProps({ index: 0 })}
                      size="small"
                      label={`${value.length} roles selected`}
                      onDelete={() =>
                        handleFilterChange('selectedUserRoles', [])
                      }
                      data-testid="user-role-filter-multiple"
                    />
                  </MuiTooltip>
                ) : (
                  value.map((option, index) => (
                    <MuiTooltip
                      key={option}
                      title={USER_ROLE_DESCRIPTIONS[option]?.desc || option}
                      arrow
                    >
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option}
                        size="small"
                        data-testid={`user-role-filter-${option}`}
                      />
                    </MuiTooltip>
                  ))
                )
              }
              renderOption={(props, option, { selected }) => (
                <li {...props} data-testid={`user-role-option-${option}`}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      width: '100%',
                      py: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {selected && (
                        <CheckIcon
                          sx={{
                            fontSize: 20,
                            color: 'primary.main',
                          }}
                        />
                      )}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: selected ? 500 : 400,
                          color: selected ? 'primary.main' : 'text.primary',
                        }}
                      >
                        {USER_ROLE_DESCRIPTIONS[option]?.desc || option}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          fontWeight: selected ? 500 : 400,
                        }}
                      >
                        {option}
                      </Typography>
                    </Box>
                  </Box>
                </li>
              )}
              sx={{
                minWidth: { xs: '100%', sm: 250 },
                flex: { sm: 1 },
              }}
              size="small"
            />

            <Autocomplete
              multiple
              options={uniqueHrRoles}
              value={filterState.selectedHrRoles}
              onChange={(_, newValue) =>
                handleFilterChange('selectedHrRoles', newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  placeholder="Filter by HR roles"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.length > 1 ? (
                  <MuiTooltip
                    title={renderRoleTooltip(value, (role) => {
                      const matchingUser = users.find((user) =>
                        user.hrRoles.some((hr) => hr.code === role)
                      );
                      return (
                        matchingUser?.hrRoles.find((hr) => hr.code === role)
                          ?.desc || role
                      );
                    })}
                    arrow
                  >
                    <Chip
                      {...getTagProps({ index: 0 })}
                      size="small"
                      label={`${value.length} roles selected`}
                      onDelete={() => handleFilterChange('selectedHrRoles', [])}
                    />
                  </MuiTooltip>
                ) : (
                  value.map((option, index) => {
                    const matchingUser = users.find((user) =>
                      user.hrRoles.some((role) => role.code === option)
                    );
                    const roleDesc = matchingUser?.hrRoles.find(
                      (role) => role.code === option
                    )?.desc;
                    return (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={roleDesc || option}
                        size="small"
                        data-testid={`hr-role-filter-${option}`}
                      />
                    );
                  })
                )
              }
              renderOption={(props, option, { selected }) => {
                const matchingUser = users.find((user) =>
                  user.hrRoles.some((role) => role.code === option)
                );
                const roleDesc = matchingUser?.hrRoles.find(
                  (role) => role.code === option
                )?.desc;
                return (
                  <li {...props}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: '100%',
                        py: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        {selected && (
                          <CheckIcon
                            sx={{
                              fontSize: 20,
                              color: 'primary.main',
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: selected ? 500 : 400,
                          color: selected ? 'primary.main' : 'text.primary',
                        }}
                      >
                        {roleDesc || option}
                      </Typography>
                    </Box>
                  </li>
                );
              }}
              sx={{
                minWidth: { xs: '100%', sm: 250 },
                flex: { sm: 1 },
              }}
              size="small"
            />
          </Box>
        </Box>

        <Stack spacing={2}>
          {filteredUsers.map((user) => (
            <UserPermissionCard key={user.employeeId} user={user} />
          ))}
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <UserPasswordResetTab />
      </TabPanel>
    </Box>
  );
};

export default AdminUserPermissionsPage;
