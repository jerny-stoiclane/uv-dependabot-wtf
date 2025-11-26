import { PageSpinner, useNotifications } from '@armhr/ui';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import {
  PrehireUploadStep,
  ResultsStep,
  ReviewStep,
  WizardProgress,
} from '../../components/onboarding/bulk-import';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { useBulkImportState } from '../../hooks/useBulkImportState';
import { usePrehireImport } from '../../hooks/usePrehireImport';
import { WIZARD_STEPS } from '../../utils/constants';
import { paths } from '../../utils/paths';
import PrehireRowEditDialog from './PrehireRowEditDialog';

const PrehireBulkImportWizardPage: React.FC = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { showNotification } = useNotifications();

  // State management using custom hook
  const [state, actions] = useBulkImportState<PrehireRow>();
  const [selectedRequestIds, setSelectedRequestIds] = useState<number[]>([]);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  // Fetch company data for validation
  const { data: company, loading: companyLoading } = useApiData((api) =>
    api.company.getCompany()
  );

  // Fetch ready for onboarding requests
  const { data: readyForOnboarding } = useApiData<NewHireRequest[]>((api) =>
    api.onboarding.getNewHireRequests()
  );

  // Fetch prehire fields for validation
  const { data: prehireFields, loading: prehireFieldsLoading } =
    useApiData<PrehireFields>((api) => api.onboarding.getPrehireFields());

  // Fetch user access for filtering options
  const { data: access, loading: accessLoading } = useApiData<UserAccess>(
    (api) => api.profiles.getUserAccess()
  );

  // Fetch company codes for dropdowns
  const { data: codes, loading: codesLoading } = useApiData<CompanyCode>(
    (api) => api.company.getCodes()
  );

  // Fetch managers for manager field
  const { data: managers, loading: managersLoading } = useApiData<
    PrismSecurityUser[]
  >((api) => api.company.getActivePrismUsers());

  // Filter and sort ready for onboarding employees
  const readyForOnboardingFiltered = useMemo(() => {
    if (!readyForOnboarding) return [];
    return readyForOnboarding
      .filter((r) => r.fsm_state === 'user_partial_complete')
      .sort((a, b) => {
        const aComplete = a.has_ssn && a.has_birth_date && a.has_gender;
        const bComplete = b.has_ssn && b.has_birth_date && b.has_gender;
        if (aComplete && !bComplete) return -1;
        if (!aComplete && bComplete) return 1;
        return 0;
      });
  }, [readyForOnboarding]);

  // Calculate complete and incomplete counts
  const employeeCounts = useMemo(() => {
    const complete = readyForOnboardingFiltered.filter(
      (r) => r.has_ssn && r.has_birth_date && r.has_gender
    ).length;
    const incomplete = readyForOnboardingFiltered.length - complete;
    return { complete, incomplete, total: readyForOnboardingFiltered.length };
  }, [readyForOnboardingFiltered]);

  // Select only requests with SSN, DOB, and Gender by default
  useEffect(() => {
    if (
      readyForOnboardingFiltered.length > 0 &&
      selectedRequestIds.length === 0
    ) {
      const completeIds = readyForOnboardingFiltered
        .filter((r) => r.has_ssn && r.has_birth_date && r.has_gender)
        .map((r) => r.id)
        .filter((id): id is number => id !== undefined);
      setSelectedRequestIds(completeIds);
    }
  }, [readyForOnboardingFiltered, selectedRequestIds.length]);

  // Prehire import business logic
  const { handleFileSelect, handleSubmit } = usePrehireImport({
    prehireFields,
    company: (company as Company) || null,
    readyForOnboarding: readyForOnboardingFiltered,
    onUploadSuccess: (data) => {
      actions.setCsvData(data);
      actions.setActiveStep(1);
    },
    onUploadError: (error) => {
      actions.setUploadError(error);
    },
    onSubmitSuccess: (results) => {
      actions.setSubmitResults(results);
      // Only advance if all rows are submitted
      if (results.failed === 0 && results.allRowsSubmitted) {
        actions.setActiveStep(2);
        actions.setHasSuccessfulSubmission(true);
      }
    },
    onSubmitError: (error) => {
      actions.setSubmitError(error);
    },
    updateCsvData: actions.setCsvData,
    setFailedRows: actions.setFailedRows,
    setIsUploading: actions.setIsUploading,
    setIsSubmitting: actions.setIsSubmitting,
    setSubmitProgress: actions.setSubmitProgress,
  });

  // Selection handlers
  const handleToggleRequest = useCallback((requestId: number) => {
    setSelectedRequestIds((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = readyForOnboardingFiltered
      .map((r) => r.id)
      .filter((id): id is number => id !== undefined);
    setSelectedRequestIds(allIds);
  }, [readyForOnboardingFiltered]);

  const handleDeselectAll = useCallback(() => {
    setSelectedRequestIds([]);
  }, []);

  // Template download handlers
  const handleDownloadExcelTemplate = useCallback(async () => {
    if (selectedRequestIds.length === 0) {
      showNotification({
        message:
          'Please select at least one employee to include in the template.',
        severity: 'warning',
      });
      return;
    }

    setIsDownloadingTemplate(true);
    try {
      const blob = await api.onboarding.downloadPrehireExcelTemplate(
        selectedRequestIds
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prehire_completion_template_${selectedRequestIds.length}_employees.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNotification({
        message: `Excel template downloaded with ${
          selectedRequestIds.length
        } employee${selectedRequestIds.length !== 1 ? 's' : ''}`,
        severity: 'success',
        autoHideDuration: 3000,
      });
    } catch (error) {
      console.error('Error downloading Excel template:', error);
      showNotification({
        message: 'Failed to download Excel template. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsDownloadingTemplate(false);
    }
  }, [api, showNotification, selectedRequestIds]);

  // Row update handlers
  const handleUpdateRow = useCallback(
    (index: number, updatedRow: PrehireRow) => {
      actions.setCsvData((prevData) => {
        const newData = [...prevData];
        newData[index] = updatedRow;
        return newData;
      });
    },
    [actions]
  );

  const handleDeleteRow = useCallback(
    (index: number) => {
      actions.setCsvData((prevData) => {
        const newData = prevData.filter((_, i) => i !== index);

        // Check if all remaining rows are submitted after deletion
        const allRemainingSubmitted = newData.every((row) => row.submitted);

        // If all remaining rows are submitted, advance to results
        if (
          allRemainingSubmitted &&
          newData.length > 0 &&
          state.submitResults
        ) {
          actions.setActiveStep(2);
          actions.setHasSuccessfulSubmission(true);
          showNotification({
            message: `All remaining employees have been successfully imported`,
            severity: 'success',
          });
        }

        return newData;
      });
    },
    [actions, state.submitResults, showNotification]
  );

  const handleUpdateFailedRow = useCallback(
    (index: number, updatedRow: PrehireRow) => {
      actions.setFailedRows((prevData) => {
        const newData = [...prevData];
        newData[index] = updatedRow;
        return newData;
      });
    },
    [actions]
  );

  // Resubmit handler
  const handleResubmit = useCallback(async () => {
    if (state.failedRows.length === 0) return;

    actions.setIsResubmitting(true);
    actions.setResubmitProgress(0);
    actions.setResubmitError(null);

    try {
      // Only process rows that haven't been submitted and don't have errors
      const validData = state.failedRows.filter(
        (row) => !row.errors && !row.submitted
      );

      if (validData.length === 0) {
        showNotification({
          message: 'No valid rows to resubmit',
          severity: 'warning',
        });
        return;
      }

      const prehireRequests: NewHireRequestPrehireForm[] = validData.map(
        (row): NewHireRequestPrehireForm => ({
          new_hire_request_id:
            typeof row.new_hire_request_id === 'string'
              ? parseInt(row.new_hire_request_id, 10)
              : row.new_hire_request_id,
          client_id: row.client_id,
          first_name: row.first_name || '',
          last_name: row.last_name || '',
          middle_initial: row.middle_initial,
          preferred_name: row.preferred_name,
          birth_date: row.birth_date,
          gender: row.gender,
          marital_status: row.marital_status,
          ethnicity: row.ethnicity,
          preferred_language: row.preferred_language,
          ssn: row.ssn,
          personal_email: row.personal_email || row.email,
          work_email: row.work_email,
          home_phone: row.home_phone,
          mobile_phone: row.mobile_phone,
          address_line_1: row.address_line_1,
          address_line_2: row.address_line_2,
          city: row.city,
          state_code: row.state_code,
          zip_code: row.zip_code,
          emergency_contact_name: row.emergency_contact_name,
          emergency_contact_info: row.emergency_contact_info,
          emergency_contact_relationship: row.emergency_contact_relationship,
          location: row.location,
          job: row.job,
          department: row.department,
          division: row.division,
          shift: row.shift,
          start_date: row.start_date,
          employee_type: row.employee_type,
          benefits_group: row.benefits_group,
          employee_number: row.employee_number,
          supervisor: row.supervisor,
          manager: row.manager,
          project: row.project,
          work_group: row.work_group,
          pay_group: row.pay_group,
          pay_method: row.pay_method,
          pay_rate: row.pay_rate,
          pay_period: row.pay_period,
          standard_hours: row.standard_hours,
          default_time_sheet_hours: row.default_time_sheet_hours,
          first_pay_period_hours: row.first_pay_period_hours,
          auto_time_sheet: row.auto_time_sheet || 'N',
          fed_filing_status: row.fed_filing_status,
          fed_allowances: row.fed_allowances,
          citizenship_status: row.citizenship_status,
        })
      );

      const response = await api.onboarding.bulkCompletePrehireRequests(
        prehireRequests
      );

      const successfulIndices: number[] = [];

      // Mark successful rows
      response.results.completed.forEach((success) => {
        const rowIndex = validData.findIndex(
          (r) => r.new_hire_request_id === success.new_hire_request_id
        );
        if (rowIndex !== -1) {
          const failedRowsIndex = state.failedRows.indexOf(validData[rowIndex]);
          successfulIndices.push(failedRowsIndex);

          // Mark row as submitted in failedRows
          actions.setFailedRows((prev) => {
            const updated = [...prev];
            updated[failedRowsIndex] = {
              ...updated[failedRowsIndex],
              submitted: true,
            };
            return updated;
          });
        }
      });

      // Update rows with errors
      response.results.errors.forEach((error) => {
        const rowIndex = validData.findIndex(
          (r) => r.new_hire_request_id === error.new_hire_request_id
        );
        if (rowIndex !== -1) {
          const failedRowsIndex = state.failedRows.indexOf(validData[rowIndex]);
          actions.setFailedRows((prev) => {
            const updated = [...prev];
            updated[failedRowsIndex] = {
              ...updated[failedRowsIndex],
              errors: {
                ...updated[failedRowsIndex].errors,
                submission: error.error,
              },
            };
            return updated;
          });
        }
      });

      // Remove successful rows from failed rows FIRST
      let remainingFailedRows = state.failedRows;
      if (successfulIndices.length > 0) {
        remainingFailedRows = state.failedRows.filter(
          (_, index) => !successfulIndices.includes(index)
        );
        actions.setFailedRows(remainingFailedRows);
      }

      // Update submit results
      const currentSuccessful = state.submitResults?.successful || 0;
      const newTotalSuccessful =
        currentSuccessful + response.results.successful;
      const totalRemainingFailed = remainingFailedRows.length; // Count of rows still needing retry

      actions.setSubmitResults({
        successful: newTotalSuccessful,
        failed: totalRemainingFailed, // Use remaining failed rows, not response.results.failed
        errors: response.results.errors,
      });

      // Update progress
      for (let i = 0; i < validData.length; i++) {
        actions.setResubmitProgress(
          Math.round(((i + 1) / validData.length) * 100)
        );
      }

      // Check if all rows are now submitted (using calculated total, not state which is async)
      const allRowsNowSubmitted = newTotalSuccessful === state.csvData.length;

      // Only move to results screen if every single row has been successfully submitted
      if (response.results.failed === 0 && allRowsNowSubmitted) {
        actions.setActiveStep(2);
        actions.setHasSuccessfulSubmission(true);
        showNotification({
          message: `Successfully imported all ${state.csvData.length} employee${
            state.csvData.length !== 1 ? 's' : ''
          }`,
          severity: 'success',
        });
      } else if (response.results.failed === 0) {
        // Some retries succeeded but not all rows are done yet
        showNotification({
          message: `Successfully resubmitted ${
            response.results.successful
          } employee${response.results.successful !== 1 ? 's' : ''}`,
          severity: 'success',
        });
      }
      // Note: When resubmit has failures, we stay on review step
    } catch (error) {
      actions.setResubmitError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while resubmitting rows'
      );
    } finally {
      actions.setIsResubmitting(false);
    }
  }, [state.failedRows, state.submitResults, actions, api, showNotification]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      await handleFileSelect(file);
      event.target.value = '';
    },
    [handleFileSelect]
  );

  if (
    companyLoading ||
    prehireFieldsLoading ||
    accessLoading ||
    codesLoading ||
    managersLoading
  )
    return <PageSpinner />;

  const renderStepContent = () => {
    switch (state.activeStep) {
      case 0:
        return (
          <PrehireUploadStep
            readyForOnboarding={readyForOnboardingFiltered}
            selectedRequestIds={selectedRequestIds}
            employeeCounts={employeeCounts}
            uploadError={state.uploadError}
            isUploading={state.isUploading}
            isDownloadingTemplate={isDownloadingTemplate}
            onFileSelect={handleFileSelect}
            onToggleRequest={handleToggleRequest}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onDownloadExcelTemplate={handleDownloadExcelTemplate}
            onClearUploadError={() => actions.setUploadError(null)}
          />
        );

      case 1:
        return (
          <Box>
            {state.submitError && (
              <Alert
                severity="error"
                onClose={() => actions.setSubmitError(null)}
                sx={{ mb: 3 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Submission Error
                </Typography>
                <Typography variant="body2">{state.submitError}</Typography>
              </Alert>
            )}
            {state.submitResults && state.submitResults.failed > 0 && (
              <Alert
                severity={
                  state.submitResults.successful === 0 ? 'error' : 'warning'
                }
                onClose={() => actions.setSubmitResults(null)}
                sx={{ mb: 3 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {state.submitResults.successful === 0
                    ? 'Import failed'
                    : 'Import completed with errors'}
                </Typography>
                <Typography variant="body2">
                  {state.submitResults.successful} successful,{' '}
                  {state.submitResults.failed} failed. Fix errors and resubmit.
                </Typography>
              </Alert>
            )}
            <ReviewStep
              csvData={state.csvData}
              onSubmit={() => handleSubmit(state.csvData)}
              onBack={() => actions.setActiveStep(0)}
              isSubmitting={state.isSubmitting}
              submitProgress={state.submitProgress}
              onUpdateRow={handleUpdateRow}
              onDeleteRow={handleDeleteRow}
              onReupload={handleFileUpload}
              isUploading={state.isUploading}
              hasPartialSuccess={
                state.submitResults !== null &&
                state.submitResults.successful > 0 &&
                state.submitResults.failed > 0
              }
              hasSuccessfulSubmission={state.hasSuccessfulSubmission}
              onViewResults={() => actions.setActiveStep(2)}
              customEditDialog={({ open, row, onClose, onSave }) => (
                <PrehireRowEditDialog
                  open={open}
                  row={row}
                  onClose={onClose}
                  onSave={onSave}
                  prehireFields={prehireFields}
                  codes={codes}
                  managers={managers}
                  access={access}
                />
              )}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            {state.resubmitError && (
              <Alert
                severity="error"
                onClose={() => actions.setResubmitError(null)}
                sx={{ mb: 3 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Resubmission Error
                </Typography>
                <Typography variant="body2">{state.resubmitError}</Typography>
              </Alert>
            )}
            {state.submitResults &&
              state.submitResults.failed > 0 &&
              state.failedRows.length > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Some rows still need attention
                  </Typography>
                  <Typography variant="body2">
                    {state.failedRows.length} row
                    {state.failedRows.length !== 1 ? (
                      <span>s</span>
                    ) : (
                      <span></span>
                    )}{' '}
                    <span>
                      still have errors. Fix them and click retry to resubmit.
                    </span>
                  </Typography>
                </Alert>
              )}
            <ResultsStep
              submitResults={state.submitResults}
              onStartNew={actions.resetState}
              failedRows={state.failedRows}
              onUpdateRow={handleUpdateFailedRow}
              onResubmit={handleResubmit}
              isResubmitting={state.isResubmitting}
              resubmitProgress={state.resubmitProgress}
              customEditDialog={({ open, row, onClose, onSave }) => (
                <PrehireRowEditDialog
                  open={open}
                  row={row}
                  onClose={onClose}
                  onSave={onSave}
                  prehireFields={prehireFields}
                  codes={codes}
                  managers={managers}
                  access={access}
                />
              )}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Helmet>
        <title>Bulk submit employees | Armhr</title>
        <meta name="description" content="Bulk submit employees" />
      </Helmet>

      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography variant="h2" gutterBottom>
            Bulk submit employees
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: 400 }}
          >
            Complete onboarding with comprehensive employment information
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(paths.newHires)}
          sx={{ flexShrink: 0 }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <WizardProgress
        steps={WIZARD_STEPS}
        activeStep={state.activeStep}
        onStepClick={actions.handleStepClick}
        isStepClickable={actions.isStepClickable}
      />

      <Box>{renderStepContent()}</Box>
    </Box>
  );
};

export default PrehireBulkImportWizardPage;
