import {
  ConfirmationDialog,
  DataTable,
  PageSpinner,
  useNotifications,
} from '@armhr/ui';
import {
  AccessTime,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  ErrorOutline as ErrorOutlineIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Link as MUILink,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import NewHireModal from '../../components/onboarding/NewHireModal';
import NewHireStateChip from '../../components/onboarding/NewHireStateChip';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';

enum NewHireRequestState {
  CREATED = 'created',
  USER_PARTIAL_COMPLETE = 'user_partial_complete',
  USER_REGISTRATION = 'user_registration',
  USER_PRISM_ONBOARDING = 'user_prism_onboarding',
  COMPLETE = 'complete',
}

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const highlightText = (text: string, highlight: string) => {
  if (!highlight) {
    return text;
  }

  const escapedHighlight = escapeRegExp(highlight);
  const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} style={{ backgroundColor: '#fff59d' }}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

const NewHireDashboardPage: React.FC = () => {
  const { user } = useUser();
  const api = useApi();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();

  // All state declarations
  const [emailLoading, setEmailLoading] = useState<boolean | number>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHiredBy, setSelectedHiredBy] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState<NewHireRequest | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NewHireRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    requestedDetails: true,
    readyForOnboarding: true,
    inProgress: true,
    completed: true,
  });
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const { data: employees, loading: employeesLoading } = useApiData((api) =>
    api.company.getEmployees()
  );

  // load new hire requests
  const {
    data: newHireRequests,
    loading,
    refresh,
  } = useApiData<NewHireRequest[]>((api) =>
    api.onboarding.getNewHireRequests()
  );

  // Update sections visibility based on filtered results
  const updateSectionsVisibility = (
    newQuery: string,
    newHiringManager: string
  ) => {
    if (newQuery === '' && newHiringManager === '') {
      // If clearing all filters, open all sections
      setOpenSections({
        requestedDetails: true,
        readyForOnboarding: true,
        inProgress: true,
        completed: true,
      });
      return;
    }

    // Check each section for results with the new filters
    setOpenSections({
      requestedDetails:
        filterRequests(requestedDetails, newQuery, newHiringManager).length > 0,
      readyForOnboarding:
        filterRequests(readyForOnboarding, newQuery, newHiringManager).length >
        0,
      inProgress:
        filterRequests(inProgress, newQuery, newHiringManager).length > 0,
      completed:
        filterRequests(completed, newQuery, newHiringManager).length > 0,
    });
  };

  // Debounced effect to update sections visibility
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      updateSectionsVisibility(searchQuery, selectedHiredBy);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedHiredBy]);

  if (employeesLoading) return <PageSpinner />;

  if (!employees) {
    showNotification({
      message: 'No employees found',
      severity: 'error',
    });
    navigate(paths.dashboard);
    return null;
  }

  // Filter function for search and hired by
  const filterRequests = (
    requests: NewHireRequest[],
    query = debouncedQuery,
    hiredBy = selectedHiredBy
  ) => {
    return requests.filter((request) => {
      const matchesSearch =
        query === '' ||
        `${request.first_name} ${request.last_name} ${request.email}`
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesHiredBy =
        hiredBy === '' || request.intake_employee_id === hiredBy;

      return matchesSearch && matchesHiredBy;
    });
  };

  // Handle section toggle
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Update search query immediately for UI feedback
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Update hiring manager filter and handle section visibility
  const handleHiringManagerChange = (newValue: any) => {
    const newHiringManager = newValue?.id || '';
    setSelectedHiredBy(newHiringManager);
    updateSectionsVisibility(searchQuery, newHiringManager);
  };

  // "resend email" click
  const handleEmailClick = (row: NewHireRequest) => {
    setTargetEmail(row);
    setIsConfirmOpen(true);
  };

  // confirm resend
  const handleConfirmEmail = async () => {
    if (!targetEmail?.id) return;
    setEmailLoading(targetEmail.id);

    try {
      await api.onboarding.resendNewHireEmail(targetEmail.id);
      showNotification({
        message: 'Email sent successfully',
        severity: 'success',
        autoHideDuration: 5000,
      });
    } catch (error) {
      showNotification({
        message:
          'Sorry, there was a problem sending the email. Please try again.',
        severity: 'error',
      });
    } finally {
      setTargetEmail(null);
      setEmailLoading(false);
      setIsConfirmOpen(false);
    }
  };

  // add new hire
  const handleAddNewHireClick = () => {
    setIsModalOpen(true);
  };

  // bulk import quick hire
  const handleBulkQuickHireClick = () => {
    navigate(paths.quickHireBulkImport);
  };

  // bulk import prehire completion
  const handleBulkPrehireCompletionClick = () => {
    navigate(paths.prehireBulkImport);
  };

  // soft delete click
  const handleDeleteClick = (row: NewHireRequest) => {
    setDeleteTarget(row);
    setIsDeleteConfirmOpen(true);
  };

  // confirm soft delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;

    try {
      await api.onboarding.deleteNewHireRequest(deleteTarget.id);

      showNotification({
        message: 'Successfully deleted new hire request.',
        severity: 'success',
        autoHideDuration: 5000,
      });

      await refresh();
    } catch (error) {
      showNotification({
        message: 'Sorry, there was a problem deleting this request.',
        severity: 'error',
      });
    } finally {
      setDeleteTarget(null);
      setIsDeleteConfirmOpen(false);
    }
  };

  // Check if a row matches the current search
  const isRowHighlighted = (row: NewHireRequest) => {
    if (!searchQuery && !selectedHiredBy) return false;
    return filterRequests([row]).length > 0;
  };

  // Section header component
  const SectionHeader = ({
    title,
    section,
    warning,
    actionButton,
  }: {
    title: string;
    section: keyof typeof openSections;
    warning?: boolean;
    actionButton?: React.ReactNode;
  }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {warning && <ErrorOutlineIcon color="warning" fontSize="medium" />}
        <Typography
          variant={warning ? 'h5' : 'body1'}
          color={warning ? 'warning.main' : 'inherit'}
          sx={warning ? undefined : { fontWeight: 'bold', fontSize: '1.1rem' }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {actionButton}
        <IconButton
          onClick={() => toggleSection(section)}
          sx={{
            transform: openSections[section]
              ? 'rotate(0deg)'
              : 'rotate(-90deg)',
            transition: 'transform 0.2s',
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
    </Box>
  );

  if (loading) return <PageSpinner />;

  // filter requests visible to this user, unless admin
  const visibleRequests = (newHireRequests || []).filter((request) => {
    if (user?.is_admin) return true;
    return request.intake_employee_id === user?.id;
  });

  // sort from newest to oldest based on updated_at
  const sortedRequests = [...visibleRequests].sort((a, b) => {
    if (!a.updated_at || !b.updated_at) return -1;
    return a.updated_at < b.updated_at ? 1 : -1;
  });

  // sub-buckets of requests
  const requestedDetails = sortedRequests.filter(
    (r) => r.fsm_state === NewHireRequestState.CREATED
  );
  const readyForOnboarding = sortedRequests.filter(
    (r) => r.fsm_state === NewHireRequestState.USER_PARTIAL_COMPLETE
  );
  const inProgress = sortedRequests.filter(
    (r) =>
      r.fsm_state === NewHireRequestState.USER_REGISTRATION ||
      r.fsm_state === NewHireRequestState.USER_PRISM_ONBOARDING
  );
  const completed = sortedRequests.filter(
    (r) => r.fsm_state === NewHireRequestState.COMPLETE
  );

  // columns for all but "requested details"
  const commonColumns: GridColDef<NewHireRequest>[] = [
    {
      field: 'employee_name',
      headerName: 'Employee name',
      flex: 1,
      maxWidth: 200,
      renderCell: ({ row }) => {
        const fullName = `${row.first_name} ${row.last_name}`;
        return (
          <MUILink
            to={`${paths.newHire}/${row.id}`}
            component={RouterLink}
            sx={{ whiteSpace: 'normal' }}
          >
            {highlightText(fullName, searchQuery)}
          </MUILink>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email address',
      flex: 2,
      renderCell: ({ value }) => (
        <Typography sx={{ whiteSpace: 'normal' }}>
          {highlightText(value, searchQuery)}
        </Typography>
      ),
    },
    {
      field: 'fsm_state',
      minWidth: 180,
      headerName: 'Status',
      renderCell: ({ value }) => (
        <NewHireStateChip state={value as NewHireRequestState} />
      ),
    },
    {
      field: 'intake_employee_id',
      headerName: 'Hired by',
      flex: 1.2,
      minWidth: 160,
      sortable: false,
      renderCell: ({ row }) => {
        const employee = employees.find((e) => e.id === row.intake_employee_id);
        const name = employee
          ? `${employee.first_name} ${employee.last_name}`
          : '';
        return <Typography sx={{ whiteSpace: 'normal' }}>{name}</Typography>;
      },
    },
    {
      field: 'updated_at',
      headerName: 'Last updated',
      flex: 1,
      minWidth: 150,
      renderCell: ({ value }) => {
        const isoDate = value as string;
        const shortDate = formatDate(isoDate);
        const fullDateTime = formatDate(isoDate, 'WITH_TIME');
        return (
          <Tooltip title={fullDateTime}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography>{shortDate}</Typography>
              <AccessTime sx={{ fontSize: '16px' }} />
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      align: 'right',
      headerAlign: 'right',
      width: 120,
      renderCell: ({ row, id }) => {
        // only show delete if in CREATED or USER_PARTIAL_COMPLETE
        const canDelete =
          row.fsm_state === NewHireRequestState.CREATED ||
          row.fsm_state === NewHireRequestState.USER_PARTIAL_COMPLETE;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* soft delete if allowed */}
            {canDelete && (
              <Tooltip title="Delete" placement="top">
                <IconButton
                  onClick={() => handleDeleteClick(row)}
                  color="error"
                  size="small"
                  sx={{ ml: 0.5 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {/* resend email if in 'created' state */}
            {row.fsm_state === NewHireRequestState.CREATED && (
              <Tooltip title="Resend email" placement="top">
                <LoadingButton
                  onClick={() => handleEmailClick(row)}
                  size="small"
                  sx={{
                    padding: '5px',
                    minWidth: 'auto',
                  }}
                  loading={emailLoading === id}
                >
                  <EmailIcon
                    fontSize="small"
                    sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
                  />
                </LoadingButton>
              </Tooltip>
            )}
            {/* always can edit if not complete or requested details */}
            {row.fsm_state !== NewHireRequestState.COMPLETE &&
              row.fsm_state !== NewHireRequestState.CREATED && (
                <Tooltip title="Edit" placement="top">
                  <IconButton
                    onClick={() => navigate(`${paths.newHire}/${id}`)}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
          </Box>
        );
      },
    },
  ];

  // special columns for the requested details section
  const requestedDetailsColumns: GridColDef<NewHireRequest>[] =
    commonColumns.map((col) => {
      if (col.field === 'updated_at') {
        // override label
        return {
          ...col,
          headerName: 'Email sent',
        };
      }
      return col;
    });

  // style for the DataTable
  const dataTableStyles = {
    height: 400,
    getRowClassName: (params: any) => {
      return isRowHighlighted(params.row) ? 'highlighted-row' : '';
    },
    sx: {
      '& .MuiDataGrid-cell': {
        borderBottom: '1px solid #eee',
      },
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#fafafa',
      },
      '& .MuiDataGrid-row:hover': {
        backgroundColor: '#f9f9f9',
      },
      '& .MuiDataGrid-cellContent': {
        whiteSpace: 'normal',
        overflow: 'visible',
        textOverflow: 'clip',
      },
      '& .highlighted-row': {
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'rgba(25, 118, 210, 0.08)',
          borderLeft: '4px solid #1976d2',
          borderRadius: '4px',
          zIndex: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        },
        '& .MuiDataGrid-cell': {
          borderColor: 'rgba(25, 118, 210, 0.12)',
          position: 'relative',
          zIndex: 1,
        },
      },
      '& .highlighted-row:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.12)',
        '&::before': {
          backgroundColor: 'rgba(25, 118, 210, 0.12)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        },
      },
    },
  };

  return (
    <Box>
      <Helmet>
        <title>New Hire Dashboard | Armhr</title>
        <meta
          name="description"
          content="Manage and track new hire requests."
        />
      </Helmet>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h2">New hire dashboard</Typography>
          <Typography variant="body1" color="textSecondary"></Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, ml: 'auto', alignItems: 'center' }}>
          {/* Search input */}
          <Box sx={{ position: 'relative' }}>
            <TextField
              size="small"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSearchQuery('');
                        updateSectionsVisibility('', selectedHiredBy);
                      }}
                      size="small"
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: 250 }}
            />
          </Box>

          {/* Hired by filter */}
          <Autocomplete
            size="small"
            options={employees}
            sx={{ width: 250 }}
            getOptionLabel={(option) =>
              `${option.first_name} ${option.last_name}`
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Filter by hiring manager" />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.first_name} {option.last_name}
              </li>
            )}
            value={employees.find((emp) => emp.id === selectedHiredBy) || null}
            onChange={(_, newValue) => handleHiringManagerChange(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          <LoadingButton
            color="primary"
            variant="contained"
            onClick={handleAddNewHireClick}
          >
            Hire employee
          </LoadingButton>
        </Box>
      </Box>

      {/* create new hire modal */}
      <NewHireModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Requested details section */}
      <Card
        sx={{
          py: 2,
          px: 3,
          mb: 3,
          mt: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <SectionHeader
          title="Requested details"
          section="requestedDetails"
          actionButton={
            user?.is_bulk_import_new_hires_enabled && (
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={handleBulkQuickHireClick}
              >
                Bulk request details
              </Button>
            )
          }
        />
        {openSections.requestedDetails && (
          <>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ mt: 2, mb: 2 }}
            >
              An email was sent to these new hires to gather some personal
              details, but we haven&apos;t received any information yet. If you
              already have their details, you can enter them to continue
              onboarding.
            </Typography>
            {requestedDetails.length > 0 ? (
              <DataTable
                rows={filterRequests(requestedDetails)}
                columns={requestedDetailsColumns}
                {...dataTableStyles}
                initialState={{
                  pagination: { paginationModel: { pageSize: 25 } },
                }}
                pageSizeOptions={[25]}
              />
            ) : (
              <Typography variant="body1" color="textSecondary">
                No new hires have been requested.
              </Typography>
            )}
          </>
        )}
      </Card>

      {/* Ready for onboarding section */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          mt: 3,
          border: '1px solid',
          borderColor:
            filterRequests(readyForOnboarding).length > 0 &&
            !searchQuery &&
            !selectedHiredBy
              ? 'warning.main'
              : 'divider',
        }}
      >
        <SectionHeader
          title="Ready for onboarding"
          section="readyForOnboarding"
          warning={
            filterRequests(readyForOnboarding).length > 0 &&
            !searchQuery &&
            !selectedHiredBy
          }
          actionButton={
            user?.is_bulk_import_new_hires_enabled && (
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={handleBulkPrehireCompletionClick}
                color="warning"
              >
                Bulk submit employees
              </Button>
            )
          }
        />
        {openSections.readyForOnboarding && (
          <>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ mt: 2, mb: 2 }}
            >
              These new hires have submitted their personal details and need
              additional information so onboarding can begin.
            </Typography>
            {readyForOnboarding.length > 0 ? (
              <DataTable
                rows={filterRequests(readyForOnboarding)}
                columns={commonColumns}
                {...dataTableStyles}
                initialState={{
                  pagination: { paginationModel: { pageSize: 25 } },
                }}
                pageSizeOptions={[25]}
              />
            ) : (
              <Typography variant="body1" color="textSecondary">
                No new hires are ready for onboarding.
              </Typography>
            )}
          </>
        )}
      </Card>

      {/* In progress section */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          mt: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <SectionHeader title="Hires in progress" section="inProgress" />
        {openSections.inProgress && (
          <>
            <Typography variant="body1" mb={2} color="textSecondary">
              These new hires are in the account registration and onboarding
              steps. No immediate action is required. You&apos;ll be notified
              when they need another review.
            </Typography>
            {inProgress.length > 0 ? (
              <DataTable
                rows={filterRequests(inProgress)}
                columns={commonColumns}
                {...dataTableStyles}
                initialState={{
                  pagination: { paginationModel: { pageSize: 25 } },
                }}
                pageSizeOptions={[25]}
              />
            ) : (
              <Typography variant="body1" color="textSecondary">
                No hires are currently in progress.
              </Typography>
            )}
          </>
        )}
      </Card>

      {/* Completed section */}
      {completed.length > 0 && (
        <Card
          sx={{
            p: 2,
            mb: 3,
            mt: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <SectionHeader title="Completed requests" section="completed" />
          {openSections.completed && (
            <>
              <Typography variant="body1" mb={2} color="textSecondary">
                These new hires are complete! No further action is required. If
                you need to make changes, contact your HR administrator.
              </Typography>
              <DataTable
                rows={filterRequests(completed)}
                columns={commonColumns}
                {...dataTableStyles}
                initialState={{
                  pagination: { paginationModel: { pageSize: 25 } },
                }}
                pageSizeOptions={[25]}
              />
            </>
          )}
        </Card>
      )}

      {/* resend email */}
      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmEmail}
        title="Confirm resend"
        message={
          <>
            This will send the prehire email to{' '}
            <strong>
              {targetEmail?.first_name} {targetEmail?.last_name}
            </strong>{' '}
            at <strong>{targetEmail?.email}</strong>.
            <br />
            <br />
            Are you sure you want to resend the email?
          </>
        }
      />

      {/* soft delete */}
      <ConfirmationDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm delete"
        message={
          <>
            Are you sure you want to delete the new for{' '}
            <strong>
              {deleteTarget?.first_name} {deleteTarget?.last_name}
            </strong>
            ?<br />
          </>
        }
      />
    </Box>
  );
};

export default NewHireDashboardPage;
