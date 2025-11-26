import * as Yup from 'yup';

import { useUser } from '../../hooks/useUser';

const useValidationSchema = () => {
  const { user } = useUser();
  const fullName = `${user!.first_name} ${user!.last_name}`.trim();

  return Yup.object()
    .shape({
      acknowledgement: Yup.boolean()
        .oneOf(
          [true],
          'The acknowledgement checkbox is required for submission.'
        )
        .required('Required'),

      bonus_pay_date: Yup.string()
        .nullable()
        .required('Bonus Pay Date is required.')
        .test(
          'future-date',
          'Bonus Pay Date must be in the future.',
          (value) => {
            if (!value) return false;
            const date = new Date(value);
            return date > new Date();
          }
        ),

      additional_fed_tax: Yup.number().nullable().notRequired(),
      additional_state_tax: Yup.number().nullable().notRequired(),
      additional_local_tax: Yup.number().nullable().notRequired(),

      signature: Yup.string()
        .required('Required')
        .test(
          'matches-user-name',
          'Signature must match exactly',
          function (value) {
            return value?.trim() === fullName;
          }
        ),
    })
    .test(
      'at-least-one-tax',
      'At least one tax field must be greater than 0.',
      function (values) {
        const {
          additional_fed_tax = 0,
          additional_state_tax = 0,
          additional_local_tax = 0,
        } = values;

        if (
          additional_fed_tax === 0 &&
          additional_state_tax === 0 &&
          additional_local_tax === 0
        ) {
          const errors = [
            this.createError({
              path: 'additional_fed_tax',
              message: 'At least one tax field must be greater than 0.',
            }),
            this.createError({
              path: 'additional_state_tax',
              message: 'At least one tax field must be greater than 0.',
            }),
            this.createError({
              path: 'additional_local_tax',
              message: 'At least one tax field must be greater than 0.',
            }),
          ];
          return new Yup.ValidationError(errors);
        }

        return true;
      }
    );
};

export default useValidationSchema;
