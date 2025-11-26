import { Section } from '@armhr/ui';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';

import UpdateUserDefinedFieldsModal from './UpdateUserDefinedFieldsModal';

export const CustomFieldsTab = ({
  refreshProfile,
}: {
  refreshProfile: () => void;
}) => {
  const { values } = useFormikContext<ProfileFormValues>();
  const [modalOpen, setModalOpen] = useState(false);

  const customFields = values.user_defined_fields || [];

  if (!customFields || customFields.length === 0) {
    return (
      <Section
        title="Custom fields"
        vertical={true}
        description={
          <Box>
            <Typography variant="body1" color="grey.500" mb={2}>
              No custom fields are configured for your profile.
            </Typography>
          </Box>
        }
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="grey.400">
            There are no additional custom fields to display.
          </Typography>
        </Box>
      </Section>
    );
  }

  const formatFieldValue = (field: ProfileCustomFieldValue): string => {
    const { field_value, field_definition } = field;

    if (!field_value) {
      return 'No value set';
    }

    switch (field_definition.field_type) {
      case 'date':
        try {
          return new Date(field_value).toLocaleDateString();
        } catch {
          return field_value;
        }
      case 'dropdown':
        // For dropdown, we might want to show the display value
        return field_value;
      case 'numeric':
        return field_value;
      default: // alphanumeric
        return field_value;
    }
  };

  return (
    <Section title="Custom fields" vertical={true}>
      <Grid container gap={2} rowGap={2}>
        <Grid item xs={6}>
          <Typography variant="body1" gutterBottom>
            Additional information asked by your employer
          </Typography>
        </Grid>
        <Grid item xs>
          <Box
            sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'flex-end' }}
          >
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => setModalOpen(true)}
            >
              Edit fields
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {customFields.map((field) => (
          <Grid item xs={12} sm={6} key={field.field_definition.id}>
            <Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
              >
                <Typography variant="caption" color="grey.600" display="block">
                  {field.field_definition.field_label}
                  {field.field_definition.is_required && (
                    <Typography component="span" color="error.main">
                      {' '}
                      *
                    </Typography>
                  )}
                </Typography>
              </Box>

              <Typography
                variant="body1"
                color="text.primary"
                sx={{
                  minHeight: '24px',
                  wordWrap: 'break-word',
                  whiteSpace:
                    field.field_value && field.field_value.length > 50
                      ? 'pre-wrap'
                      : 'normal',
                }}
              >
                {field.field_value ? (
                  formatFieldValue(field)
                ) : (
                  <Typography
                    component="span"
                    color="grey.400"
                    fontStyle="italic"
                  >
                    N/A
                  </Typography>
                )}
              </Typography>

              {field.field_definition.description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  {field.field_definition.description}
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <UpdateUserDefinedFieldsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        refreshProfile={refreshProfile}
        customFields={customFields}
      />
    </Section>
  );
};
