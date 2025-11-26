import { DataTable } from '@armhr/ui';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { Box, Checkbox, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

interface EmployeeSelectionTableProps {
  employees: NewHireRequest[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const EmployeeSelectionTable: React.FC<EmployeeSelectionTableProps> = ({
  employees,
  selectedIds,
  onToggle,
  onSelectAll,
  onDeselectAll,
}) => {
  const columns: GridColDef<NewHireRequest>[] = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderHeader: () => (
        <Checkbox
          checked={
            selectedIds.length === employees.length && employees.length > 0
          }
          indeterminate={
            selectedIds.length > 0 && selectedIds.length < employees.length
          }
          onChange={(e) => (e.target.checked ? onSelectAll() : onDeselectAll())}
        />
      ),
      renderCell: ({ row }) => (
        <Checkbox
          checked={selectedIds.includes(row.id!)}
          onChange={() => onToggle(row.id!)}
        />
      ),
      sortable: false,
    },
    {
      field: 'first_name',
      headerName: 'First Name',
      flex: 1,
      minWidth: 120,
      renderCell: ({ row }) => <Typography>{row.first_name}</Typography>,
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 120,
      renderCell: ({ row }) => <Typography>{row.last_name}</Typography>,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5,
      minWidth: 200,
      renderCell: ({ row }) => <Typography>{row.email}</Typography>,
    },
    {
      field: 'has_ssn',
      headerName: 'SSN',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {row.has_ssn ? (
            <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />
          ) : (
            <RadioButtonUncheckedIcon
              sx={{
                fontSize: 20,
                color: 'text.disabled',
              }}
            />
          )}
        </Box>
      ),
    },
    {
      field: 'has_birth_date',
      headerName: 'DOB',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {row.has_birth_date ? (
            <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />
          ) : (
            <RadioButtonUncheckedIcon
              sx={{
                fontSize: 20,
                color: 'text.disabled',
              }}
            />
          )}
        </Box>
      ),
    },
    {
      field: 'has_gender',
      headerName: 'Gender',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {row.has_gender ? (
            <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />
          ) : (
            <RadioButtonUncheckedIcon
              sx={{
                fontSize: 20,
                color: 'text.disabled',
              }}
            />
          )}
        </Box>
      ),
    },
  ];

  return (
    <DataTable
      rows={employees}
      columns={columns}
      hideFooter={employees.length <= 10}
      sx={{
        backgroundColor: 'white',
        '& .MuiDataGrid-row': {
          cursor: 'pointer',
        },
      }}
    />
  );
};
