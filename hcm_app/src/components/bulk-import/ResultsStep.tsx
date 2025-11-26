import {
  CheckCircle,
  Edit as EditIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isValidEmail } from '../../utils/importUtils';
import { paths } from '../../utils/paths';

interface ResultsStepProps<T extends ImportRow> {
  submitResults: {
    successful: number;
    failed: number;
    errors: any[];
  } | null;
  onStartNew: () => void;
  failedRows?: T[];
  onUpdateRow?: (index: number, updatedRow: T) => void;
  onResubmit?: () => void;
  isResubmitting?: boolean;
  resubmitProgress?: number;
  successfulEmployees?: Array<{
    first_name: string;
    last_name: string;
    email: string;
  }>;
  customEditDialog?: (props: {
    open: boolean;
    row: T | null;
    onClose: () => void;
    onSave: (updatedRow: T) => void;
  }) => React.ReactNode;
}

export const ResultsStep = <T extends ImportRow>({
  submitResults,
  onStartNew,
  failedRows = [],
  onUpdateRow,
  onResubmit,
  isResubmitting,
  resubmitProgress = 0,
  successfulEmployees = [],
  customEditDialog,
}: ResultsStepProps<T>) => {
  const navigate = useNavigate();
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<T | null>(null);

  const allSuccess = submitResults && submitResults.failed === 0;

  const handleEditClick = useCallback(
    (index: number) => {
      setEditingRow(index);
      setEditFormData({ ...failedRows[index] });
    },
    [failedRows]
  );

  const handleEditClose = useCallback(() => {
    setEditingRow(null);
    setEditFormData(null);
  }, []);

  const handleEditSave = useCallback(() => {
    if (editingRow !== null && editFormData && onUpdateRow) {
      // Validate the edited data
      const errors: { [key: string]: string } = {};

      if (!editFormData.first_name?.trim()) {
        errors.first_name = 'First name is required';
      }
      if (!editFormData.last_name?.trim()) {
        errors.last_name = 'Last name is required';
      }
      if (!editFormData.email?.trim()) {
        errors.email = 'Email is required';
      } else if (!isValidEmail(editFormData.email)) {
        errors.email = 'Invalid email format';
      }

      const updatedRow = {
        ...editFormData,
        // Clear submission error and submitted flag when editing
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        submitted: false,
      };

      onUpdateRow(editingRow, updatedRow);
      handleEditClose();
    }
  }, [editingRow, editFormData, onUpdateRow, handleEditClose]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: allSuccess ? 'success.main' : 'warning.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          {allSuccess ? (
            <CheckCircle sx={{ fontSize: 36, color: 'white' }} />
          ) : (
            <WarningIcon sx={{ fontSize: 36, color: 'white' }} />
          )}
        </Box>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {allSuccess ? 'Import Complete' : 'Import Finished with Errors'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {allSuccess
            ? 'All employees were successfully imported'
            : 'Some employees were imported successfully'}
        </Typography>
      </Box>

      {/* Results Summary - Inline */}
      {submitResults && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            mb: 4,
            py: 3,
            borderTop: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: 'success.main' }}
            >
              {submitResults.successful}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Successful
            </Typography>
          </Box>
          <Box
            sx={{ width: '1px', height: '48px', backgroundColor: 'divider' }}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color:
                  submitResults.failed > 0 ? 'error.main' : 'text.disabled',
              }}
            >
              {submitResults.failed}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Failed
            </Typography>
          </Box>
        </Box>
      )}

      {/* Successful Employees List */}
      {successfulEmployees && successfulEmployees.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'success.main',
              mb: 2,
            }}
          >
            Emails Sent ({successfulEmployees.length})
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
            Onboarding invitations were sent to the following employees:
          </Typography>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              backgroundColor: 'white',
              mt: 2,
            }}
          >
            {/* Table Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1.25,
                backgroundColor: 'grey.50',
                borderBottom: '2px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  width: 40,
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                #
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  flex: 1,
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                Name
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  flex: 1.2,
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                Email
              </Typography>
            </Box>

            {/* Table Body */}
            <Box
              sx={{
                maxHeight: 400,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: 6,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'grey.50',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'grey.300',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'grey.400',
                  },
                },
              }}
            >
              {successfulEmployees.map((employee, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1.25,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    borderLeft: '3px solid',
                    borderLeftColor: 'success.main',
                    backgroundColor: 'success.lighter',
                    transition: 'background-color 0.15s ease',
                    '&:hover': {
                      backgroundColor: 'success.lighter',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      width: 40,
                      color: 'text.secondary',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >
                    {employee.first_name} {employee.last_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1.2,
                      color: 'text.secondary',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {employee.email}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Failed Rows - Editable */}
      {submitResults && submitResults.errors.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'error.main',
              }}
            >
              Failed Rows ({failedRows.length})
            </Typography>
            {onResubmit && failedRows.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isResubmitting && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Retrying...
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={resubmitProgress}
                      sx={{ width: 100, height: 4, borderRadius: 2 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 600, minWidth: 35 }}
                    >
                      {resubmitProgress}%
                    </Typography>
                  </Box>
                )}
                <LoadingButton
                  variant="contained"
                  size="medium"
                  onClick={onResubmit}
                  loading={isResubmitting}
                  disabled={
                    failedRows.some((row) => row.errors) ||
                    failedRows.every((row) => row.submitted)
                  }
                >
                  Retry {failedRows.filter((row) => !row.submitted).length}{' '}
                  Failed Row
                  {failedRows.filter((row) => !row.submitted).length !== 1 ? (
                    <span>s</span>
                  ) : (
                    <span></span>
                  )}
                </LoadingButton>
              </Box>
            )}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
            Fix the errors below and click retry to resubmit these rows.
          </Typography>

          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              backgroundColor: 'white',
              mt: 2,
            }}
          >
            {/* Table Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1.25,
                backgroundColor: 'grey.50',
                borderBottom: '2px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  width: 40,
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                #
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  flex: 1,
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                Name
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  flex: 1.2,
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                Email
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  flex: 2,
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                Status
              </Typography>
              <Box sx={{ width: 80, textAlign: 'right' }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}
                >
                  Actions
                </Typography>
              </Box>
            </Box>

            {/* Table Body */}
            <Box
              sx={{
                maxHeight: 400,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: 6,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'grey.50',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'grey.300',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'grey.400',
                  },
                },
              }}
            >
              {failedRows.map((row, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      py: 1.25,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      borderLeft: '3px solid',
                      borderLeftColor: 'error.main',
                      backgroundColor: 'error.lighter',
                      transition: 'background-color 0.15s ease',
                      '&:hover': {
                        backgroundColor: 'error.lighter',
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        width: 40,
                        color: 'text.secondary',
                        fontSize: '0.8125rem',
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        fontWeight: 500,
                        fontSize: '0.875rem',
                      }}
                    >
                      {row.first_name} {row.last_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1.2,
                        color: 'text.secondary',
                        fontSize: '0.8125rem',
                      }}
                    >
                      {row.email}
                    </Typography>
                    <Box
                      sx={{
                        flex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Tooltip
                        title={
                          row.errors && !row.errors.submission ? (
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 600,
                                  display: 'block',
                                  mb: 0.5,
                                }}
                              >
                                Validation Errors:
                              </Typography>
                              {Object.entries(row.errors).map(
                                ([field, error]) => (
                                  <Typography
                                    key={field}
                                    variant="caption"
                                    sx={{ display: 'block' }}
                                  >
                                    •{' '}
                                    {field
                                      .replace(/_/g, ' ')
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                    : {error}
                                  </Typography>
                                )
                              )}
                            </Box>
                          ) : (
                            ''
                          )
                        }
                        arrow
                        placement="top"
                      >
                        <Chip
                          label={row.errors ? 'Has Errors' : 'Ready'}
                          color={row.errors ? 'error' : 'success'}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                          }}
                        />
                      </Tooltip>
                      {row.errors?.submission && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'error.main',
                            fontSize: '0.75rem',
                            fontStyle: 'italic',
                          }}
                        >
                          {row.errors.submission}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        width: 80,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 0.5,
                      }}
                    >
                      {onUpdateRow && (
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(index)}
                            sx={{ p: 0.5 }}
                            disabled={isResubmitting}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Edit Dialog */}
      {customEditDialog
        ? customEditDialog({
            open: editingRow !== null,
            row: editFormData,
            onClose: handleEditClose,
            onSave: (updatedRow) => {
              if (editingRow !== null && onUpdateRow) {
                onUpdateRow(editingRow, updatedRow);
                handleEditClose();
              }
            },
          })
        : editFormData && (
            <Dialog
              open={editingRow !== null}
              onClose={handleEditClose}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Edit Employee Information
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {editFormData.first_name} {editFormData.last_name}
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ pt: 2 }}>
                {/* Submission Error Alert */}
                {editFormData.errors?.submission && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      Submission Error
                    </Typography>
                    <Typography variant="body2">
                      {editFormData.errors.submission}
                    </Typography>
                  </Alert>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                  }}
                >
                  <TextField
                    label="First Name"
                    value={editFormData.first_name || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        first_name: e.target.value,
                      })
                    }
                    fullWidth
                    required
                    error={!editFormData.first_name?.trim()}
                    helperText={
                      !editFormData.first_name?.trim()
                        ? 'First name is required'
                        : ''
                    }
                  />
                  <TextField
                    label="Last Name"
                    value={editFormData.last_name || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        last_name: e.target.value,
                      })
                    }
                    fullWidth
                    required
                    error={!editFormData.last_name?.trim()}
                    helperText={
                      !editFormData.last_name?.trim()
                        ? 'Last name is required'
                        : ''
                    }
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    fullWidth
                    required
                    error={
                      !editFormData.email?.trim() ||
                      !isValidEmail(editFormData.email)
                    }
                    helperText={
                      !editFormData.email?.trim()
                        ? 'Email is required'
                        : !isValidEmail(editFormData.email)
                        ? 'Invalid email format'
                        : ''
                    }
                  />
                </Box>
              </DialogContent>
              <DialogActions
                sx={{
                  px: 3,
                  py: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Button
                  onClick={handleEditClose}
                  variant="outlined"
                  size="medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSave}
                  variant="contained"
                  size="medium"
                >
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog>
          )}

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate(paths.newHires)}
          size="large"
        >
          Back to Dashboard
        </Button>
        <Button variant="contained" onClick={onStartNew} size="large">
          Start New Import
        </Button>
      </Box>
    </Box>
  );
};
