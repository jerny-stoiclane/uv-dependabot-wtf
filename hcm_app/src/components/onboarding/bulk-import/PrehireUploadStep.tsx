import {
  Person as PersonIcon,
  TableChart as TableChartIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { EmployeeSelectionTable } from './EmployeeSelectionTable';
import { FileDropzone } from './FileDropzone';

interface EmployeeCounts {
  complete: number;
  incomplete: number;
  total: number;
}

interface PrehireUploadStepProps {
  readyForOnboarding: NewHireRequest[];
  selectedRequestIds: number[];
  employeeCounts: EmployeeCounts;
  uploadError: string | null;
  isUploading: boolean;
  isDownloadingTemplate?: boolean;
  onFileSelect: (file: File) => Promise<void>;
  onToggleRequest: (requestId: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDownloadExcelTemplate: () => void;
  onClearUploadError: () => void;
}

export const PrehireUploadStep: React.FC<PrehireUploadStepProps> = ({
  readyForOnboarding,
  selectedRequestIds,
  employeeCounts,
  uploadError,
  isUploading,
  isDownloadingTemplate = false,
  onFileSelect,
  onToggleRequest,
  onSelectAll,
  onDeselectAll,
  onDownloadExcelTemplate,
  onClearUploadError,
}) => {
  const [showIncomplete, setShowIncomplete] = useState(false);

  // Filter employees based on completion status
  const filteredEmployees = useMemo(() => {
    if (showIncomplete) {
      return readyForOnboarding;
    }
    return readyForOnboarding.filter(
      (emp) => emp.has_ssn && emp.has_birth_date && emp.has_gender
    );
  }, [readyForOnboarding, showIncomplete]);

  // Local handler to select all filtered employees
  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredEmployees
      .map((emp) => emp.id)
      .filter((id): id is number => id !== undefined);
    allFilteredIds.forEach((id) => {
      if (!selectedRequestIds.includes(id)) {
        onToggleRequest(id);
      }
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Complete onboarding for multiple new hires
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Download the template with pre-populated data, complete all fields,
          then upload
        </Typography>
      </Box>

      {uploadError && (
        <Alert severity="error" onClose={onClearUploadError} sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Upload Error
          </Typography>
          <Typography variant="body2">{uploadError}</Typography>
        </Alert>
      )}

      {readyForOnboarding.length > 0 && (
        <>
          <Box
            sx={{
              mb: 3,
              border: '1px solid',
              borderColor: 'info.main',
              borderRadius: 1,
              overflow: 'hidden',
              backgroundColor: 'info.lighter',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1.5,
                backgroundColor: 'info.lighter',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PersonIcon color="info" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {employeeCounts.complete} employee
                    {employeeCounts.complete !== 1 ? (
                      <span>'s'</span>
                    ) : (
                      <span>'</span>
                    )}
                    <span>ready for completion</span>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {employeeCounts.incomplete} awaiting info •{' '}
                    {employeeCounts.total} total
                    {!showIncomplete && employeeCounts.incomplete > 0 && (
                      <span> • Showing {filteredEmployees.length}</span>
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleSelectAllFiltered}
                  disabled={
                    filteredEmployees.length === 0 ||
                    filteredEmployees.every((emp) =>
                      selectedRequestIds.includes(emp.id!)
                    )
                  }
                >
                  Select All
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={onDeselectAll}
                  disabled={selectedRequestIds.length === 0}
                >
                  Deselect All
                </Button>
                {employeeCounts.incomplete > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setShowIncomplete(!showIncomplete)}
                    startIcon={
                      showIncomplete ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )
                    }
                  >
                    {showIncomplete ? <span>Hide</span> : <span>Show</span>}
                    &nbsp;
                    <span>Incomplete ({employeeCounts.incomplete})</span>
                  </Button>
                )}
              </Box>
            </Box>

            <EmployeeSelectionTable
              employees={filteredEmployees}
              selectedIds={selectedRequestIds}
              onToggle={onToggleRequest}
              onSelectAll={onSelectAll}
              onDeselectAll={onDeselectAll}
            />
          </Box>
        </>
      )}

      <FileDropzone
        onFileSelect={onFileSelect}
        isUploading={isUploading}
        showWorkflow={readyForOnboarding.length > 0}
        uploadButtonText="Upload Completed File"
        templateButton={
          <LoadingButton
            variant="contained"
            size="large"
            startIcon={<TableChartIcon />}
            onClick={onDownloadExcelTemplate}
            disabled={selectedRequestIds.length === 0}
            loading={isDownloadingTemplate}
          >
            Download Excel Template ({selectedRequestIds.length})
          </LoadingButton>
        }
      />
    </Box>
  );
};
