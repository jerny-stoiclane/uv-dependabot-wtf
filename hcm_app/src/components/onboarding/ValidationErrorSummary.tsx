import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Alert, Box, Collapse, IconButton, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

type Props = {
  errors: Record<string, unknown>;
  submitCount: number;
};

const ValidationErrorSummary = ({ errors, submitCount }: Props) => {
  const [expanded, setExpanded] = useState(true);
  const errorsToShow = useMemo(() => Object.entries(errors), [errors]);

  const handleToggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const errorItems = useMemo(
    () =>
      errorsToShow.map(([fieldName, errorMessage]) => (
        <Typography key={fieldName as string} component="li" variant="body2">
          <strong>
            {(fieldName as string)
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </strong>
          : {errorMessage as string}
        </Typography>
      )),
    [errorsToShow]
  );

  if (submitCount === 0 || errorsToShow.length === 0) {
    return null;
  }

  return (
    <Alert
      severity="error"
      sx={{ mb: 3 }}
      action={
        <IconButton
          aria-label="toggle error details"
          size="small"
          onClick={handleToggleExpanded}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      }
    >
      <Typography
        variant="body2"
        component="div"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        Please fix the following errors before submitting:
        <Typography variant="caption" sx={{ ml: 1 }}>
          ({errorsToShow.length}{' '}
          <span>{errorsToShow.length === 1 ? 'error' : 'errors'}</span>)
        </Typography>
      </Typography>
      <Collapse in={expanded}>
        <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
          {errorItems}
        </Box>
      </Collapse>
    </Alert>
  );
};

export default ValidationErrorSummary;
