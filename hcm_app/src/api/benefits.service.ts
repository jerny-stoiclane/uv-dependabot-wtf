import { AxiosInstance, AxiosResponse } from 'axios';

const fetchBenefit = async <T>(
  axiosInstance: AxiosInstance,
  url: string,
  params?: BenefitBody
): Promise<ApiResponse<T>> => {
  const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(url, {
    params,
  });
  return response.data;
};

export const getPto = (axiosInstance: AxiosInstance, body?: BenefitBody) => {
  return fetchBenefit<PtoPlan[]>(axiosInstance, '/benefits/pto', body);
};

export const getPtoTypes = (axiosInstance: AxiosInstance) => {
  return fetchBenefit<PtoClass[]>(axiosInstance, '/benefits/pto/types');
};

export const getPtoRequests = (
  axiosInstance: AxiosInstance,
  body?: BenefitBody
) => {
  return fetchBenefit<PtoRequest[]>(
    axiosInstance,
    '/benefits/pto/requests',
    body
  );
};

export const cancelPtoRequest = async (
  axiosInstance: AxiosInstance,
  requestId: string
): Promise<ApiResponse<PtoRequest>> => {
  const response: AxiosResponse<ApiResponse<PtoRequest>> =
    await axiosInstance.delete(`/benefits/pto/requests/${requestId}`);
  return response.data;
};
export const getPtoApprovalCount = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<PtoApprovalCount>> => {
  const response: AxiosResponse<ApiResponse<PtoApprovalCount>> =
    await axiosInstance.get('/benefits/pto/approval-count');
  return response.data;
};

export const getPtoRequestById = async (
  axiosInstance: AxiosInstance,
  requestId: string
): Promise<ApiResponse<PtoRequest>> => {
  const response: AxiosResponse<ApiResponse<PtoRequest>> =
    await axiosInstance.get(`/benefits/pto/requests/${requestId}`);
  return response.data;
};

export const getHolidays = (
  axiosInstance: AxiosInstance,
  body?: BenefitBody
) => {
  return fetchBenefit<HolidayDates>(
    axiosInstance,
    '/benefits/pto/holidays',
    body
  );
};

export const getPtoRequestsSummary = (axiosInstance: AxiosInstance) => {
  return fetchBenefit<{
    pto_plans: PtoPlan[];
    pto_requests: PtoRequest[];
    pto_summary: Record<string, PtoHourInfo>;
  }>(axiosInstance, '/benefits/pto/summary');
};

export const getBenefits = (
  axiosInstance: AxiosInstance,
  body?: BenefitBody
) => {
  return fetchBenefit<InsurancePlan[]>(axiosInstance, '/benefits', body);
};

export const getBenefitsConfirmation = (axiosInstance: AxiosInstance) => {
  return fetchBenefit<EnrollmentConfirmation>(
    axiosInstance,
    '/benefits/enrollment/confirmation'
  );
};

export const getEnrollmentDashboard = (axiosInstance: AxiosInstance) => {
  return fetchBenefit<EnrollmentEmployee[]>(
    axiosInstance,
    '/benefits/enrollment/dashboard'
  );
};

export const getOpenEnrollmentRedirect = async (
  axiosInstance: AxiosInstance,
  origin
): Promise<ApiResponse<string>> => {
  const response: AxiosResponse<ApiResponse<string>> = await axiosInstance.get(
    `/benefits/enrollment/redirect`,
    { params: { origin } }
  );
  return response.data;
};

export const getSpendingAccounts = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<SpendingAccountConcise[]>> => {
  const response: AxiosResponse<ApiResponse<SpendingAccountConcise[]>> =
    await axiosInstance.get(`/benefits/spending-accounts`);
  return response.data;
};

export const createThrivePassEnrollmentSubmission = async (
  axiosInstance: AxiosInstance,
  formValues: ThrivePassCommuterEnrollmentForm
): Promise<Blob> => {
  const response: AxiosResponse<Blob> = await axiosInstance.post(
    `/benefits/thrivepass`,
    formValues,
    { responseType: 'blob' }
  );
  return response.data;
};

export const benefitsService = {
  cancelPtoRequest,
  getBenefits,
  getBenefitsConfirmation,
  createThrivePassEnrollmentSubmission,
  getHolidays,
  getEnrollmentDashboard,
  getOpenEnrollmentRedirect,
  getSpendingAccounts,
  getPto,
  getPtoRequests,
  getPtoApprovalCount,
  getPtoRequestById,
  getPtoTypes,
  getPtoRequestsSummary,
};
