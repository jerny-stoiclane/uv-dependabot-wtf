import { Chip } from '@mui/material';
import { green, grey, orange } from '@mui/material/colors';
import { startCase } from 'lodash';

import { BonusTaxWithholdingRequestStatuses } from '../../utils/constants';

const bonusTaxWithholdingStatuses = {
  [BonusTaxWithholdingRequestStatuses.SIGNED]: {
    border: green[300],
    background: green[50],
    label: 'Signed',
  },
  [BonusTaxWithholdingRequestStatuses.ASSIGNED]: {
    border: orange[300],
    background: orange[50],
    label: 'Assigned',
  },
};

const BonusTaxWithholdingStatusChip: React.FC<{
  status?: BonusTaxWithholdingRequestStatuses;
}> = ({ status }) => {
  const defaultColor = grey[700];
  const defaultBackground = grey[100];

  if (!status) return null;

  return (
    <Chip
      label={bonusTaxWithholdingStatuses[status]?.label || startCase(status)}
      size="small"
      style={{
        borderColor:
          bonusTaxWithholdingStatuses[status]?.border || defaultColor,
        backgroundColor:
          bonusTaxWithholdingStatuses[status]?.background || defaultBackground,
        borderWidth: 1,
        borderStyle: 'solid',
        color: 'black',
      }}
    />
  );
};

export default BonusTaxWithholdingStatusChip;
