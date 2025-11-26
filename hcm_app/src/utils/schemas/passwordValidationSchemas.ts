import { validatePassword } from '@armhr/ui';
import * as Yup from 'yup';

const passwordValidation = Yup.string().test(
  'password-strength',
  'Password does not meet requirements',
  (value) => {
    const { valid } = validatePassword(value);
    return valid;
  }
);

export const passwordValidationSchema = Yup.object().shape({
  password: passwordValidation.required(''),
  confirm_password: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
});
