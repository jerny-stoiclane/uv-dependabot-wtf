import { Autocomplete, TextField } from '@mui/material';
import { Field, useField, useFormikContext } from 'formik';

import { AccessFormUserAction, FormValues } from './userAccessFormValues';

const UserSearchInput = <UserType extends { [key: string]: any }>({
  fieldId,
  fieldLabel,
  users,
  userIdAttr,
  usersError,
  userAction,
}: {
  fieldId: string;
  fieldLabel: string;
  users: UserType[] | null;
  userIdAttr: string;
  usersError: any;
  userAction: AccessFormUserAction.MIRROR | AccessFormUserAction.INACTIVATE;
}) => {
  const [field] = useField(fieldId);
  const { values, setFieldValue, errors, touched } =
    useFormikContext<FormValues>();

  return (
    <>
      {values.user_type === userAction &&
        (usersError ? (
          <Field
            name={fieldId}
            as={TextField}
            label={fieldLabel}
            fullWidth
            sx={{ marginTop: 1 }}
            error={touched[userIdAttr] && !!errors[userIdAttr]}
            helperText={touched[userIdAttr] && errors[userIdAttr]}
          />
        ) : (
          <Autocomplete
            {...field}
            renderOption={(props, option) => {
              // required in order to set the key for the option to the id
              // default mui behavior (for version 5) is to use the option label as the key
              return (
                <li {...props} key={option[userIdAttr]}>
                  {`${option.first_name} ${option.last_name}`}
                </li>
              );
            }}
            options={users || []}
            getOptionLabel={(option) =>
              `${option.first_name} ${option.last_name}`
            }
            value={
              users?.find((user) => user[userIdAttr] === values[fieldId]) ||
              null
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            }}
            onChange={(_event, newValue) => {
              const newVal = newValue as UserType;
              setFieldValue(fieldId, newVal ? newVal[userIdAttr] : '');
              setFieldValue('first_name', newVal?.first_name || '');
              setFieldValue('last_name', newVal?.last_name || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type to search by user name"
                fullWidth
                sx={{ marginTop: 1 }}
                error={touched[userIdAttr] && !!errors[userIdAttr]}
                helperText={touched[userIdAttr] && errors[userIdAttr]}
              />
            )}
          />
        ))}
    </>
  );
};

export default UserSearchInput;
