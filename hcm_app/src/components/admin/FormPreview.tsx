import { Box, Typography } from '@mui/material';
import { Form, Formik } from 'formik';

import { CustomField } from '../common/CustomField';

interface FormPreviewProps {
  fields: CustomFieldDefinition[];
}

const FormPreview: React.FC<FormPreviewProps> = ({ fields }) => {
  if (fields.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', py: 4 }}
      >
        No custom fields configured yet.
      </Typography>
    );
  }

  // Set up initial values for Formik
  const initialValues = fields.reduce((acc, field) => {
    acc[field.field_key] = '';
    return acc;
  }, {} as Record<string, string>);

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <Form>
        <Box sx={{ display: 'grid', gap: 2 }}>
          {fields.map((field) => {
            const isTransient = (field as any).isTransient;

            const wrapperStyles = isTransient
              ? {
                  backgroundColor: 'primary.50',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'primary.200',
                  transition: 'all 300ms ease-in-out',
                }
              : {};

            return (
              <Box key={field.field_key} sx={wrapperStyles}>
                <CustomField fieldDefinition={field} />
              </Box>
            );
          })}
        </Box>
      </Form>
    </Formik>
  );
};

export default FormPreview;
