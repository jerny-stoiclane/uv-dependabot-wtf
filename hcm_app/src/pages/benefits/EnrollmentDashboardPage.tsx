import { Avatar, PageSpinner, useNotifications } from '@armhr/ui';
import { FilterList, Search } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Link,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { green, grey, orange } from '@mui/material/colors';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { startCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink } from 'react-router-dom';

import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';
import { formatDate } from '../../utils/date';

const statusColors = {
  not_started: grey[300],
  in_progress: orange[200],
  completed: green[400],
};

const EnrollmentDashboardPage: React.FC = () => {
  const { user } = useUser();
  const {
    data: employees,
    loading,
    error,
  } = useApiData((api) => api.benefits.getEnrollmentDashboard());
  const { showNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedStatuses, setSelectedStatuses] = useState<EnrollmentStatus[]>([
    'not_started',
    'in_progress',
    'completed',
  ]);

  useEffect(() => {
    if (!loading && error) {
      showNotification({ message: true, severity: 'error' });
    }
  }, [loading, error, showNotification]);

  const filteredEmployees = employees?.filter(
    (emp) =>
      emp.armhr_enrollment_status &&
      selectedStatuses.includes(emp.armhr_enrollment_status) &&
      `${emp.prism_employee_first_name} ${emp.prism_employee_last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const statusOptions: EnrollmentStatus[] = [
    'not_started',
    'in_progress',
    'completed',
  ];

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'profile_picture',
      headerName: '',
      width: 48,
      minWidth: 48,
      renderCell: (params) => {
        const profile = params.row;
        return (
          <Link
            component={RouterLink}
            to={`/profile/${profile.prism_employee_id}`}
            underline="none"
            sx={{
              display: 'inline-block',
              mr: 1,
            }}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              firstName={profile.prism_employee_first_name}
              lastName={profile.prism_employee_last_name}
            />
          </Link>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (params) =>
        `${params.row.prism_employee_first_name} ${params.row.prism_employee_last_name}`,
    },
    {
      field: 'armhr_enrollment_status',
      headerName: 'Status',
      minWidth: 150,
      renderCell: (params) => {
        return (
          <>
            <CircleIcon
              sx={{
                color: statusColors[params.row.armhr_enrollment_status],
                fontSize: '10px',
                display: 'inline-block',
                mr: 1,
              }}
            />
            <Typography variant="body1" sx={{ display: 'inline-block' }}>
              {startCase(params.row.armhr_enrollment_status)}
            </Typography>
          </>
        );
      },
    },
    {
      field: 'work_email',
      headerName: 'Email',
      flex: 1,
      renderCell: (params) => {
        const mailto =
          params.row.prism_employee_work_email_address ||
          params.row.prism_employee_email_address;
        return (
          <Link href={`mailto:${mailto}`} target="_blank" underline="none">
            {mailto}
          </Link>
        );
      },
    },
    {
      field: 'prism_employee_home_phone',
      headerName: 'Home phone',
      minWidth: 150,
    },
    {
      field: 'prism_employee_mobile_phone',
      headerName: 'Mobile phone',
      minWidth: 150,
    },
    {
      field: 'action',
      headerName: '',
      headerAlign: 'right',
      sortable: false,
      align: 'right',
      filterable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'flex-end',
            }}
          >
            <Link
              component={RouterLink}
              to={`/profile/${params.row.prism_employee_id}`}
            >
              View profile
            </Link>
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Helmet>
        <title>Enrollment Dashboard | Armhr</title>
        <meta
          name="description"
          content="View and manage benefits enrollment for employees."
        />
      </Helmet>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h2" mb={1}>
            Enrollment dashboard
          </Typography>
          <Typography variant="h6">
            Open enrollment deadline:{' '}
            <strong>{formatDate(user?.enrollment_status?.end_date)}</strong>
          </Typography>
        </Box>

        <Box ml="auto" gap={2} display="flex" alignItems="center">
          <Button
            id="filter-button"
            aria-controls="filter-menu"
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            onClick={handleClick}
            startIcon={
              <FilterList
                color={selectedStatuses.length ? 'primary' : 'action'}
              />
            }
          >
            Filter
          </Button>
          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {statusOptions.map((status) => (
              <MenuItem
                key={status}
                onClick={() => handleToggle(status)}
                sx={{ display: 'flex', alignItems: 'center', p: 0, pr: 2 }}
              >
                <Checkbox
                  checked={selectedStatuses.includes(status)}
                  size="small"
                />
                <ListItemText primary={startCase(status)} />
              </MenuItem>
            ))}
          </Menu>
          <TextField
            InputProps={{
              startAdornment: <Search />,
              sx: {
                height: '42px',
                minHeight: '42px',
                '&& .MuiInputBase-input': {
                  padding: '0 0 0 8px',
                },
              },
            }}
            placeholder="Search by name..."
            sx={{ minWidth: 250 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>

      {employees && <StatusSummary data={employees} />}

      <Card sx={{ width: '100%' }}>
        <DataGrid
          rows={filteredEmployees as GridRowsProp}
          getRowId={(row) => row.prism_employee_id}
          columns={columns}
          autoHeight
          sx={{
            background: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
            fontSize: '0.875rem',
            '& .MuiDataGrid-withBorderColor': {
              borderColor: 'divider',
            },
            '& .MuiDataGrid-row': {
              cursor: 'default',
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'grey.100',
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-footerContainer': {
              height: 42,
              minHeight: 42,
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
            },
            '& .MuiDataGrid-columnHeader': {
              bgcolor: 'grey.100',
              color: '#000',
            },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:active':
              {
                outline: 'none',
              },
          }}
        />
      </Card>
    </Box>
  );
};

const StatusSummary: React.FC<{ data: any[] }> = ({ data }) => {
  const counts = data.reduce((acc, cur) => {
    acc[cur.armhr_enrollment_status] =
      (acc[cur.armhr_enrollment_status] || 0) + 1;
    return acc;
  }, {});
  const statusOrder = ['not_started', 'in_progress', 'completed'];
  const total = data.length;

  return (
    <Box
      sx={{
        p: 3,
        mb: 4,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        {statusOrder.map((status) => (
          <Box key={status}>
            <Stack
              direction="row"
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CircleIcon
                sx={{ color: statusColors[status], fontSize: '10px', mr: 1 }}
              />
              <Typography variant="h5">{counts[status] || 0}</Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: 'gray' }}>
              {startCase(status)}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          height: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
          overflow: 'hidden',
          marginBottom: '10px',
        }}
      >
        {statusOrder.map((status) => (
          <Box
            key={status}
            sx={{
              width: `${((counts[status] || 0) / total) * 100}%`,
              backgroundColor: statusColors[status],
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default EnrollmentDashboardPage;
