import { Section } from '@armhr/ui';
import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Field, useFormikContext } from 'formik';

import { useApiData } from '../../../hooks/useApiData';
import UserSearchInput from '../UserSearchInput';
import {
  AccessFormUserAction,
  FormValues,
  truncatedFormUserActions,
} from '../userAccessFormValues';

const SecurityAccessRequirements: React.FC = () => {
  const { data: employees, error: employeesError } = useApiData<
    PublicEmployeeProfile[]
  >((api) => api.company.getEmployees());

  const { data: managers, error: managersError } = useApiData<
    PrismSecurityUser[]
  >((api) => api.company.getActivePrismUsers('worksite_manager'));

  const { values, setFieldValue, errors, touched } =
    useFormikContext<FormValues>();

  return (
    <Section title="Access requirements" vertical>
      <Field
        name="client_name"
        as={TextField}
        label="Client name"
        fullWidth
        error={touched.client_name && !!errors.client_name}
        helperText={touched.client_name && errors.client_name}
      />
      <RadioGroup
        name="user_type"
        value={values.user_type}
        sx={{ mt: 2 }}
        onChange={(event) => {
          setFieldValue('user_type', event.target.value);

          if (
            !truncatedFormUserActions.includes(
              event.target.value as AccessFormUserAction
            )
          ) {
            setFieldValue('first_name', '');
            setFieldValue('last_name', '');
          }
          if (event.target.value !== AccessFormUserAction.MIRROR) {
            setFieldValue('mirror_user', '');
          }
          if (event.target.value !== AccessFormUserAction.INACTIVATE) {
            setFieldValue('inactivate_user_id', '');
          }
        }}
      >
        <Grid container>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              value={AccessFormUserAction.NEW}
              control={<Radio />}
              label={AccessFormUserAction.NEW}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              value={AccessFormUserAction.CHANGE}
              control={<Radio />}
              label={AccessFormUserAction.CHANGE}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              value={AccessFormUserAction.INACTIVATE}
              control={<Radio />}
              label={AccessFormUserAction.INACTIVATE}
            />
            <UserSearchInput
              fieldId="inactivate_user_id"
              fieldLabel="Inactivate User Name"
              users={employees}
              userIdAttr="id"
              usersError={employeesError}
              userAction={AccessFormUserAction.INACTIVATE}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              value={AccessFormUserAction.MIRROR}
              control={<Radio />}
              label={AccessFormUserAction.MIRROR}
            />
            <UserSearchInput
              fieldId="mirror_user"
              fieldLabel="Mirror User Name"
              users={managers}
              userIdAttr="employee_id"
              usersError={managersError}
              userAction={AccessFormUserAction.MIRROR}
            />
          </Grid>
        </Grid>
      </RadioGroup>
    </Section>
  );
};

export default SecurityAccessRequirements;
