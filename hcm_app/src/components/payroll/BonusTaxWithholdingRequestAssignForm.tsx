import { Section } from '@armhr/ui';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { Form, useFormikContext } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { paths } from '../../utils/paths';

const columns: GridColDef[] = [
  { field: 'first_name', headerName: 'First name', width: 150 },
  { field: 'last_name', headerName: 'Last name', width: 150 },
];

const BonusTaxWithholdingRequestAssignForm = ({
  activeEmployees,
}: {
  activeEmployees: PublicEmployeeProfile[];
}) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { values, setFieldValue, handleReset, isSubmitting } =
    useFormikContext<BonusTaxWithholdingAssignRequest>();

  return (
    <Form noValidate>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Typography variant="h2">
          Assign Bonus Additional Tax Withholding Requests
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => navigate(`${paths.adminBonusTaxWithholding}`)}
          >
            Back to requests
          </Button>
        </Box>
      </Box>

      <Section
        title="Assign Bonus Forms"
        description={
          <Box>
            <Typography variant="body1">
              The selected employees will be emailed to complete and sign their
              form. Once signed, each form will be sent to the Armhr team.
            </Typography>
          </Box>
        }
      >
        <Box>
          <Box sx={{ height: '60vh' }}>
            <DataGrid
              columns={columns}
              rows={(activeEmployees as GridRowsProp) || []}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{ toolbar: QuickSearchToolbar }}
              rowSelectionModel={selectedIds}
              onRowSelectionModelChange={(selection) => {
                setSelectedIds(selection as string[]);
                setFieldValue('employee_ids', selection);
              }}
              sx={{
                height: '100%',
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
          </Box>
        </Box>

        <Box display="flex" gap={2} justifyContent="end">
          <Button color="secondary" variant="outlined" onClick={handleReset}>
            Clear
          </Button>
          <LoadingButton
            variant="contained"
            disabled={!values.employee_ids.length}
            type="submit"
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </Box>
      </Section>
    </Form>
  );
};

export default BonusTaxWithholdingRequestAssignForm;

function QuickSearchToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter debounceMs={500} sx={{ marginLeft: 'auto' }} />
    </GridToolbarContainer>
  );
}
