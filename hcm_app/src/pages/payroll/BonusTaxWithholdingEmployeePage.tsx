import { DataTable, PageSpinner, formatMoney } from '@armhr/ui';
import { HistoryEduOutlined, PlayArrow } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { useApiData } from '../../hooks/useApiData';
import { BonusTaxWithholdingRequestStatuses } from '../../utils/constants';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';

const columns: GridColDef[] = [
  {
    field: 'created_at',
    headerName: 'Assigned on',
    flex: 1,
    valueFormatter: (params) => formatDate(params.value as string),
  },
  {
    field: 'signed_at',
    headerName: 'Signed on',
    flex: 1,
    valueFormatter: (params) => formatDate(params.value as string),
  },
  { field: 'bonus_pay_date', headerName: 'Bonus Pay Date', flex: 1 },
  {
    field: 'additional_fed_tax',
    headerName: 'Additional Fed Tax',
    flex: 1,
    valueFormatter: (params) => formatMoney(params.value),
  },
  {
    field: 'additional_state_tax',
    headerName: 'Additional State Tax',
    flex: 1,
    valueFormatter: (params) => formatMoney(params.value),
  },
  {
    field: 'additional_local_tax',
    headerName: 'Additional Local Tax',
    flex: 1,
    valueFormatter: (params) => formatMoney(params.value),
  },
];

const BonusTaxWithholdingEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: forms,
    loading: formsLoading,
    // error: formsError,
    // refresh,
  } = useApiData((api) => api.payroll.getMyBonusTaxWithholdings());

  const activeForm = forms?.find(
    (req) => req.status === BonusTaxWithholdingRequestStatuses.ASSIGNED
  );

  if (formsLoading) return <PageSpinner />;
  return (
    <>
      <Helmet>
        <title>Bonus Tax Withholding | Armhr</title>
        <meta
          name="description"
          content="Manage bonus additional tax withholding requests."
        />
      </Helmet>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          Bonus Additional Tax Withholding
        </Typography>
      </Box>
      <Box>
        {activeForm ? (
          <>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle>
                <b>Action Required: Tax Withholding Form</b>
              </AlertTitle>
              You have been assigned a bonus tax withholding form that requires
              your immediate attention.
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                sx={{
                  width: 'auto',
                  minWidth: 300,
                  maxWidth: 600,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
                  >
                    <HistoryEduOutlined
                      sx={{ fontSize: 50, color: 'primary.main' }}
                    />
                  </Box>
                  <Typography variant="h3" align="center">
                    Bonus Tax Withholding Form
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                    Assigned on{' '}
                    {format(new Date(activeForm.created_at), 'MMM d, yyyy')}
                  </Typography>
                  <Typography sx={{ mb: 3 }}>
                    Complete your additional tax withholding information for
                    bonus payments.
                    <br />
                    This form ensures accurate tax deductions for your bonus
                    compensation.
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 'auto',
                    }}
                  >
                    <Button
                      startIcon={<PlayArrow />}
                      variant="contained"
                      onClick={() =>
                        navigate(
                          `${paths.employeeBonusTaxWithholdingSign}/${activeForm.id}`
                        )
                      }
                    >
                      Start form
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </>
        ) : (
          <Alert severity="success">
            <AlertTitle>
              <b>No Action Required</b>
            </AlertTitle>
            There are no assigned bonus tax withholding forms at this time.
            You're all set!
          </Alert>
        )}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h3">Completed Forms</Typography>
        </Box>
        {forms && forms.length > 0 && (
          <DataTable
            rows={forms.filter(
              (form) =>
                form.status === BonusTaxWithholdingRequestStatuses.SIGNED
            )}
            columns={columns}
            noResultsMessage="No bonus tax withholding forms completed"
            sx={{ mt: 2 }}
          />
        )}
      </Box>
    </>
  );
};

export default BonusTaxWithholdingEmployeePage;
