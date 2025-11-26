import { useCallback, useState } from 'react';

interface BulkImportState<T> {
  activeStep: number;
  csvData: T[];
  isSubmitting: boolean;
  submitProgress: number;
  submitResults: {
    successful: number;
    failed: number;
    errors: any[];
  } | null;
  isUploading: boolean;
  failedRows: T[];
  isResubmitting: boolean;
  resubmitProgress: number;
  hasSuccessfulSubmission: boolean;
  submitError: string | null;
  resubmitError: string | null;
  uploadError: string | null;
}

interface BulkImportActions<T> {
  setActiveStep: (step: number) => void;
  setCsvData: (data: T[] | ((prev: T[]) => T[])) => void;
  setIsSubmitting: (loading: boolean) => void;
  setSubmitProgress: (progress: number) => void;
  setSubmitResults: (
    results: { successful: number; failed: number; errors: any[] } | null
  ) => void;
  setIsUploading: (loading: boolean) => void;
  setFailedRows: (rows: T[] | ((prev: T[]) => T[])) => void;
  setIsResubmitting: (loading: boolean) => void;
  setResubmitProgress: (progress: number) => void;
  setHasSuccessfulSubmission: (success: boolean) => void;
  setSubmitError: (error: string | null) => void;
  setResubmitError: (error: string | null) => void;
  setUploadError: (error: string | null) => void;
  resetState: () => void;
  handleStepClick: (stepIndex: number) => void;
  isStepClickable: (stepIndex: number) => boolean;
}

export function useBulkImportState<T>(): [
  BulkImportState<T>,
  BulkImportActions<T>
] {
  const [activeStep, setActiveStep] = useState(0);
  const [csvData, setCsvData] = useState<T[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitResults, setSubmitResults] = useState<{
    successful: number;
    failed: number;
    errors: any[];
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [failedRows, setFailedRows] = useState<T[]>([]);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [resubmitProgress, setResubmitProgress] = useState(0);
  const [hasSuccessfulSubmission, setHasSuccessfulSubmission] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resubmitError, setResubmitError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setCsvData([]);
    setSubmitResults(null);
    setFailedRows([]);
    setHasSuccessfulSubmission(false);
    setSubmitError(null);
    setResubmitError(null);
    setUploadError(null);
    setActiveStep(0);
  }, []);

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      if (stepIndex === 0) {
        setActiveStep(0);
        setSubmitResults(null);
        setSubmitError(null);
        setResubmitError(null);
        setUploadError(null);
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

  const state: BulkImportState<T> = {
    activeStep,
    csvData,
    isSubmitting,
    submitProgress,
    submitResults,
    isUploading,
    failedRows,
    isResubmitting,
    resubmitProgress,
    hasSuccessfulSubmission,
    submitError,
    resubmitError,
    uploadError,
  };

  const actions: BulkImportActions<T> = {
    setActiveStep,
    setCsvData,
    setIsSubmitting,
    setSubmitProgress,
    setSubmitResults,
    setIsUploading,
    setFailedRows,
    setIsResubmitting,
    setResubmitProgress,
    setHasSuccessfulSubmission,
    setSubmitError,
    setResubmitError,
    setUploadError,
    resetState,
    handleStepClick,
    isStepClickable,
  };

  return [state, actions];
}
