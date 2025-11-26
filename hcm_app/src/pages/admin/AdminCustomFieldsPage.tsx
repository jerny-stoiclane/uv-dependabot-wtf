import { ConfirmationDialog, useNotifications } from '@armhr/ui';
import {
  Add as AddIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as PreviewIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Switch,
  Typography,
} from '@mui/material';
import { FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import CustomFieldForm from '../../components/admin/CustomFieldForm';
import FieldList from '../../components/admin/FieldList';
import FormPreview from '../../components/admin/FormPreview';
import UpdateUserDefinedFieldsModal from '../../components/profile/UpdateUserDefinedFieldsModal';
import { useApi } from '../../hooks/useApi';
import { useUser } from '../../hooks/useUser';
import { paths } from '../../utils/paths';

type Config = {
  user_defined_fields_enabled: boolean;
};

interface CompanyConfig {
  id?: number;
  client_id: string;
  flag: string;
  data: any;
  value: boolean;
}

interface CustomFieldFormValues {
  field_label: string;
  field_type: 'alphanumeric' | 'numeric' | 'date' | 'dropdown';
  is_required: boolean;
  description: string;
  dropdown_values: CustomFieldDropdownValue[];
}

const fieldTypeOptions = [
  { value: 'alphanumeric', label: 'Text' },
  { value: 'numeric', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'dropdown', label: 'Dropdown' },
];

const validationSchema = Yup.object().shape({
  field_label: Yup.string().required('Field label is required'),
  field_type: Yup.string().required('Field type is required'),
  description: Yup.string(),
  dropdown_values: Yup.array().when('field_type', {
    is: 'dropdown',
    then: (schema) =>
      schema.min(1, 'Dropdown fields must have at least one option'),
    otherwise: (schema) => schema,
  }),
});

const initialValues: CustomFieldFormValues = {
  field_label: '',
  field_type: 'alphanumeric',
  is_required: false,
  description: '',
  dropdown_values: [],
};

const AdminCustomFieldsPage: React.FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  const { user, company, refresh } = useUser();
  const { showNotification } = useNotifications();

  const [config, setConfig] = useState<Config>({
    user_defined_fields_enabled: false,
  });
  const [fields, setFields] = useState<CustomFieldDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] =
    useState<CustomFieldDefinition | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewField, setPreviewField] =
    useState<CustomFieldDefinition | null>(null);
  const [transientField, setTransientField] =
    useState<CustomFieldDefinition | null>(null);
  const [previewUpdateModal, setPreviewUpdateModal] = useState(false);
  const [howItWorksExpanded, setHowItWorksExpanded] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    fieldId: number | null;
    fieldLabel: string;
  }>({
    open: false,
    fieldId: null,
    fieldLabel: '',
  });

  const handleFormValuesChange = (values: CustomFieldFormValues) => {
    if (isCreating) {
      const tempField: CustomFieldDefinition & { isTransient?: boolean } = {
        id: -1, // Temporary ID for unsaved fields
        field_key: 'new_field',
        field_label: values.field_label || '',
        field_type: values.field_type,
        is_required: values.is_required,
        description: values.description,
        dropdown_values: values.dropdown_values || [],
        client_id: company?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isTransient: true,
      };
      setTransientField(tempField);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await api.company.getConfig();
      const configWithFetchedData = response.results.reduce(
        (acc: Config, conf: CompanyConfig) => {
          if (conf.flag === 'user_defined_fields_enabled') {
            acc[conf.flag as keyof Config] = conf.value;
          }
          return acc;
        },
        { user_defined_fields_enabled: false }
      );
      setConfig(configWithFetchedData);
    } catch (error) {
      console.error('Error fetching configuration:', error);
    }
  };

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getCustomFieldDefinitions();

      // The API returns the array directly, not wrapped in a results object
      const fieldsData = response.results;
      // Transform the data to match the expected structure
      const transformedFields = fieldsData.map((field) => ({
        ...field,
        // Ensure dropdown_values have the required field_definition_id if missing
        dropdown_values:
          field.dropdown_values?.map((dv) => ({
            ...dv,
            field_definition_id: dv.field_definition_id || field.id || 0,
          })) || [],
      }));

      setFields(transformedFields);
    } catch (err) {
      setError('Failed to fetch custom fields');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingField(null);
    setIsCreating(false);
    setPreviewField(null);
    setTransientField(null);
    setError(null);
    setDeleteConfirmation({
      open: false,
      fieldId: null,
      fieldLabel: '',
    });
  };

  const startEditing = (field: CustomFieldDefinition) => {
    setEditingField(field);
    setIsCreating(false);
    setPreviewField(null);
    setError(null);
  };

  const cancelEdit = () => {
    resetForm();
  };

  const handleSubmit = async (
    values: CustomFieldFormValues,
    helpers: FormikHelpers<CustomFieldFormValues>
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (editingField?.id) {
        const updateData: CustomFieldDefinitionUpdate = {
          field_label: values.field_label.trim(),
          field_type: values.field_type,
          is_required: values.is_required,
          // Important: send empty string explicitly to clear description
          description:
            values.description.trim() === '' ? '' : values.description.trim(),
          dropdown_values:
            values.field_type === 'dropdown'
              ? values.dropdown_values
              : undefined,
        };

        await api.admin.updateCustomFieldDefinition(
          company?.id || '',
          editingField.id,
          updateData
        );
      } else {
        const createData: CustomFieldDefinitionCreate = {
          field_label: values.field_label.trim(),
          field_type: values.field_type,
          is_required: values.is_required,
          // For create, omit empty description
          description: values.description.trim() || undefined,
          dropdown_values:
            values.field_type === 'dropdown'
              ? values.dropdown_values
              : undefined,
        };

        await api.admin.createCustomFieldDefinition(
          company?.id || '',
          createData
        );
      }

      await fetchFields();
      resetForm();
      helpers.resetForm();
    } catch (err) {
      setError('Failed to save custom field');
    } finally {
      setLoading(false);
      helpers.setSubmitting(false);
    }
  };

  const handleDelete = (fieldId: number, fieldLabel: string) => {
    setDeleteConfirmation({
      open: true,
      fieldId,
      fieldLabel,
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.fieldId) return;

    try {
      setLoading(true);
      await api.admin.deleteCustomFieldDefinition(
        company?.id || '',
        deleteConfirmation.fieldId
      );
      await fetchFields();
      resetForm(); // Reset form state to exit edit mode
    } catch (err) {
      setError('Failed to delete custom field');
    } finally {
      setLoading(false);
    }
  };

  const getInitialValues = (): CustomFieldFormValues => {
    if (editingField) {
      return {
        field_label: editingField.field_label,
        field_type: editingField.field_type,
        is_required: editingField.is_required,
        description: editingField.description || '',
        dropdown_values: editingField.dropdown_values || [],
      };
    }
    return initialValues;
  };

  // Create mock data for the update modal preview
  const createMockProfileFields = (
    includeTransient = false
  ): ProfileCustomFieldValue[] => {
    let allFields = [...fields];
    if (includeTransient && transientField && transientField.field_label) {
      allFields.push(transientField);
    }
    return allFields.map((field) => ({
      id: field.id,
      client_id: company?.id || '',
      prism_user_id: user?.user_metadata?.prism_user_id || '',
      field_definition_id: field.id,
      field_value: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      field_definition: {
        id: field.id,
        client_id: company?.id || '',
        field_key: field.field_key,
        field_label: field.field_label,
        field_type: field.field_type,
        is_required: field.is_required,
        description: field.description || '',
        created_at: field.created_at,
        updated_at: field.updated_at,
        dropdown_values: field.dropdown_values || [],
      },
    }));
  };

  useEffect(() => {
    if (!user?.is_admin) {
      navigate(-1);
      return;
    }

    fetchConfig();
    fetchFields();
  }, [api, user?.is_admin, navigate]);

  const handleToggle = async () => {
    const newValue = !config.user_defined_fields_enabled;
    setConfig({ user_defined_fields_enabled: newValue });

    try {
      if (company?.id) {
        const dataToSend: CompanyConfig = {
          client_id: company.id,
          flag: 'user_defined_fields_enabled',
          value: newValue,
          data: undefined,
        };
        await api.company.updateConfig(dataToSend);
        refresh();
        showNotification({
          message: `Custom fields ${
            newValue ? 'enabled' : 'disabled'
          } successfully.`,
          severity: 'success',
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      showNotification({
        message:
          'Error saving settings, our team has been notified. Please refresh and try again.',
        severity: 'error',
      });
    }
  };

  return (
    <Box>
      <Helmet>
        <title>Custom Fields | Armhr</title>
        <meta
          name="description"
          content="Manage custom fields for employee profiles."
        />
      </Helmet>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              Custom fields
            </Typography>
          </Box>

          {/* Status Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={
                config.user_defined_fields_enabled ? 'Enabled' : 'Disabled'
              }
              color={config.user_defined_fields_enabled ? 'success' : 'error'}
              size="small"
              sx={{ fontWeight: 500 }}
            />
            <Typography variant="body2" color="text.secondary">
              {config.user_defined_fields_enabled
                ? `${fields.length} field${
                    fields.length !== 1 ? 's' : ''
                  } configured`
                : 'Feature is currently disabled'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={() => navigate(paths.adminCompanyConfig)}
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Back to company settings
          </Button>
        </Box>
      </Box>

      {/* Feature Toggle Section */}
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Custom fields feature
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Collect information in custom fields from employees on their
                profile page and on login.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {config.user_defined_fields_enabled
                  ? 'Custom fields enabled'
                  : 'Custom fields disabled'}
              </Typography>
              <Switch
                checked={config.user_defined_fields_enabled}
                onChange={handleToggle}
                color="primary"
                size="medium"
              />
            </Box>
          </Box>

          <Box
            sx={{
              backgroundColor: 'primary.50',
              border: '1px solid',
              borderColor: 'primary.200',
              borderRadius: 1.5,
              py: 1,
              px: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => setHowItWorksExpanded(!howItWorksExpanded)}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: 'primary.700' }}
              >
                How it works
              </Typography>
              <IconButton
                size="small"
                sx={{
                  color: 'primary.700',
                  '&:hover': { backgroundColor: 'primary.100' },
                }}
              >
                {howItWorksExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={howItWorksExpanded}>
              <Box component="ul" sx={{ m: 0, pl: 2, my: 1 }}>
                <Typography component="li" variant="body1">
                  When enabled, employees will see a pop-up (modal) the next
                  time they log in.
                </Typography>
                <Typography component="li" variant="body1">
                  Any required fields must be completed before they can
                  continue.
                </Typography>
                <Typography component="li" variant="body1">
                  Any optional fields will also appear in the pop-up, but
                  employees can choose to skip them.
                </Typography>
                <Typography component="li" variant="body1">
                  After filling these out once, the pop-up won't appear again
                  unless new required fields are added later.
                </Typography>
              </Box>
            </Collapse>
          </Box>
        </Box>
      </Paper>

      {!config.user_defined_fields_enabled && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Custom fields are currently disabled. You can still manage fields
          here, but they won't be visible to employees until you enable the
          feature.
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Left Column - Field Management */}
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
              height: 'fit-content',
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'grey.50',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Field management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create and manage custom fields for user profiles
                  </Typography>
                </Box>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setIsCreating(true)}
                  variant="contained"
                  color="primary"
                  size="medium"
                >
                  Add field
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 3, borderRadius: 1.5 }}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              )}

              {!isCreating && !editingField && !previewField && (
                <Box>
                  {loading ? (
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 6,
                        backgroundColor: 'grey.50',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Loading custom fields...
                      </Typography>
                    </Box>
                  ) : fields.length === 0 ? (
                    <Box
                      sx={{
                        p: 5,
                        textAlign: 'center',
                        backgroundColor: 'grey.50',
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 1.5, fontWeight: 500 }}
                      >
                        No custom fields configured yet
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Click "Add Field" to create your first custom field for
                        user profiles.
                      </Typography>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => setIsCreating(true)}
                        variant="outlined"
                        sx={{ textTransform: 'none' }}
                      >
                        Create field
                      </Button>
                    </Box>
                  ) : (
                    <FieldList
                      fields={fields}
                      onEditField={startEditing}
                      onDeleteField={handleDelete}
                      fieldTypeOptions={fieldTypeOptions}
                    />
                  )}
                </Box>
              )}

              {(isCreating || editingField) && (
                <CustomFieldForm
                  initialValues={getInitialValues()}
                  onSubmit={handleSubmit}
                  onCancel={cancelEdit}
                  onDeleteField={handleDelete}
                  isSubmitting={false}
                  loading={loading}
                  isEditing={!!editingField}
                  editingField={editingField}
                  fieldTypeOptions={fieldTypeOptions}
                  validationSchema={validationSchema}
                  onValuesChange={handleFormValuesChange}
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Preview */}
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
              height: 'fit-content',
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'grey.50',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    See how fields will appear to employees
                  </Typography>
                </Box>
                <Button
                  startIcon={<PreviewIcon />}
                  onClick={() => setPreviewUpdateModal(true)}
                  variant="outlined"
                  size="medium"
                  disabled={fields.length === 0}
                >
                  Preview modal
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              <Card elevation={1}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h5">Custom fields</Typography>

                      <Chip
                        label={`${fields.length} field${
                          fields.length !== 1 ? 's' : ''
                        }`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ ml: 2, fontWeight: 500 }}
                      />
                    </Box>
                  }
                />
                <CardContent>
                  <FormPreview
                    fields={
                      isCreating && transientField && transientField.field_label
                        ? [...fields, transientField]
                        : fields
                    }
                  />
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={deleteConfirmation.open}
        onClose={() =>
          setDeleteConfirmation({
            open: false,
            fieldId: null,
            fieldLabel: '',
          })
        }
        onConfirm={confirmDelete}
        title="Delete Custom Field"
        message={
          <>
            Are you sure you want to delete the custom field{' '}
            <strong>"{deleteConfirmation.fieldLabel}"</strong>? <br /> This
            action cannot be undone, and the data for this field will be
            deleted.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        color="error"
        confirmButtonProps={{
          color: 'error',
        }}
      />

      <UpdateUserDefinedFieldsModal
        open={previewUpdateModal}
        onClose={() => setPreviewUpdateModal(false)}
        refreshProfile={() => {}}
        customFields={createMockProfileFields(true)}
        isRequired={false}
      />
    </Box>
  );
};

export default AdminCustomFieldsPage;
