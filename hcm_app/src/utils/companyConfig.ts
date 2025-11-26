export function getCompanyConfigValue(
  company: Company,
  flag: CompanyConfigFlag,
  defaultValue: boolean = false
): boolean {
  if (!company) {
    return defaultValue;
  }
  return (
    company.config?.find((config) => config.flag === flag)?.value ??
    defaultValue
  );
}
