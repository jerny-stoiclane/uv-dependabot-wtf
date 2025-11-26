import { PasswordStrengthChecker, SecureTextField } from '@armhr/ui';
import { Box } from '@mui/material';
import { ErrorMessage, Field, useFormikContext } from 'formik';

interface FormWithPasswordValues {
  password: string;
  confirm_password: string;
}

const CreatePasswordFields = <FormValues extends FormWithPasswordValues>() => {
  const { touched, errors, handleChange, values } =
    useFormikContext<FormValues>();
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Field
          as={SecureTextField}
          name="password"
          label="Password"
          error={touched.password && !!errors.password}
          helperText={<ErrorMessage name="password" />}
          onChange={handleChange}
          value={values.password}
          fullWidth
          required
        />
        {errors.password && (
          <PasswordStrengthChecker password={values.password} />
        )}
      </Box>
      <Field
        as={SecureTextField}
        name="confirm_password"
        label="Confirm password"
        error={touched.confirm_password && !!errors.confirm_password}
        helperText={<ErrorMessage name="confirm_password" />}
        fullWidth
        required
      />
    </>
  );
};

export default CreatePasswordFields;
