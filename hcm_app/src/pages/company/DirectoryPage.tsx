import { Avatar, DataTable, PageSpinner, useNotifications } from '@armhr/ui';
import { Search } from '@mui/icons-material';
import { Box, Card, Link, TextField, Typography } from '@mui/material';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';
import { paths } from '../../utils/paths';
import {
  getDisplayName,
  humanizeDepartment,
  humanizeTitle,
} from '../../utils/profile';

const DirectoryPage: React.FC = () => {
  const { entity } = useUser();
  const [rows, setRows] = useState<PublicEmployeeProfile[] | null>([]);
  const [search, setSearch] = useState<string>('');
  const { showNotification } = useNotifications();
  const navigate = useNavigate();

  const { data: employees, loading } = useApiData((api) =>
    api.company.getEmployees()
  );

  const allColumns: GridColDef[] = [
    {
      field: 'profile_picture',
      headerName: '',
      width: 32,
      renderCell: (params) => {
        const profile = params.row;
        return (
          <Link
            component={RouterLink}
            to={`/profile/${profile.id}`}
            underline="none"
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={profile.profile_picture}
              name={getDisplayName(profile)}
            />
          </Link>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      valueGetter: (params) => getDisplayName(params.row),
    },
    {
      field: 'position',
      headerName: 'Position',
      flex: 1,
      valueGetter: (params) =>
        humanizeTitle(params.row.position?.employee_title),
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      valueGetter: (params) =>
        humanizeDepartment(params.row.position?.department),
    },
    {
      field: 'action',
      headerName: '',
      headerAlign: 'right',
      sortable: false,
      width: 100,
      align: 'right',
      filterable: false,
      renderCell: (params) => {
        return (
          <Link component={RouterLink} to={`/profile/${params.row.id}`}>
            View profile
          </Link>
        );
      },
    },
  ];

  const columns = allColumns;

  const searchRows = (query: string, profile: PublicEmployeeProfile) => {
    query = query.toLowerCase();
    const fieldsToSearch = [
      profile.first_name,
      profile.last_name,
      profile.nickname,
      profile.email_address,
      profile.work_email_address,
    ];
    return fieldsToSearch.some(
      (field) => field && field.toLowerCase().includes(query)
    );
  };

  // Filter rows based on search query
  useEffect(() => {
    if (employees?.length) {
      if (search === '') {
        setRows(employees);
      } else {
        const filteredRows = employees?.filter((employee) =>
          searchRows(search, employee)
        );
        setRows(filteredRows ?? null);
      }
    } else {
      setRows([]);
    }
  }, [search, employees]);

  if (loading) return <PageSpinner />;

  if (!employees || employees.length === 0) {
    showNotification({
      message:
        'No employees found, something went wrong. Please refresh and try again',
      severity: 'error',
    });
    navigate(paths.dashboard);
    return null;
  }

  const departments = new Set(
    employees?.map(
      (employee: PublicEmployeeProfile) => employee.position?.department
    )
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Helmet>
        <title>Company Directory | Armhr</title>
        <meta
          name="description"
          content="Browse the company employee directory."
        />
      </Helmet>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h2" mb={1}>
            <span>{entity?.name || 'Company'}</span> directory
          </Typography>
          <Typography variant="body2">
            {departments?.size} departments, {employees?.length} employees
          </Typography>
        </Box>

        <Box ml="auto" gap={2} display="flex" alignItems="center">
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
            placeholder="Search directory..."
            value={search}
            sx={{ minWidth: 250 }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      </Box>

      <Card sx={{ width: '100% ' }}>
        <DataTable
          rows={rows as GridRowsProp}
          columns={columns}
          hoverStyling={true}
        />
      </Card>
    </Box>
  );
};

export default DirectoryPage;
