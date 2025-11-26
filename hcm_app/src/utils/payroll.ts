const AccountTypeMap: Record<AccountTypeCode, string> = {
  C: 'Checking',
  S: 'Savings',
  IP: 'Instant Pay',
};

export const getAccountTypeDescription = (code: AccountTypeCode): string => {
  return AccountTypeMap[code] || 'N/A';
};

export const PAYROLL_HISTORY_START_DATE = '2000-01-01';
