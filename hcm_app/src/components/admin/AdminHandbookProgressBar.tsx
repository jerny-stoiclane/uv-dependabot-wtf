import {
  AssignmentLateOutlined,
  AssignmentTurnedInOutlined,
  ExpandMore,
  PendingActionsOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { useApiData } from '../../hooks/useApiData';

const columns: GridColDef[] = [
  {
    field: 'first_name',
    headerName: 'First name',
    flex: 1,
  },
  {
    field: 'last_name',
    headerName: 'Last name',
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    renderCell: (params) => {
      if (params.value === 'signed')
        return (
          <Tooltip title={'Completed'} placement="right">
            <AssignmentTurnedInOutlined color="success" fontSize="medium" />
          </Tooltip>
        );
      else if (params.value === 'overdue')
        return (
          <Tooltip title={'Overdue'} placement="right">
            <AssignmentLateOutlined color="error" fontSize="medium" />
          </Tooltip>
        );
      else if (params.value === 'read_only')
        return (
          <Tooltip title={'View only'} placement="right">
            <VisibilityOutlined fontSize="medium" />
          </Tooltip>
        );
      else
        return (
          <Tooltip title={'Pending'} placement="right">
            <PendingActionsOutlined color="warning" fontSize="medium" />
          </Tooltip>
        );
    },
  },
  {
    field: 'assigned_at',
    headerName: 'Assigned date',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString();
    },
  },
  {
    field: 'due_date',
    headerName: 'Due date',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    valueFormatter: (params) => {
      if (!params.value) return '---';
      return new Date(params.value).toLocaleDateString();
    },
  },
];

const AdminHandbookProgressBar: React.FC<{
  handbook: HandbookAsset;
  assignments: EmployeeHandbookAssignment[];
}> = ({ handbook, assignments }) => {
  const { data: employees, loading: eLoading } = useApiData((api) =>
    api.company.getEmployees()
  );

  const employeeAssignments = assignments
    ?.map((a) => {
      const match = employees?.find((e) => e.id === a.employee_id);
      return match
        ? {
            first_name: match.first_name,
            last_name: match.last_name,
            ...a,
          }
        : null;
    })
    .filter((item) => item !== null);

  const progress =
    employeeAssignments && employeeAssignments?.length > 0
      ? (100 *
          employeeAssignments.filter((a) =>
            ['signed', 'read_only'].includes(a.status)
          ).length) /
        employeeAssignments.length
      : null;

  if (progress === null) return null;
  return (
    <>
      <Accordion
        sx={{
          backgroundColor: 'white',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            backgroundColor: 'white',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            '&.Mui-expanded': {
              borderBottom: 'none',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography variant="h6">
              {handbook.key.substring(
                handbook.key.lastIndexOf('/') + 1,
                handbook.key.lastIndexOf('.')
              )}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  mr: 1,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                  }}
                />
              </Box>

              <Box
                sx={{
                  minWidth: 40,
                  textAlign: 'left',
                }}
              >
                <Typography variant="body2">
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
          </Box>
        </AccordionSummary>
        {eLoading ? (
          <CircularProgress
            sx={{ color: 'primary.main', m: '0 auto', mt: 24, size: 50 }}
          />
        ) : (
          <AccordionDetails
            sx={{
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              maxHeight: '100%',
            }}
          >
            <DataGrid
              showColumnVerticalBorder
              columns={columns}
              rows={(employeeAssignments as GridRowsProp) || []}
              slots={{ toolbar: QuickSearchToolbar }}
              disableRowSelectionOnClick
              density="compact"
              sx={{
                height: '400px',
                background: 'white',
                fontSize: '0.875rem',
                '& .MuiDataGrid-columnHeader': {
                  borderRight: '1px solid rgba(224, 224, 224, 1)',
                  '&:last-child': {
                    borderRight: 'none',
                  },
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
                '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:active':
                  {
                    outline: 'none',
                  },
              }}
            ></DataGrid>
          </AccordionDetails>
        )}
      </Accordion>
    </>
  );
};

function QuickSearchToolbar() {
  return (
    <GridToolbarContainer sx={{ mb: 2 }}>
      <GridToolbarQuickFilter debounceMs={500} sx={{ marginLeft: 'auto' }} />
    </GridToolbarContainer>
  );
}
export default AdminHandbookProgressBar;
