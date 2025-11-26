import { Chip } from '@mui/material';
import { blue, green, grey, orange, red } from '@mui/material/colors';
import { startCase } from 'lodash';

enum NewHireRequestState {
  CREATED = 'created',
  USER_PARTIAL_COMPLETE = 'user_partial_complete',
  USER_REGISTRATION = 'user_registration',
  USER_PRISM_ONBOARDING = 'user_prism_onboarding',
  COMPLETE = 'complete',
  PRISM_SYSTEM_CANCELLED = 'prism_system_cancelled',
}

const newHireRequestStates = {
  [NewHireRequestState.COMPLETE]: {
    border: green[300],
    background: green[50],
    label: 'Complete',
  },
  [NewHireRequestState.USER_REGISTRATION]: {
    border: blue[300],
    background: blue[50],
    label: 'In registration',
  },
  [NewHireRequestState.USER_PARTIAL_COMPLETE]: {
    border: orange[300],
    background: orange[50],
    label: 'Ready for onboarding',
  },
  [NewHireRequestState.USER_PRISM_ONBOARDING]: {
    border: blue[300],
    background: blue[50],
    label: 'In onboarding',
  },
  [NewHireRequestState.CREATED]: {
    border: grey[300],
    background: grey[50],
    label: 'Requested details',
  },
  [NewHireRequestState.PRISM_SYSTEM_CANCELLED]: {
    border: red[300],
    background: red[50],
    label: 'Prism System Cancelled',
  },
};

const NewHireStateChip: React.FC<{ state?: NewHireRequestState }> = ({
  state,
}) => {
  const defaultColor = grey[700];
  const defaultBackground = grey[100];

  if (!state) return null;

  return (
    <Chip
      label={newHireRequestStates[state]?.label || startCase(state)}
      size="small"
      style={{
        borderColor: newHireRequestStates[state]?.border || defaultColor,
        backgroundColor:
          newHireRequestStates[state]?.background || defaultBackground,
        borderWidth: 1,
        borderStyle: 'solid',
        color: 'black',
      }}
    />
  );
};

export default NewHireStateChip;
