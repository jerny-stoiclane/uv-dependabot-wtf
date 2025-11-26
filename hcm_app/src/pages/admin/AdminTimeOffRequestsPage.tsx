import { PageSpinner, useNotifications } from '@armhr/ui';
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import PtoRequestCard from '../../components/time-off/PtoRequestCard';
import RedirectPtoApprovals from '../../components/time-off/RedirectPtoApprovals';
import { useCompany } from '../../contexts/company.context';
import { useApiData } from '../../hooks/useApiData';
import { useRedirectToDashboard } from '../../hooks/useRedirectToDashboard';
import { useUser } from '../../hooks/useUser';
import { paths } from '../../utils/paths';
import { getDisplayName } from '../../utils/profile';

const AdminTimeOffRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const { user } = useUser();
  const { data: ptoRequests, loading } = useApiData((api) =>
    api.company.getPtoRequests()
  );

  // if armhr pto is disabled, redirect user to dashboard
  const armhrPtoEnabled = user?.is_armhr_pto_enabled;
  useRedirectToDashboard(!armhrPtoEnabled);

  const { entity } = useUser();
  const { config } = useCompany();

  const { data: companyEmployees, loading: employeesLoading } = useApiData(
    (api) => api.company.getEmployees()
  );

  const statuses = ['Pending', 'Approved', 'Cancelled', 'Paid'];

  const [selectedEmployees, setSelectedEmployees] = useState<
    { id: string; displayName: string }[]
  >([]);
  const [selectedApprovers, setSelectedApprovers] = useState<
    { id: string; displayName: string }[]
  >([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');

  const leaveTypeOptions = useMemo(() => {
    if (!ptoRequests) return [];
    const allLeaveTypes = ptoRequests
      .map((req) => req.leave_type)
      .filter(Boolean);
    return [...new Set(allLeaveTypes)];
  }, [ptoRequests]);

  const filteredRequests = useMemo(() => {
    if (!companyEmployees) return [];

    const filtered = ptoRequests?.filter((request) => {
      const requestEmployee = companyEmployees.find(
        (emp) => emp.id === request.employee_id
      );
      const approverId = requestEmployee?.reports_to;
      const matchesApprover =
        selectedApprovers.length === 0 ||
        (approverId &&
          selectedApprovers.some((selApp) => selApp.id === approverId));
      const matchesEmployee =
        selectedEmployees.length === 0 ||
        selectedEmployees.some((selEmp) => selEmp.id === request.employee_id);
      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(
          {
            A: 'Approved',
            C: 'Cancelled',
            N: 'Pending',
            P: 'Paid',
          }[request.status] ?? request.status
        );
      const matchesLeaveType =
        selectedLeaveTypes.length === 0 ||
        (request.leave_type && selectedLeaveTypes.includes(request.leave_type));
      const nameOrRequestedBy = request.name || '';
      const matchesSearchText =
        !searchText ||
        nameOrRequestedBy.toLowerCase().includes(searchText.toLowerCase()) ||
        request.comment.toLowerCase().includes(searchText.toLowerCase());

      return (
        matchesApprover &&
        matchesEmployee &&
        matchesStatus &&
        matchesLeaveType &&
        matchesSearchText
      );
    });

    // Sort by most recent start date
    return filtered?.sort(
      (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
    );
  }, [
    ptoRequests,
    companyEmployees,
    selectedApprovers,
    selectedEmployees,
    selectedStatuses,
    selectedLeaveTypes,
    searchText,
  ]);

  if (employeesLoading) return <PageSpinner />;

  if (!companyEmployees || companyEmployees.length === 0) {
    showNotification({
      message:
        'No employees found, something went wrong. Please refresh and try again',
      severity: 'error',
    });
    navigate(paths.dashboard);
    return null;
  }

  const employeeOptions = companyEmployees.map((emp) => ({
    id: emp.id,
    displayName: getDisplayName(emp),
  }));

  const ptoApproverIds = new Set(
    companyEmployees
      .filter((emp) => emp.reports_to)
      .map((emp) => emp.reports_to as string)
  );

  const ptoApproverOptions = companyEmployees
    .filter((emp) => ptoApproverIds.has(emp.id))
    .map((emp) => ({
      id: emp.id,
      displayName: getDisplayName(emp),
    }));

  if (loading) return <PageSpinner />;

  const redirectPtoApprovals = config?.find(
    (cfg) => cfg.flag === 'redirect_pto_approvals'
  )?.value;

  if (redirectPtoApprovals) {
    return <RedirectPtoApprovals />;
  }

  return (
    <>
      <Helmet>
        <title>Time Off Requests | Armhr</title>
        <meta
          name="description"
          content="Review and manage employee time off requests."
        />
      </Helmet>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant="h2">Time off requests</Typography>
          <Typography variant="body2" color="text.secondary">
            Review time off requests for{' '}
            <span>{entity?.name || 'Company'}</span>.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(paths.approvals)}
          >
            Approve/Deny requests
          </Button>
        </Box>
      </Box>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          border: '1px solid #f0f0f0',
          background: 'white',
          borderRadius: 1,
          mb: 2,
          top: 60,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
          }}
        >
          <Autocomplete
            sx={{ minWidth: 120, flex: 1 }}
            size="small"
            multiple
            options={ptoApproverOptions}
            getOptionLabel={(option) => option.displayName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedApprovers}
            onChange={(_event, newValue) => setSelectedApprovers(newValue)}
            renderTags={(value, getTagProps) =>
              value.length > 1
                ? [`${value.length} selected`].map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      sx={{ height: 21, fontSize: 11 }}
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                : value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      sx={{ height: 21, fontSize: 11 }}
                      label={option.displayName}
                      {...getTagProps({ index })}
                    />
                  ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="PTO Approver"
                placeholder="Filter by Approver"
              />
            )}
          />

          <Autocomplete
            sx={{ minWidth: 120, flex: 1 }}
            size="small"
            multiple
            options={employeeOptions}
            getOptionLabel={(option) => option.displayName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedEmployees}
            onChange={(_event, newValue) => setSelectedEmployees(newValue)}
            renderTags={(value, getTagProps) =>
              value.length > 1
                ? [`${value.length} selected`].map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      sx={{ height: 21, fontSize: 11 }}
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                : value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      sx={{ height: 21, fontSize: 11 }}
                      label={option.displayName}
                      {...getTagProps({ index })}
                    />
                  ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Employee"
                placeholder="Filter by Employee"
              />
            )}
          />

          <Autocomplete
            sx={{ minWidth: 120, flex: 1 }}
            size="small"
            multiple
            options={statuses}
            getOptionLabel={(option) => option}
            value={selectedStatuses}
            onChange={(_event, newValue) => setSelectedStatuses(newValue)}
            renderTags={(value, getTagProps) =>
              value.length > 1
                ? [`${value.length} selected`].map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      sx={{ height: 21, fontSize: 11 }}
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                : value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      sx={{ height: 21, fontSize: 11 }}
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
            }
            renderInput={(params) => <TextField {...params} label="Status" />}
          />

          <Autocomplete
            sx={{ minWidth: 120, flex: 1 }}
            size="small"
            multiple
            options={leaveTypeOptions}
            getOptionLabel={(option) => option}
            value={selectedLeaveTypes}
            onChange={(_event, newValue) => setSelectedLeaveTypes(newValue)}
            renderTags={(value, getTagProps) =>
              value.length > 1
                ? [`${value.length} selected`].map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      sx={{ height: 21, fontSize: 11 }}
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                : value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      size="small"
                      sx={{ height: 21, fontSize: 11 }}
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Leave Type"
                placeholder="Filter by Leave Type"
              />
            )}
          />

          <TextField
            sx={{ minWidth: 120, flex: 1 }}
            label="Search"
            variant="outlined"
            value={searchText}
            size="small"
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton></IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>
      </AppBar>

      <Box>
        {filteredRequests?.map((request) => {
          const employee = companyEmployees.find(
            (emp) => emp.id === request.employee_id
          );
          if (!employee) return null;
          const name = getDisplayName(employee);
          const approver = companyEmployees.find(
            (emp) => emp.id === employee.reports_to
          );
          const approverName = approver ? getDisplayName(approver) : '';
          return (
            <PtoRequestCard
              key={request.id}
              name={name}
              approverName={approverName}
              request={request}
            />
          );
        })}
      </Box>
    </>
  );
};

export default AdminTimeOffRequestsPage;
