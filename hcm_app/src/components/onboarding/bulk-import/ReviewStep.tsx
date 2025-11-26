import {
  ArrowBack,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
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
  InputAdornment,
  LinearProgress,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

import { createImportSummary, isValidEmail } from '../../../utils/importUtils';

// Helper function to format pay info compactly
const formatPayInfo = (row: any): string => {
  const parts: string[] = [];

  if (row.pay_method) {
    const methodMap: { [key: string]: string } = {
      S: 'Salary',
      H: 'Hourly',
      C: 'Commission',
      D: 'Driver',
    };
    parts.push(methodMap[row.pay_method] || row.pay_method);
  }

  if (row.pay_rate) {
    const rate = parseFloat(row.pay_rate);
    if (!isNaN(rate)) {
      parts.push(`$${rate.toLocaleString()}`);
    }
  }

  return parts.join(' • ');
};

interface ReviewStepProps<T extends ImportRow> {
  csvData: T[];
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitProgress: number;
  onUpdateRow?: (index: number, updatedRow: T) => void;
  onDeleteRow?: (index: number) => void;
  onReupload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
  onViewResults?: () => void;
  hasPartialSuccess?: boolean;
  hasSuccessfulSubmission?: boolean;
  showPositionAndPay?: boolean;
  customEditDialog?: (props: {
    open: boolean;
    row: T | null;
    onClose: () => void;
    onSave: (updatedRow: T) => void;
  }) => React.ReactNode;
}

export function ReviewStep<T extends ImportRow>({
  csvData,
  onSubmit,
  onBack,
  isSubmitting,
  submitProgress,
  onUpdateRow,
  onDeleteRow,
  onReupload,
  isUploading,
  onViewResults,
  hasPartialSuccess,
  hasSuccessfulSubmission,
  showPositionAndPay = true,
  customEditDialog,
}: ReviewStepProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<T | null>(null);

  const importSummary = useMemo(() => createImportSummary(csvData), [csvData]);
  const validRows = importSummary.validRows;
  const errorRows = importSummary.errorRows;

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return csvData;

    const query = searchQuery.toLowerCase().trim();
    return csvData.filter((row) => {
      const fullName = `${row.first_name} ${row.last_name}`.toLowerCase();
      const email = row.email?.toLowerCase() || '';
      return fullName.includes(query) || email.includes(query);
    });
  }, [csvData, searchQuery]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  const handleEditClick = useCallback(
    (index: number) => {
      setEditingRow(index);
      setEditFormData({ ...csvData[index] });
    },
    [csvData]
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

  const handleDeleteClick = useCallback(
    (index: number) => {
      if (onDeleteRow) {
        onDeleteRow(index);
      }
    },
    [onDeleteRow]
  );

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Validate and Review
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Review your import data before submission. You can edit or remove
            individual rows as needed.
          </Typography>
        </Box>

        {/* Inline Summary Stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              {importSummary.total}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
          </Box>
          <Box
            sx={{
              width: '1px',
              height: '32px',
              backgroundColor: 'divider',
            }}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: 'success.main' }}
            >
              {importSummary.valid}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Valid
            </Typography>
          </Box>
          <Box
            sx={{
              width: '1px',
              height: '32px',
              backgroundColor: 'divider',
            }}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: importSummary.errors > 0 ? 'error.main' : 'text.primary',
              }}
            >
              {importSummary.errors}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Errors
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Search and Warning */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 320,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
            },
          }}
        />

        {errorRows.length > 0 && (
          <Alert
            severity="warning"
            variant="outlined"
            sx={{ py: 0.5, px: 2, borderRadius: 1 }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {errorRows.length} row(s) have validation errors — edit or remove
              before importing
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Employee List - Compact Table Style */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: 'white',
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
              width: 140,
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
              width: 180,
              fontWeight: 600,
              color: 'text.secondary',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            Email
          </Typography>
          {showPositionAndPay && (
            <>
              <Typography
                variant="caption"
                sx={{
                  width: 140,
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                Position
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  width: 120,
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                Pay Info
              </Typography>
            </>
          )}
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
            Status
          </Typography>
          <Box sx={{ width: 100, textAlign: 'right' }}>
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
            maxHeight: 600,
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
          {filteredData.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <SearchIcon
                sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5 }}
              />
              <Typography variant="body2" color="text.secondary">
                No employees match your search
              </Typography>
            </Box>
          ) : (
            filteredData.map((row, _index) => {
              const originalIndex = csvData.indexOf(row);
              return (
                <Box key={originalIndex}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      py: 1.25,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      borderLeft:
                        row.submitted || row.errors ? '3px solid' : 'none',
                      borderLeftColor: row.submitted
                        ? 'success.main'
                        : 'error.main',
                      backgroundColor: row.submitted
                        ? 'success.lighter'
                        : row.errors
                        ? 'error.lighter'
                        : 'transparent',
                      transition: 'background-color 0.15s ease',
                      opacity: row.submitted ? 0.7 : 1,
                      '&:hover': {
                        backgroundColor: row.submitted
                          ? 'success.lighter'
                          : row.errors
                          ? 'error.lighter'
                          : 'grey.50',
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
                      {originalIndex + 1}
                    </Typography>
                    <Box
                      sx={{
                        width: 140,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.first_name} {row.last_name}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 180,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.8125rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.email}
                      </Typography>
                    </Box>
                    {showPositionAndPay && (
                      <>
                        <Box
                          sx={{
                            width: 140,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.8125rem',
                              color: (row as any).job
                                ? 'text.primary'
                                : 'text.disabled',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {(row as any).job || '—'}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 120,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.75rem',
                              color: formatPayInfo(row)
                                ? 'text.secondary'
                                : 'text.disabled',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {formatPayInfo(row) || '—'}
                          </Typography>
                        </Box>
                      </>
                    )}
                    <Box
                      sx={{
                        flex: 1,
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
                          label={
                            row.submitted
                              ? 'Submitted'
                              : row.errors?.submission
                              ? 'Failed'
                              : row.errors
                              ? 'Has Errors'
                              : 'Valid'
                          }
                          color={
                            row.submitted
                              ? 'success'
                              : row.errors
                              ? 'error'
                              : 'success'
                          }
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
                            lineHeight: '1.4',
                          }}
                        >
                          {row.errors.submission}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        width: 100,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 0.5,
                      }}
                    >
                      {onUpdateRow && (
                        <Tooltip
                          title={row.submitted ? 'Already submitted' : 'Edit'}
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(originalIndex)}
                              sx={{ p: 0.5 }}
                              disabled={row.submitted}
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                      {onDeleteRow && (
                        <Tooltip
                          title={row.submitted ? 'Already submitted' : 'Remove'}
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(originalIndex)}
                              sx={{ p: 0.5, color: 'error.main' }}
                              disabled={row.submitted}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Box>

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
                    pt: 2,
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

      {/* Results Summary */}
      {searchQuery &&
        filteredData.length > 0 &&
        filteredData.length < csvData.length && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 1, textAlign: 'right' }}
          >
            Showing {filteredData.length} of {csvData.length}
          </Typography>
        )}

      {/* Actions */}
      <Box
        sx={{
          mt: 3,
          pt: 2.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={onBack} variant="outlined" startIcon={<ArrowBack />}>
            Back to Upload
          </Button>
          {onReupload && (
            <Button
              variant="outlined"
              component="label"
              disabled={isUploading || isSubmitting}
              startIcon={<UploadIcon />}
            >
              <span>{isUploading ? 'Uploading...' : 'Re-upload File'}</span>
              <input
                type="file"
                accept=".xlsx"
                hidden
                onChange={onReupload}
                disabled={isUploading || isSubmitting}
              />
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isSubmitting && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="caption" color="text.secondary">
                Processing...
              </Typography>
              <LinearProgress
                variant="determinate"
                value={submitProgress}
                sx={{ width: 100, height: 4, borderRadius: 2 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, minWidth: 35 }}
              >
                {submitProgress}%
              </Typography>
            </Box>
          )}
          {hasPartialSuccess && onViewResults && (
            <Button
              variant="outlined"
              onClick={onViewResults}
              size="large"
              disabled={isSubmitting}
            >
              View Results
            </Button>
          )}
          <LoadingButton
            variant="contained"
            onClick={onSubmit}
            disabled={validRows.length === 0 || hasSuccessfulSubmission}
            loading={isSubmitting}
            size="large"
          >
            {hasSuccessfulSubmission
              ? 'Successfully Submitted'
              : hasPartialSuccess
              ? `Retry ${validRows.length} Failed`
              : `Import ${validRows.length} Employee${
                  validRows.length !== 1 ? 's' : ''
                }`}
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
}
