import { Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

const useOptionalFieldsToggle = (
  showOptional: boolean,
  requiredFields: string[],
  allFields: string[]
) => {
  const [showOptionalFields, setShowOptionalFields] = useState(showOptional);

  useEffect(() => {
    // Reflect global visibility state
    setShowOptionalFields(showOptional);
  }, [showOptional]);

  // We want to memoize these because Formik triggers re-renders on field changes
  // Deduplicate requiredFields to handle potential data inconsistencies
  const uniqueRequiredFields = useMemo(
    () => new Set(requiredFields),
    [requiredFields]
  );

  // Identify required fields, considering all fields and deduplicated required ones
  const sectionRequiredFields = useMemo(
    () => allFields.filter((field) => uniqueRequiredFields.has(field)),
    [allFields, uniqueRequiredFields]
  );

  // Determine the number of optional fields
  const optionalFieldCount = useMemo(
    () => allFields.length - sectionRequiredFields.length,
    [allFields, sectionRequiredFields]
  );

  const toggleOptionalFields = () => {
    setShowOptionalFields(!showOptionalFields);
  };

  const shouldRenderField = (fieldName: string | string[]) => {
    if (Array.isArray(fieldName)) {
      return fieldName.some(
        (name) => uniqueRequiredFields.has(name) || showOptionalFields
      );
    }
    return uniqueRequiredFields.has(fieldName) || showOptionalFields;
  };

  const getToggleLink = () => {
    if (optionalFieldCount === 0) return null;

    return (
      <Typography
        onClick={toggleOptionalFields}
        fontSize={14}
        color="primary"
        sx={{ cursor: 'pointer' }}
      >
        {showOptionalFields
          ? `Hide ${optionalFieldCount} optional fields`
          : `Show ${optionalFieldCount} optional fields`}
      </Typography>
    );
  };

  return {
    getToggleLink,
    optionalFieldCount,
    sectionRequiredFields,
    shouldRenderField,
    showOptionalFields,
    toggleOptionalFields,
  };
};

export default useOptionalFieldsToggle;
