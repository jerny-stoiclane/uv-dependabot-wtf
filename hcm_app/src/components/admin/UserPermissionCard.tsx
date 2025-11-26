import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';
import { useState } from 'react';

import { paths } from '../../utils/paths';
import { USER_ROLE_DESCRIPTIONS } from '../../utils/roles';

const UserPermissionCard = ({ user }: { user: UserCardProps }) => {
  const [showAccess, setShowAccess] = useState(false);
  const toggleAccess = () => {
    setShowAccess(!showAccess);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Link
          href={`${paths.profile}/${params.row.employee_id}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ textDecoration: 'none' }}
        >
          <span>{params.value}</span>
        </Link>
      ),
    },
    {
      field: 'employee_id',
      headerName: 'Employee ID',
      width: 120,
    },
    {
      field: 'job_title',
      headerName: 'Job Title',
      flex: 1,
    },
  ];

  const rows =
    user.allowed_employees?.map((employee) => ({
      id: employee.employee_id,
      name: `${employee.first_name} ${employee.last_name}`,
      employee_id: employee.employee_id,
      job_title: employee.job_title,
    })) || [];

  return (
    <Card
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: showAccess ? 'primary.400' : 'divider',
        borderRadius: '8px',
        transition: 'border-color 0.5s ease',
      }}
    >
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        <Box sx={{ width: 200, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {user.name}
              </Typography>
            </Box>
          </Box>

          <Stack spacing={1} direction="row">
            <Box>
              <Typography variant="caption" color="text.secondary">
                Employee ID
              </Typography>
              <Typography variant="body2">{user.employeeId}</Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={2}>
            {user.userRoles.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    whiteSpace: 'nowrap',
                    minWidth: 60,
                  }}
                >
                  User roles
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {user.userRoles.map((role) => (
                    <Tooltip
                      key={role}
                      title={USER_ROLE_DESCRIPTIONS[role]?.desc || role}
                      placement="top"
                      arrow
                    >
                      <Chip
                        label={role}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                          height: '24px',
                          '& .MuiChip-label': {
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            )}

            {user.hrRoles.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    whiteSpace: 'nowrap',
                    minWidth: 60,
                  }}
                >
                  HR roles
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {user.hrRoles.map((role) => (
                    <Chip
                      key={role.code}
                      label={role.desc}
                      size="small"
                      color="default"
                      sx={{
                        height: '24px',
                        bgcolor: 'grey.100',
                        '& .MuiChip-label': {
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        </Box>

        <Box sx={{ flexShrink: 0, ml: 2 }}>
          <Stack spacing={1}>
            {user.allowed_employees && user.allowed_employees.length > 0 && (
              <Button
                onClick={toggleAccess}
                variant="outlined"
                color="primary"
                startIcon={
                  showAccess ? <KeyboardArrowUp /> : <KeyboardArrowDown />
                }
                size="small"
                sx={{
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
              >
                View allowed employees (
                <span style={{ fontWeight: 500 }}>
                  {user.allowed_employees?.length || 0}
                </span>
                )
              </Button>
            )}
          </Stack>
        </Box>
      </Box>

      <Collapse in={showAccess}>
        <Box
          sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            <span>
              Allowed employees (
              <span style={{ fontWeight: 500 }}>
                {user.allowed_employees?.length || 0}
              </span>
              )
            </span>
          </Typography>
          <Box>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.employee_id}
              density="compact"
              disableRowSelectionOnClick
              disableColumnMenu
              autoHeight
              sx={{
                '& .MuiDataGrid-cell': {
                  py: 1,
                  borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                },
                '& .MuiDataGrid-row': {
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                },
                '& .MuiDataGrid-columnHeader': {
                  py: 1,
                  '&:focus': {
                    outline: 'none',
                  },
                },
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-cell:focus-within': {
                  outline: 'none',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid rgba(224, 224, 224, 0.5)',
                },
              }}
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  sx: {
                    p: 1,
                    '& .MuiInputBase-root': {
                      height: '36px',
                    },
                  },
                },
              }}
              initialState={{
                sorting: {
                  sortModel: [{ field: 'name', sort: 'asc' }],
                },
              }}
            />
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

export default UserPermissionCard;
