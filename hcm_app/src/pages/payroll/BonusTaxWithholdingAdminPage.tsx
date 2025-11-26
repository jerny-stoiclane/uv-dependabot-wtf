import { DataTable, PageSpinner } from '@armhr/ui';
import { Alert, Box, Button, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import BonusTaxWithholdingStatusChip from '../../components/payroll/BonusTaxWithholdingStatusChip';
import { useApiData } from '../../hooks/useApiData';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';

const columns: GridColDef<BonusTaxWithholdingRequest>[] = [
  {
    field: 'full_name',
    headerName: 'Employee Name',
    flex: 1,
    maxWidth: 250,
    valueGetter: ({ row }) => `${row.first_name} ${row.last_name}`,
  },
  {
    field: 'employee_id',
    headerName: 'Employee ID',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    maxWidth: 250,
    valueGetter: ({ row }) => row.employee_id,
  },
  {
    field: 'created_at',
    flex: 1,
    maxWidth: 250,
    headerAlign: 'center',
    align: 'center',
    headerName: 'Assigned on',
    valueFormatter: (params) => formatDate(params.value as string),
  },
  {
    field: 'status',
    headerName: 'Status',
    headerAlign: 'center',
    align: 'center',
    minWidth: 180,
    renderCell: ({ value }) => <BonusTaxWithholdingStatusChip status={value} />,
  },
  {
    field: 'bonus_pay_date',
    headerName: 'Bonus pay date',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    maxWidth: 250,
    valueFormatter: (params) =>
      params.value ? formatDate(params.value as string) : '—',
  },

  {
    field: 'signed_at',
    headerName: 'Signed on',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    maxWidth: 250,
    valueFormatter: (params) =>
      params.value ? formatDate(params.value as string) : '—',
  },
];

const BonusTaxWithholdingAdminPage: React.FC = () => {
  const {
    data: requests,
    loading: loadingRequests,
    error: errorRequests,
  } = useApiData<BonusTaxWithholdingRequest[]>((api) =>
    api.admin.getEmployeeBonusTaxWithholdings()
  );

  const sortedRequests = [...(requests || [])].sort((a, b) => {
    if (!a.created_at || !b.created_at) return -1;
    return a.created_at < b.created_at ? 1 : -1;
  });

  if (loadingRequests) {
    return <PageSpinner />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'start', mb: 6 }}>
        <Box>
          <Typography variant="h2" mb={0.5}>
            Bonus Additional Tax Withholding Requests
          </Typography>
        </Box>

        <Box sx={{ ml: 'auto' }}>
          <Button
            color="primary"
            component={RouterLink}
            to={`${paths.adminBonusTaxWithholdingAssign}`}
            variant="contained"
          >
            Assign Bonus Form
          </Button>
        </Box>
      </Box>
      {!errorRequests ? (
        <DataTable
          rows={sortedRequests || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          pageSizeOptions={[25]}
        />
      ) : (
        <Alert severity="error">
          <Typography>
            Failed to load bonus tax withholding requests. Please try again.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default BonusTaxWithholdingAdminPage;
