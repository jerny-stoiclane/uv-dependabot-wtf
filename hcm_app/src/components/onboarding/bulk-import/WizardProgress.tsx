import { Check } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

interface WizardProgressProps {
  steps: readonly string[];
  activeStep: number;
  onStepClick: (stepIndex: number) => void;
  isStepClickable: (stepIndex: number) => boolean;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({
  steps,
  activeStep,
  onStepClick,
  isStepClickable,
}) => {
  return (
    <Box sx={{ mb: 5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {steps.map((label, index) => {
          const isActive = activeStep === index;
          const isCompleted = activeStep > index;
          const isClickable = isStepClickable(index);

          return (
            <Box
              key={label}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <Box
                onClick={() => isClickable && onStepClick(index)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  cursor: isClickable ? 'pointer' : 'default',
                  opacity: isClickable ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? 'primary.lighter' : 'transparent',
                  '&:hover': isClickable
                    ? {
                        backgroundColor: isActive
                          ? 'primary.lighter'
                          : 'grey.50',
                      }
                    : {},
                }}
              >
                {/* Step circle */}
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: isCompleted
                      ? 'success.main'
                      : isActive
                      ? 'primary.main'
                      : 'white',
                    border: '2px solid',
                    borderColor: isCompleted
                      ? 'success.main'
                      : isActive
                      ? 'primary.main'
                      : 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCompleted || isActive ? 'white' : 'grey.400',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}
                >
                  {isCompleted ? <Check sx={{ fontSize: 16 }} /> : index + 1}
                </Box>

                {/* Step label - inline */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem',
                    color: isActive
                      ? 'primary.main'
                      : isCompleted
                      ? 'text.primary'
                      : 'text.secondary',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </Typography>
              </Box>

              {/* Connector */}
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: 60,
                    height: '2px',
                    backgroundColor: isCompleted ? 'success.main' : 'grey.200',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
