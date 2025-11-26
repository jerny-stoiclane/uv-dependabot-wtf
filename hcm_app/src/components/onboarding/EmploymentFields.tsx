import { Autocomplete, FormikDatePicker, Section } from '@armhr/ui';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { Field, useFormikContext } from 'formik';

import { useUser } from '../../hooks/useUser';
import useOptionalFieldsToggle from './useOptionalFieldsToggle';

const EmploymentFields = ({
  access,
  requiredFields,
  showOptional,
  prehireFields,
  newHireRequest,
  codes,
  managers,
}: {
  access: UserAccess;
  requiredFields: string[];
  showOptional: boolean;
  newHireRequest?: NewHireRequest;
  prehireFields: PrehireFields | null;
  codes?: CompanyCode;
  managers?: PrismSecurityUser[];
}) => {
  const formik = useFormikContext<NewHireRequestFormValues>();
  const { user } = useUser();

  const employmentFields = [
    'location',
    'job',
    'department',
    'division',
    'shift',
    'start_date',
    'employee_type',
    'employee_number',
    'benefits_group',
    'project',
    'work_group',
    'supervisor',
    'manager',
  ];

  const { showOptionalFields, getToggleLink, shouldRenderField } =
    useOptionalFieldsToggle(showOptional, requiredFields, employmentFields);

  if (!codes) {
    return null;
  }

  const getFilteredOptions = (codes, entityType) => {
    return user?.is_admin
      ? codes
      : filterOptionsByAccess(codes, access?.entities, entityType);
  };

  return (
    <Section
      title="Employment details"
      description={<Box>{getToggleLink()}</Box>}
      vertical={!!newHireRequest}
    >
      {!showOptionalFields &&
        employmentFields.every((field) => !requiredFields.includes(field)) && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="gray">
              No fields are required
            </Typography>
          </Box>
        )}
      <Stack spacing={3}>
        {shouldRenderField('location') && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Autocomplete
              name="location"
              label="Work location"
              fullWidth
              required={requiredFields.includes('location')}
              value={formik.values.location}
              options={getFilteredOptions(codes.location_codes, 'Location').map(
                (location) => ({
                  value: location.id,
                  label: location.value,
                })
              )}
              onChange={(newValue) => {
                formik.setFieldValue('location', newValue || '');
              }}
              error={!!formik.errors.location}
              helperText={formik.errors.location}
            />
          </Box>
        )}
        {shouldRenderField(['job', 'department']) && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {shouldRenderField('job') && (
              <Autocomplete
                name="job"
                label="Position"
                fullWidth
                required={requiredFields.includes('job')}
                options={getFilteredOptions(codes.job_codes, 'Job').map(
                  (job) => ({
                    value: job.id,
                    label: `${job.value} - ${job.id}`,
                  })
                )}
                value={formik.values.job}
                onChange={(newValue) => {
                  formik.setFieldValue('job', newValue || '');
                }}
                error={!!formik.errors.job}
                helperText={formik.errors.job}
              />
            )}
            {shouldRenderField('department') && (
              <Autocomplete
                name="department"
                label="Department"
                fullWidth
                required={requiredFields.includes('department')}
                options={getFilteredOptions(
                  codes.department_codes,
                  'Department'
                ).map((department) => ({
                  value: department.id,
                  label: `${department.value} - ${department.id}`,
                }))}
                value={formik.values.department}
                onChange={(newValue) => {
                  formik.setFieldValue('department', newValue || '');
                }}
                error={!!formik.errors.department}
                helperText={formik.errors.department}
              />
            )}
          </Box>
        )}
        {shouldRenderField(['division', 'shift']) && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {shouldRenderField('division') &&
              (codes?.division_codes || []).length > 0 && (
                <Autocomplete
                  name="division"
                  label="Division"
                  fullWidth
                  required={requiredFields.includes('division')}
                  options={getFilteredOptions(
                    codes.division_codes,
                    'Division'
                  ).map((division) => ({
                    value: division.id,
                    label: division.value,
                  }))}
                  value={formik.values.division}
                  onChange={(newValue) => {
                    formik.setFieldValue('division', newValue || '');
                  }}
                  error={!!formik.errors.division}
                  helperText={formik.errors.division}
                />
              )}
            {shouldRenderField('shift') &&
              (codes?.shift_codes || []).length > 0 && (
                <Autocomplete
                  name="shift"
                  label="Shift"
                  fullWidth
                  required={requiredFields.includes('shift')}
                  options={getFilteredOptions(codes.shift_codes, 'Shift').map(
                    (shift) => ({
                      value: shift.id,
                      label: shift.value,
                    })
                  )}
                  value={formik.values.shift}
                  onChange={(newValue) => {
                    formik.setFieldValue('shift', newValue || '');
                  }}
                  error={!!formik.errors.shift}
                  helperText={formik.errors.shift}
                />
              )}
          </Box>
        )}
        {shouldRenderField([
          'start_date',
          'employee_type',
          'benefits_group',
        ]) && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {shouldRenderField('start_date') && (
              <FormikDatePicker
                name="start_date"
                label="Start date"
                sx={{ width: '100%' }}
                required={requiredFields.includes('start_date')}
                error={!!formik.errors.start_date}
              />
            )}
            {shouldRenderField('employee_type') && (
              <Autocomplete
                name="employee_type"
                label="Employee type"
                fullWidth
                required={requiredFields.includes('employee_type')}
                value={formik.values.employee_type}
                options={getFilteredOptions(codes.type_codes, 'Type').map(
                  (typeCode) => ({
                    value: typeCode.id,
                    label: typeCode.value,
                  })
                )}
                onChange={(newValue) => {
                  formik.setFieldValue('employee_type', newValue || '');
                }}
                error={!!formik.errors.employee_type}
                helperText={formik.errors.employee_type}
              />
            )}
            {shouldRenderField('benefits_group') && (
              <Autocomplete
                name="benefits_group"
                label="Benefit group"
                fullWidth
                required={requiredFields.includes('benefits_group')}
                value={formik.values.benefits_group}
                options={(codes?.benefit_group_codes || []).map(
                  (benefitGroup) => ({
                    value: benefitGroup.id,
                    label: benefitGroup.value,
                  })
                )}
                onChange={(newValue) => {
                  formik.setFieldValue('benefits_group', newValue || '');
                }}
                error={!!formik.errors.benefits_group}
                helperText={formik.errors.benefits_group}
              />
            )}
          </Box>
        )}
        {shouldRenderField(['employee_number', 'supervisor']) && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {shouldRenderField('employee_number') &&
              prehireFields?.emp_numbers_used &&
              !prehireFields?.auto_emp_number && (
                <Field
                  name="employee_number"
                  label="Employee number"
                  fullWidth
                  required={requiredFields.includes('employee_number')}
                  value={formik.values.employee_number}
                  onChange={formik.handleChange}
                  component={TextField}
                  error={!!formik.errors.employee_number}
                  helperText={formik.errors.employee_number}
                />
              )}
            {shouldRenderField('supervisor') && (
              <Autocomplete
                fullWidth
                name="supervisor"
                label="PTO Approver"
                required={requiredFields.includes('supervisor')}
                options={
                  access?.employees?.map((employee) => ({
                    value: employee.employeeId,
                    label: `${employee.firstName} ${employee.lastName} (${employee.employeeId})`,
                  })) || []
                }
                value={formik.values.supervisor}
                onChange={(newValue) => {
                  formik.setFieldValue('supervisor', newValue || '');
                }}
                error={!!formik.errors.supervisor}
                helperText={formik.errors.supervisor}
              />
            )}
            {shouldRenderField('manager') && (
              <Autocomplete
                fullWidth
                name="manager"
                label="Manager"
                required={requiredFields.includes('manager')}
                options={
                  managers?.map((manager) => ({
                    value: manager.employee_id,
                    label: `${manager.first_name} ${manager.last_name} (${manager.employee_id})`,
                  })) || []
                }
                value={formik.values.manager}
                onChange={(newValue) => {
                  formik.setFieldValue('manager', newValue || '');
                }}
                error={!!formik.errors.manager}
                helperText={formik.errors.manager}
              />
            )}
          </Box>
        )}
        {shouldRenderField(['project', 'work_group']) && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {shouldRenderField('project') &&
              (codes?.project_codes || []).length > 0 && (
                <Autocomplete
                  name="project"
                  label="Project"
                  fullWidth
                  required={requiredFields.includes('project')}
                  value={formik.values.project}
                  options={getFilteredOptions(
                    codes.project_codes,
                    'Project'
                  ).map((project) => ({
                    value: project.id,
                    label: project.value,
                  }))}
                  onChange={(newValue) => {
                    formik.setFieldValue('project', newValue || '');
                  }}
                />
              )}
            {shouldRenderField('work_group') && (
              <Autocomplete
                name="work_group"
                label="Work group"
                fullWidth
                required={requiredFields.includes('work_group')}
                value={formik.values.work_group}
                options={getFilteredOptions(
                  codes.workgroup_codes,
                  'WorkGroup'
                ).map((workgroup) => ({
                  value: workgroup.id,
                  label: workgroup.value,
                }))}
                onChange={(newValue) => {
                  formik.setFieldValue('work_group', newValue || '');
                }}
                error={!!formik.errors.work_group}
                helperText={formik.errors.work_group}
              />
            )}
          </Box>
        )}
      </Stack>
    </Section>
  );
};

const filterOptionsByAccess = (codes, access, entityType) => {
  const accessIds = access
    .filter(
      (item) => item.entityType.toLowerCase() === entityType.toLowerCase()
    )
    .map((item) => item.entityId.toLowerCase());

  if (accessIds.length === 0) {
    return codes;
  }

  return codes.filter((code) =>
    accessIds.includes((code.id || code.value).toLowerCase())
  );
};

export default EmploymentFields;
