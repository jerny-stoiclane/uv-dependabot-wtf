import { useNotifications } from '@armhr/ui';
import { Info } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
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
import { DatePicker } from '@mui/x-date-pickers-pro';
import { useRef, useState } from 'react';

import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';

const columns: GridColDef[] = [
  { field: 'first_name', headerName: 'First name', width: 150 },
  { field: 'last_name', headerName: 'Last name', width: 150 },
];

const AdminHandbookAssignModal: React.FC<{
  open: boolean;
  handleClose: () => void;
  handleUpdateAssign: (assignments: {
    [handbook_id: number]: EmployeeHandbookAssignment[];
  }) => void;
  assignments: { [handbook_id: number]: EmployeeHandbookAssignment[] };
  handbookId: number;
}> = ({ open, handleClose, handleUpdateAssign, assignments, handbookId }) => {
  const api = useApi();
  const { user } = useUser();
  const { showNotification } = useNotifications();
  const firstRender = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    assignments[handbookId].map((a) => a.employee_id)
  );

  const { data: employees, loading: employeesLoading } = useApiData((api) =>
    api.company.getEmployees()
  );

  const handleAssign = async () => {
    setLoading(true);
    const assignPayload = selectedIds.map((eId) => {
      return {
        employee_id: eId,
        client_id: user?.client_id,
        handbook_id: handbookId,
        status: checked ? 'read_only' : 'pending',
        due_date: dueDate,
      } as EmployeeHandbookAssignment;
    });

    const unassignedIds = Array.from(
      new Set(assignments[handbookId].map((a) => a.employee_id)).difference(
        new Set(selectedIds)
      )
    );

    try {
      if (unassignedIds.length > 0) {
        const unassignedPayload = assignments[handbookId]
          .filter((assignment) =>
            unassignedIds.includes(assignment.employee_id)
          )
          .map((assignment) => Number(assignment.id));

        await api.admin.unassignEmployeeHandbook(unassignedPayload);
      }
      const { results: assignResults } = await api.admin.assignEmployeeHandbook(
        assignPayload
      );
      handleUpdateAssign({ ...assignments, [handbookId]: assignResults });
      showNotification({
        message: `Successfully saved handbook assignments.`,
        severity: 'success',
        autoHideDuration: 4000,
      });
    } catch (e) {
      showNotification({
        message: 'Unable to save handbook assignments.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Dialog open={open} maxWidth={'md'} fullWidth>
      <DialogTitle>Employee Handbook Assignment</DialogTitle>
      <DialogContent sx={{ height: 600 }}>
        {employeesLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box>
            <DatePicker
              label="Due date"
              value={dueDate}
              onChange={(e) => setDueDate(e)}
              disabled={selectedIds.length === 0 || checked}
              sx={{ mb: 2, mt: 2 }}
              onError={(e) => {
                console.error(e);
              }}
              slotProps={{
                textField: {
                  helperText:
                    !checked &&
                    !(selectedIds.length === 0 || checked) &&
                    dueDate === null
                      ? 'Due date is required'
                      : ' ',
                  FormHelperTextProps: {
                    sx: { color: 'error.main' },
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    setChecked(e.target.checked);
                    if (e.target.checked) setDueDate(null);
                  }}
                  checked={checked}
                />
              }
              label={'No Action Required'}
              sx={{ mr: 1 }}
            />
            <Tooltip
              placement="top"
              arrow
              title={
                'Employees can view the handbook but are not required to sign an acknowledgement and no due date is required.'
              }
            >
              <IconButton size="small">
                <Info fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <DataGrid
          columns={columns}
          rows={(employees as GridRowsProp) || []}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ toolbar: QuickSearchToolbar }}
          rowSelectionModel={selectedIds}
          onRowSelectionModelChange={(selection) => {
            firstRender.current
              ? (firstRender.current = false)
              : setSelectedIds(selection as string[]);
          }}
          sx={{
            height: '85%',
            background: 'white',
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
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 1,
            mt: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Please note: Employees will be notified via email when their
            handbook is assigned.
          </Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedIds(
                  assignments[handbookId].map((a) => a.employee_id)
                ); // Selected/deselected but didn't save, reset state
                handleClose();
              }}
            >
              Close
            </Button>
            <LoadingButton
              disabled={!checked && dueDate === null && selectedIds.length > 0}
              loading={loading}
              variant="contained"
              onClick={handleAssign}
              sx={{ ml: 1 }}
            >
              Save assignments
            </LoadingButton>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

function QuickSearchToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter debounceMs={500} sx={{ marginLeft: 'auto' }} />
    </GridToolbarContainer>
  );
}

export default AdminHandbookAssignModal;
