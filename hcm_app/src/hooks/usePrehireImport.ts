import { useNotifications } from '@armhr/ui';
import { useCallback } from 'react';

import { validatePrehireRow } from '../utils/importUtils';
import { useApi } from './useApi';

interface UsePrehireImportProps {
  prehireFields: PrehireFields | null;
  company: Company | null;
  readyForOnboarding: NewHireRequest[];
  onUploadSuccess: (data: PrehireRow[]) => void;
  onUploadError: (error: string) => void;
  onSubmitSuccess: (results: any) => void;
  onSubmitError: (error: string) => void;
  updateCsvData: (updater: (prev: PrehireRow[]) => PrehireRow[]) => void;
  setFailedRows: (rows: PrehireRow[]) => void;
  setIsUploading: (loading: boolean) => void;
  setIsSubmitting: (loading: boolean) => void;
  setSubmitProgress: (progress: number) => void;
}

export function usePrehireImport({
  prehireFields,
  company,
  readyForOnboarding,
  onUploadSuccess,
  onUploadError,
  onSubmitSuccess,
  onSubmitError,
  updateCsvData,
  setFailedRows,
  setIsUploading,
  setIsSubmitting,
  setSubmitProgress,
}: UsePrehireImportProps) {
  const api = useApi();
  const { showNotification } = useNotifications();

  // Helper to check if a value is masked/placeholder
  const isMaskedValue = useCallback((value: string | undefined): boolean => {
    if (!value) return false;
    return value.includes('*') || value.includes('#');
  }, []);

  // Convert PrehireRow to NewHireRequestPrehireForm
  const convertToPrehireForm = useCallback(
    (row: PrehireRow): NewHireRequestPrehireForm => {
      const cleanBirthDate = isMaskedValue(row.birth_date)
        ? ''
        : row.birth_date;
      const cleanGender = isMaskedValue(row.gender) ? '' : row.gender;
      const cleanSSN = isMaskedValue(row.ssn) ? '' : row.ssn;

      return {
        new_hire_request_id:
          typeof row.new_hire_request_id === 'string'
            ? parseInt(row.new_hire_request_id, 10)
            : row.new_hire_request_id,
        client_id: row.client_id,
        first_name: row.first_name || '',
        last_name: row.last_name || '',
        middle_initial: row.middle_initial,
        preferred_name: row.preferred_name,
        birth_date: cleanBirthDate,
        gender: cleanGender,
        marital_status: row.marital_status,
        ethnicity: row.ethnicity,
        preferred_language: row.preferred_language,
        ssn: cleanSSN,
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
      };
    },
    [isMaskedValue]
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!prehireFields) {
        onUploadError('Prehire configuration not loaded. Please try again.');
        return;
      }

      const isExcel =
        file.name.endsWith('.xlsx') ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      if (!isExcel) {
        onUploadError('Please upload a valid Excel file (.xlsx)');
        return;
      }

      setIsUploading(true);

      try {
        const response = await api.onboarding.uploadPrehireExcelFile(file);

        const validRequestIds = new Set(
          readyForOnboarding
            .map((req) => req.id)
            .filter((id): id is number => id !== undefined)
        );

        const parsedData = response.results.map((row: any, idx: number) => {
          const prehireRow = {
            ...row,
            client_id: company?.id || '',
            email: row.work_email || row.personal_email || row.email,
            rowIndex: idx + 2,
          };

          const errors = validatePrehireRow(prehireRow, prehireFields);

          if (
            !prehireRow.new_hire_request_id ||
            String(prehireRow.new_hire_request_id).trim() === ''
          ) {
            errors.new_hire_request_id =
              'New Hire Request ID is required and must not be empty';
          } else {
            const requestId = parseInt(
              String(prehireRow.new_hire_request_id),
              10
            );
            if (isNaN(requestId)) {
              errors.new_hire_request_id =
                'New Hire Request ID must be a valid number';
            } else if (!validRequestIds.has(requestId)) {
              errors.new_hire_request_id =
                'Invalid or modified New Hire Request ID - do not edit this column';
            }
          }

          return {
            ...prehireRow,
            errors: Object.keys(errors).length > 0 ? errors : undefined,
          };
        });

        onUploadSuccess(parsedData as PrehireRow[]);
        showNotification({
          message: `Successfully loaded ${parsedData.length} rows from Excel file`,
          severity: 'success',
          autoHideDuration: 5000,
        });
      } catch (error) {
        onUploadError(
          error instanceof Error ? error.message : 'Error reading Excel file'
        );
      } finally {
        setIsUploading(false);
      }
    },
    [
      prehireFields,
      company?.id,
      readyForOnboarding,
      api,
      showNotification,
      onUploadSuccess,
      onUploadError,
      setIsUploading,
    ]
  );

  const handleSubmit = useCallback(
    async (csvData: PrehireRow[]) => {
      if (csvData.length === 0) return;

      setIsSubmitting(true);
      setSubmitProgress(0);

      try {
        // Filter out rows that are already submitted or have errors
        const validData = csvData.filter(
          (row) => !row.errors && !row.submitted
        );

        const prehireRequests: NewHireRequestPrehireForm[] = validData
          .map(convertToPrehireForm)
          .filter((req, idx) => {
            if (!req.new_hire_request_id || isNaN(req.new_hire_request_id)) {
              const csvIdx = csvData.indexOf(validData[idx]);
              updateCsvData((prev) => {
                const updated = [...prev];
                updated[csvIdx] = {
                  ...updated[csvIdx],
                  errors: {
                    ...updated[csvIdx].errors,
                    new_hire_request_id:
                      'New Hire Request ID is missing or invalid',
                  },
                };
                return updated;
              });
              return false;
            }
            return true;
          });

        if (prehireRequests.length === 0) {
          onSubmitError(
            'No valid rows to submit. Please ensure all rows have a valid New Hire Request ID.'
          );
          return;
        }

        const response = await api.onboarding.bulkCompletePrehireRequests(
          prehireRequests
        );

        const successfulRows: number[] = [];

        response.results.completed.forEach((success) => {
          const rowIndex = validData.findIndex(
            (r) => r.new_hire_request_id === success.new_hire_request_id
          );
          if (rowIndex !== -1) {
            const csvIdx = csvData.indexOf(validData[rowIndex]);
            successfulRows.push(csvIdx);

            // Mark row as submitted to prevent resubmission
            updateCsvData((prev) => {
              const updated = [...prev];
              updated[csvIdx] = {
                ...updated[csvIdx],
                submitted: true,
              };
              return updated;
            });
          }
        });

        response.results.errors.forEach((error, errorIndex) => {
          let rowIndex = -1;
          if (error.new_hire_request_id) {
            rowIndex = validData.findIndex(
              (r) => r.new_hire_request_id === error.new_hire_request_id
            );
          }

          if (rowIndex === -1 && errorIndex < validData.length) {
            rowIndex = errorIndex;
          }

          if (rowIndex !== -1) {
            const csvDataIndex = csvData.indexOf(validData[rowIndex]);
            updateCsvData((prev) => {
              const updated = [...prev];
              updated[csvDataIndex] = {
                ...updated[csvDataIndex],
                errors: {
                  ...updated[csvDataIndex].errors,
                  submission: error.error,
                },
              };
              return updated;
            });
          }
        });

        const failed = csvData.filter((row) => row.errors?.submission);
        setFailedRows(failed);

        // Check if this was a complete success (all submitted rows succeeded and there were no prior submissions)
        const wasCompleteSuccess =
          response.results.failed === 0 && validData.length === csvData.length;

        onSubmitSuccess({
          successful: response.results.successful,
          failed: response.results.failed,
          errors: response.results.errors,
          allRowsSubmitted: wasCompleteSuccess, // Pass this info to parent
        });

        if (wasCompleteSuccess) {
          showNotification({
            message: `Successfully imported all ${csvData.length} employee${
              csvData.length !== 1 ? 's' : ''
            }`,
            severity: 'success',
            autoHideDuration: 5000,
          });
        } else if (response.results.failed === 0) {
          showNotification({
            message: `Successfully submitted ${
              response.results.successful
            } employee${response.results.successful !== 1 ? 's' : ''}`,
            severity: 'success',
            autoHideDuration: 5000,
          });
        }
      } catch (error: any) {
        if (
          error?.response?.status === 422 &&
          Array.isArray(error.response?.data?.detail)
        ) {
          const validationErrors = error.response.data.detail;
          const errorsByRow: Map<number, string[]> = new Map();

          validationErrors.forEach((err: any) => {
            const rowIndex = err.loc?.[1];
            if (typeof rowIndex === 'number') {
              const fieldName = err.loc?.[2] || 'unknown';
              const errorMsg = err.msg || 'Validation error';
              const fullError = `${fieldName}: ${errorMsg}`;

              if (!errorsByRow.has(rowIndex)) {
                errorsByRow.set(rowIndex, []);
              }
              errorsByRow.get(rowIndex)!.push(fullError);
            }
          });

          const validData = csvData.filter(
            (row) => !row.errors && !row.submitted
          );
          errorsByRow.forEach((errors, validDataIndex) => {
            if (validDataIndex < validData.length) {
              const csvDataIndex = csvData.indexOf(validData[validDataIndex]);
              if (csvDataIndex !== -1) {
                updateCsvData((prev) => {
                  const updated = [...prev];
                  updated[csvDataIndex] = {
                    ...updated[csvDataIndex],
                    errors: {
                      ...updated[csvDataIndex].errors,
                      submission: errors.join('; '),
                    },
                  };
                  return updated;
                });
              }
            }
          });

          onSubmitError(
            `Validation failed for ${errorsByRow.size} row(s). Please review and fix the errors below.`
          );
        } else {
          onSubmitError(
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred while submitting the import'
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      api,
      convertToPrehireForm,
      showNotification,
      updateCsvData,
      setFailedRows,
      setIsSubmitting,
      setSubmitProgress,
      onSubmitSuccess,
      onSubmitError,
    ]
  );

  return {
    handleFileSelect,
    handleSubmit,
    convertToPrehireForm,
  };
}
