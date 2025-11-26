import { DataTable, PageSpinner, useNotifications } from '@armhr/ui';
import { DescriptionOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink } from 'react-router-dom';

import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';
import { triggerDownload } from '../../utils/profile';

const AdminUserAccessRequestsPage: React.FC = () => {
  const { entity } = useUser();
  const api = useApi();
  const { showNotification } = useNotifications();

  const { data: userAccessRequests, loading } = useApiData<UserAccessRequest[]>(
    (api) => api.profiles.getUserAccessRequests()
  );
  const handleDownloadClick = async (requestId: number) => {
    return await api.profiles.getUserAccessRequestPdf(requestId);
  };

  const columns: GridColDef<UserAccessRequest>[] = [
    {
      field: 'employee_name',
      headerName: 'Employee name',
      flex: 1,
      maxWidth: 200,
      valueGetter: ({ row }) => `${row.first_name} ${row.last_name}`,
    },
    {
      field: 'created_at',
      flex: 1,
      headerName: 'Submitted on',
      valueFormatter: (params) =>
        formatDate(params.value as string, 'WITH_TIME'),
    },
    {
      field: 'authorized_by',
      headerName: 'Submitted by',
      flex: 1,
    },
    {
      field: 'pdf_attachment',
      headerName: 'Submission PDF',
      headerAlign: 'center',
      flex: 0.5,
      align: 'center',
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              handleDownloadClick(params.row.id).then((resp) => {
                if (!resp) {
                  showNotification({
                    message: 'Failed to download submission PDF.',
                    severity: 'error',
                    autoHideDuration: 5000,
                  });
                  return;
                }
                const url = window.URL.createObjectURL(resp.data);
                triggerDownload(
                  url,
                  resp.headers['content-disposition'].match(
                    /filename="(.+)"/
                  )[1]
                );
              });
            }}
          >
            <DescriptionOutlined />
          </IconButton>
        );
      },
    },
  ];

  if (loading) return <PageSpinner />;

  const sortedUserAccessRequests = [...(userAccessRequests || [])].sort(
    (a, b) => {
      if (!a.created_at || !b.created_at) return -1;
      return a.created_at < b.created_at ? 1 : -1;
    }
  );

  return (
    <Box>
      <Helmet>
        <title>User Access Requests | Armhr</title>
        <meta
          name="description"
          content="Review and manage user access requests."
        />
      </Helmet>
      <Box sx={{ display: 'flex', justifyContent: 'start', mb: 6 }}>
        <Box>
          <Typography variant="h2" mb={0.5}>
            User Access Requests
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage user access requests for{' '}
            <span>{entity?.name || 'Company'}</span>
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Button
            color="primary"
            component={RouterLink}
            to={`${paths.adminRequestUserAccess}/new`}
            variant="contained"
          >
            New Request
          </Button>
        </Box>
      </Box>

      <DataTable
        loading={loading}
        rows={sortedUserAccessRequests || []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: userAccessRequests?.length || 25,
            },
          },
        }}
        pageSizeOptions={[25]}
      />
    </Box>
  );
};

export default AdminUserAccessRequestsPage;
