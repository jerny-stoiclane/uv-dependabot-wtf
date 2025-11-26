/**
 * Utility functions for Excel import operations
 * Handles validation and error reporting for bulk import features
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ParsedRow {
  [key: string]: any;
  rowIndex?: number;
  errors?: { [key: string]: string };
  submitted?: boolean;
}

/**
 * Validates an email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a prehire row based on prehire fields configuration
 * This mimics the validation logic from NewHireRequestFullPage
 */
export function validatePrehireRow(
  row: ParsedRow,
  prehireFields: any
): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  if (!prehireFields || !prehireFields.fields) {
    return errors;
  }

  // Match the excludedFields from PrehireRowEditDialog to ensure consistent validation
  // Also exclude email fields since they use different field names in the row data
  // (personal_email/work_email instead of email_address/work_email_address)
  // Exclude SSN, birth_date, and gender since we use the values from the New Hire Request
  const excludedFields = [
    'ssn',
    'birth_date',
    'gender',
    'employee_status',
    'employee_number',
    'email_address',
    'work_email_address',
  ];

  // Validate based on prehire fields configuration
  prehireFields.fields.forEach((field: any) => {
    const fieldName = field.field_name;

    // Skip excluded fields
    if (excludedFields.includes(fieldName)) {
      return;
    }

    // Check if field is required for electronic onboarding
    if (field.required_for_electronic_onboarding) {
      const value = row[fieldName];
      if (!value || String(value).trim() === '') {
        errors[fieldName] = 'This field is required';
      }
    }
  });

  // Additional email validation
  const emailField = row.work_email || row.email || row.email_address;
  if (emailField && !isValidEmail(String(emailField))) {
    const fieldKey = row.work_email
      ? 'work_email'
      : row.email
      ? 'email'
      : 'email_address';
    errors[fieldKey] = 'Invalid email format';
  }

  return errors;
}

/**
 * Creates a summary of import results
 */
export interface ImportSummary {
  total: number;
  valid: number;
  errors: number;
  validRows: ParsedRow[];
  errorRows: ParsedRow[];
}

export function createImportSummary(rows: ParsedRow[]): ImportSummary {
  // Filter out already submitted rows from valid count
  const validRows = rows.filter((row) => !row.errors && !row.submitted);
  const errorRows = rows.filter((row) => row.errors);

  return {
    total: rows.length,
    valid: validRows.length,
    errors: errorRows.length,
    validRows,
    errorRows,
  };
}
