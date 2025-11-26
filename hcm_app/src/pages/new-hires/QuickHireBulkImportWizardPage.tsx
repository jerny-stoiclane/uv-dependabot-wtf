import { PageSpinner, useNotifications } from '@armhr/ui';
import {
  ArrowBack as ArrowBackIcon,
  TableChart as TableChartIcon,
} from '@mui/icons-material';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import {
  FileDropzone,
  ResultsStep,
  ReviewStep,
  WizardProgress,
} from '../../components/onboarding/bulk-import';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { WIZARD_STEPS } from '../../utils/constants';
import { paths } from '../../utils/paths';

const QuickHireBulkImportWizardPage: React.FC = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { showNotification } = useNotifications();

  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [csvData, setCsvData] = useState<QuickHireRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitResults, setSubmitResults] = useState<{
    successful: number;
    failed: number;
    errors: any[];
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [failedRows, setFailedRows] = useState<QuickHireRow[]>([]);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [resubmitProgress, setResubmitProgress] = useState(0);
  const [hasSuccessfulSubmission, setHasSuccessfulSubmission] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resubmitError, setResubmitError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successfulEmployees, setSuccessfulEmployees] = useState<
    Array<{ first_name: string; last_name: string; email: string }>
  >([]);

  // Fetch company data for validation
  const { data: company, loading: companyLoading } = useApiData<Company>(
    (api) => api.company.getCompany()
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      const isExcel =
        file.name.endsWith('.xlsx') ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      // Validate file type
      if (!isExcel) {
        setUploadError('Please upload a valid Excel file (.xlsx)');
        return;
      }

      setIsUploading(true);
      setUploadError(null);
      setSubmitResults(null);
      setSubmitError(null);
      setFailedRows([]);
      setSuccessfulEmployees([]);

      try {
        // Handle Excel file - backend will parse
        const response = await api.onboarding.uploadQuickHireExcelFile(file);
        const parsedData = response.results.map((row: any, idx: number) => ({
          ...row,
          rowIndex: idx + 2, // Excel rows start at 2
        }));

        setCsvData(parsedData as QuickHireRow[]);
        setActiveStep(1);

        showNotification({
          message: `Successfully loaded ${parsedData.length} rows from Excel file`,
          severity: 'success',
          autoHideDuration: 5000,
        });
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : 'Error reading Excel file'
        );
      } finally {
        setIsUploading(false);
      }
    },
    [company?.id, showNotification, api]
  );

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      await handleFileSelect(file);

      // Reset file input
      event.target.value = '';
    },
    [handleFileSelect]
  );

  const handleDownloadExcelTemplate = useCallback(async () => {
    try {
      const blob = await api.onboarding.downloadQuickHireExcelTemplate();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quick_hire_template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNotification({
        message: 'Excel template downloaded successfully',
        severity: 'success',
        autoHideDuration: 3000,
      });
    } catch (error) {
      console.error('Error downloading Excel template:', error);
      showNotification({
        message: 'Failed to download Excel template. Please try again.',
        severity: 'error',
      });
    }
  }, [api, showNotification]);

  const handleUpdateRow = useCallback(
    (index: number, updatedRow: QuickHireRow) => {
      setCsvData((prevData) => {
        const newData = [...prevData];
        newData[index] = updatedRow;
        return newData;
      });
    },
    []
  );

  const handleDeleteRow = useCallback(
    (index: number) => {
      setCsvData((prevData) => {
        const newData = prevData.filter((_, i) => i !== index);

        // Check if all remaining rows are submitted after deletion
        const allRemainingSubmitted = newData.every((row) => row.submitted);

        // If all remaining rows are submitted, advance to results
        if (allRemainingSubmitted && newData.length > 0 && submitResults) {
          setActiveStep(2);
          setHasSuccessfulSubmission(true);
          showNotification({
            message: `All remaining employees have been successfully imported`,
            severity: 'success',
          });
        }

        return newData;
      });
    },
    [submitResults, showNotification]
  );

  const handleUpdateFailedRow = useCallback(
    (index: number, updatedRow: QuickHireRow) => {
      setFailedRows((prevData) => {
        const newData = [...prevData];
        newData[index] = updatedRow;
        return newData;
      });
    },
    []
  );

  const handleResubmit = useCallback(async () => {
    if (failedRows.length === 0) return;

    setIsResubmitting(true);
    setResubmitProgress(0);
    setResubmitError(null);

    try {
      // Only process rows that haven't been submitted and don't have errors
      const validData = failedRows.filter(
        (row) => !row.errors && !row.submitted
      );
      const successfulRows: number[] = [];
      const newFailedRows: { row: number; email: string; error: string }[] = [];
      const newSuccessful: Array<{
        first_name: string;
        last_name: string;
        email: string;
      }> = [];

      // Process each row individually
      for (let i = 0; i < validData.length; i++) {
        const row = validData[i];
        const rowIndex = failedRows.indexOf(row);

        try {
          await api.onboarding.createNewHireRequest({
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email.trim(),
          });

          successfulRows.push(rowIndex);
          newSuccessful.push({
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
          });

          // Mark row as submitted in failedRows
          setFailedRows((prev) => {
            const updated = [...prev];
            updated[rowIndex] = {
              ...updated[rowIndex],
              submitted: true,
            };
            return updated;
          });
        } catch (err: any) {
          const response = err?.response?.data;
          let errorMessage: string;

          // Handle Pydantic errors
          if (Array.isArray(response?.detail)) {
            const { msg, loc } = response.detail[0] || {};
            const key = loc?.[1];
            errorMessage = key ? `${key}: ${msg}` : msg || 'Validation error';
          } else if (typeof response?.detail === 'string') {
            errorMessage = response.detail;
          } else {
            errorMessage = err?.message || 'Failed to create new hire request';
          }

          newFailedRows.push({
            row: rowIndex + 1,
            email: row.email,
            error: errorMessage,
          });

          // Update the failed row with error info
          setFailedRows((prev) => {
            const updated = [...prev];
            updated[rowIndex] = {
              ...updated[rowIndex],
              errors: {
                ...updated[rowIndex].errors,
                submission: errorMessage,
              },
            };
            return updated;
          });
        }

        // Update progress
        setResubmitProgress(Math.round(((i + 1) / validData.length) * 100));
      }

      // Remove successful rows from failed rows FIRST
      let remainingFailedRows = failedRows;
      if (successfulRows.length > 0) {
        remainingFailedRows = failedRows.filter(
          (_, index) => !successfulRows.includes(index)
        );
        setFailedRows(remainingFailedRows);
        // Append newly successful employees to the existing list
        setSuccessfulEmployees((prev) => [...prev, ...newSuccessful]);
      }

      // Update submit results
      const currentSuccessful = submitResults?.successful || 0;
      const newTotalSuccessful = currentSuccessful + successfulRows.length;
      const totalRemainingFailed = remainingFailedRows.length; // Count of rows still needing retry

      setSubmitResults({
        successful: newTotalSuccessful,
        failed: totalRemainingFailed, // Use remaining failed rows, not newFailedRows
        errors: newFailedRows,
      });

      // Check if all rows are now submitted (using calculated total, not state which is async)
      const allRowsNowSubmitted = newTotalSuccessful === csvData.length;

      // Only move to results screen if every single row has been successfully submitted
      if (newFailedRows.length === 0 && allRowsNowSubmitted) {
        setActiveStep(2);
        setHasSuccessfulSubmission(true);
        showNotification({
          message: `Successfully imported all ${csvData.length} employee${
            csvData.length !== 1 ? 's' : ''
          }`,
          severity: 'success',
        });
      } else if (newFailedRows.length === 0) {
        // Some retries succeeded but not all rows are done yet
        showNotification({
          message: `Successfully resubmitted ${successfulRows.length} employee${
            successfulRows.length !== 1 ? 's' : ''
          }`,
          severity: 'success',
        });
      }
      // Note: When resubmit has failures, we stay on review step
    } catch (error) {
      setResubmitError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while resubmitting rows'
      );
    } finally {
      setIsResubmitting(false);
    }
  }, [failedRows, api, showNotification, submitResults]);

  const handleSubmit = useCallback(async () => {
    if (csvData.length === 0) return;

    setIsSubmitting(true);
    setSubmitProgress(0);
    setSubmitError(null);

    try {
      // Filter out rows that are already submitted or have errors
      const validData = csvData.filter((row) => !row.errors && !row.submitted);
      const successfulRows: number[] = [];
      const failedRows: { row: number; email: string; error: string }[] = [];
      const successful: Array<{
        first_name: string;
        last_name: string;
        email: string;
      }> = [];

      // Process each row individually (mimics NewHireRequestQuickHirePage)
      for (let i = 0; i < validData.length; i++) {
        const row = validData[i];
        const rowIndex = csvData.indexOf(row);

        try {
          await api.onboarding.createNewHireRequest({
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email.trim(),
          });

          successfulRows.push(rowIndex);
          successful.push({
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
          });

          // Mark row as submitted to prevent resubmission
          setCsvData((prev) => {
            const updated = [...prev];
            updated[rowIndex] = {
              ...updated[rowIndex],
              submitted: true,
            };
            return updated;
          });
        } catch (err: any) {
          const response = err?.response?.data;
          let errorMessage: string;

          // Handle Pydantic errors
          if (Array.isArray(response?.detail)) {
            const { msg, loc } = response.detail[0] || {};
            const key = loc?.[1];
            errorMessage = key ? `${key}: ${msg}` : msg || 'Validation error';
          } else if (typeof response?.detail === 'string') {
            errorMessage = response.detail;
          } else {
            errorMessage = err?.message || 'Failed to create new hire request';
          }

          failedRows.push({
            row: rowIndex + 1,
            email: row.email,
            error: errorMessage,
          });

          // Update the row with error info so it can be edited
          setCsvData((prev) => {
            const updated = [...prev];
            updated[rowIndex] = {
              ...updated[rowIndex],
              errors: {
                ...updated[rowIndex].errors,
                submission: errorMessage,
              },
            };
            return updated;
          });
        }

        // Update progress
        setSubmitProgress(Math.round(((i + 1) / validData.length) * 100));
      }

      setSubmitResults({
        successful: successfulRows.length,
        failed: failedRows.length,
        errors: failedRows,
      });

      // Store failed rows for the results page
      const failed = csvData.filter((row) => row.errors?.submission);
      setFailedRows(failed);
      setSuccessfulEmployees(successful);

      // Check if this was a complete success (all submitted rows succeeded and there were no prior submissions)
      // validData represents rows we tried to submit this time
      const wasCompleteSuccess =
        failedRows.length === 0 && validData.length === csvData.length;

      if (wasCompleteSuccess) {
        // All rows successfully submitted on first try - move to results
        setActiveStep(2);
        setHasSuccessfulSubmission(true);
        showNotification({
          message: `Successfully imported all ${csvData.length} employee${
            csvData.length !== 1 ? 's' : ''
          }`,
          severity: 'success',
          autoHideDuration: 5000,
        });
      }
      // Note: When there are failures, we stay on review step
      // The partial failure alert will be shown automatically since submitResults is set
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while submitting the import'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [csvData, api, showNotification]);

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      if (stepIndex === 0) {
        setActiveStep(0);
        setSubmitResults(null);
        setSubmitError(null);
        setResubmitError(null);
        setUploadError(null);
        setSuccessfulEmployees([]);
      } else if (stepIndex === 1) {
        if (csvData.length > 0) {
          setActiveStep(1);
          setResubmitError(null);
          setUploadError(null);
        }
      } else if (stepIndex === 2) {
        if (submitResults) {
          setActiveStep(2);
          setSubmitError(null);
        }
      }
    },
    [csvData.length, submitResults]
  );

  const isStepClickable = useCallback(
    (stepIndex: number) => {
      if (stepIndex === 0) return true;
      if (stepIndex === 1) return csvData.length > 0;
      if (stepIndex === 2) return !!submitResults;
      return false;
    },
    [csvData.length, submitResults]
  );

  if (companyLoading) return <PageSpinner />;

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Start the new hire process
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Download the template, fill it with employee data, then upload
                it back to send onboarding invitations to your new hires.
              </Typography>
            </Box>

            {uploadError && (
              <Alert
                severity="error"
                onClose={() => setUploadError(null)}
                sx={{ mb: 3 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Upload Error
                </Typography>
                <Typography variant="body2">{uploadError}</Typography>
              </Alert>
            )}

            <Alert severity="info" variant="outlined" sx={{ mb: 3, py: 1.5 }}>
              Required fields: First Name, Last Name, Email
            </Alert>

            <FileDropzone
              onFileSelect={handleFileSelect}
              isUploading={isUploading}
              title="Drag & drop or upload your file"
              description="Fill out the template with employee information, then drag or upload to send onboarding invitations"
              uploadButtonText="Upload quick hires"
              templateButton={
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<TableChartIcon />}
                  onClick={handleDownloadExcelTemplate}
                >
                  Excel template
                </Button>
              }
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            {submitError && (
              <Alert
                severity="error"
                onClose={() => setSubmitError(null)}
                sx={{ mb: 3 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Submission Error
                </Typography>
                <Typography variant="body2">{submitError}</Typography>
              </Alert>
            )}
            {submitResults && submitResults.failed > 0 && (
              <Alert
                severity={submitResults.successful === 0 ? 'error' : 'warning'}
                onClose={() => setSubmitResults(null)}
                sx={{ mb: 3 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {submitResults.successful === 0
                    ? 'Import failed'
                    : 'Import completed with errors'}
                </Typography>
                <Typography variant="body2">
                  {submitResults.successful} successful, {submitResults.failed}{' '}
                  failed. Fix errors and resubmit.
                </Typography>
              </Alert>
            )}
            <ReviewStep
              csvData={csvData}
              onSubmit={handleSubmit}
              onBack={() => setActiveStep(0)}
              isSubmitting={isSubmitting}
              submitProgress={submitProgress}
              onUpdateRow={handleUpdateRow}
              onDeleteRow={handleDeleteRow}
              onReupload={handleFileUpload}
              isUploading={isUploading}
              hasPartialSuccess={
                submitResults !== null &&
                submitResults.successful > 0 &&
                submitResults.failed > 0
              }
              hasSuccessfulSubmission={hasSuccessfulSubmission}
              onViewResults={() => setActiveStep(2)}
              showPositionAndPay={false}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            {resubmitError && (
              <Alert
                severity="error"
                onClose={() => setResubmitError(null)}
                sx={{ mb: 3 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Resubmission Error
                </Typography>
                <Typography variant="body2">{resubmitError}</Typography>
              </Alert>
            )}
            {submitResults &&
              submitResults.failed > 0 &&
              failedRows.length > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Some rows still need attention
                  </Typography>
                  <Typography variant="body2">
                    {failedRows.length} row
                    {failedRows.length !== 1 ? (
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
              submitResults={submitResults}
              onStartNew={() => {
                setCsvData([]);
                setSubmitResults(null);
                setFailedRows([]);
                setHasSuccessfulSubmission(false);
                setSubmitError(null);
                setResubmitError(null);
                setUploadError(null);
                setSuccessfulEmployees([]);
                setActiveStep(0);
              }}
              failedRows={failedRows}
              onUpdateRow={handleUpdateFailedRow}
              onResubmit={handleResubmit}
              isResubmitting={isResubmitting}
              resubmitProgress={resubmitProgress}
              successfulEmployees={successfulEmployees}
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
        <title>Quick Hire Bulk Import | Armhr</title>
        <meta name="description" content="Bulk import quick hire data" />
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
          <Typography variant="h2">Bulk import quick hires</Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: 400 }}
          >
            Begin the new hire process with just a name and email address.
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
        activeStep={activeStep}
        onStepClick={handleStepClick}
        isStepClickable={isStepClickable}
      />

      <Box>{renderStepContent()}</Box>
    </Box>
  );
};

export default QuickHireBulkImportWizardPage;
