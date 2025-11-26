import { AxiosInstance, AxiosResponse } from 'axios';

export const getPayrollVouchers = async (
  axiosInstance: AxiosInstance,
  body?: PayrollVoucherBody
): Promise<ApiResponse<PayrollVoucher[]>> => {
  const response: AxiosResponse<ApiResponse<PayrollVoucher[]>> =
    await axiosInstance.get('/payroll/vouchers', {
      params: body,
    });

  // the BE/prism can't sort unfortunately because of prism's pagination
  const sortedHistory = [...response.data.results].sort((a, b) => {
    return a.summary?.issue_date < b.summary?.issue_date ? 1 : -1;
  });

  return { results: sortedHistory };
};

export const getSummary = async (
  axiosInstance: AxiosInstance,
  body?: PayrollSummaryBody
): Promise<ApiResponse<PayrollSummary>> => {
  const response: AxiosResponse<ApiResponse<PayrollSummary>> =
    await axiosInstance.get('/payroll/summary', { params: body });
  return response.data;
};

export const getUpcomingPayDate = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<UpcomingPayDate>> => {
  const response: AxiosResponse<ApiResponse<UpcomingPayDate>> =
    await axiosInstance.get('/payroll/upcoming-pay-date');
  return response.data;
};

export const getPayrollVoucherById = async (
  axiosInstance: AxiosInstance,
  voucherId: string
): Promise<ApiResponse<PayrollVoucher>> => {
  const response: AxiosResponse<ApiResponse<PayrollVoucher>> =
    await axiosInstance.get(`/payroll/vouchers/${voucherId}`);
  return response.data;
};

export const getPayrollVoucherPDF = async (
  axiosInstance: AxiosInstance,
  voucherId: string
): Promise<ApiResponse<string>> => {
  const response: AxiosResponse<ApiResponse<string>> = await axiosInstance.get(
    `/payroll/vouchers/${voucherId}/pdf`
  );
  return response.data;
};

export const getMyBonusTaxWithholdings = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<BonusTaxWithholdingRequest[]>> => {
  const response: AxiosResponse<ApiResponse<BonusTaxWithholdingRequest[]>> =
    await axiosInstance.get('/taxes/bonus-tax-withholdings');
  return response.data;
};

export const getBonusTaxWithholdingById = async (
  axiosInstance: AxiosInstance,
  requestId: string
): Promise<ApiResponse<BonusTaxWithholdingRequest>> => {
  const response: AxiosResponse<ApiResponse<BonusTaxWithholdingRequest>> =
    await axiosInstance.get(`/taxes/bonus-tax-withholdings/${requestId}`);
  return response.data;
};

export const signBonusTaxWithholding = async (
  axiosInstance: AxiosInstance,
  body: BonusTaxWithholdingRequestForm,
  requestId: string
): Promise<ApiResponse<BonusTaxWithholdingRequest[]>> => {
  const response: AxiosResponse<ApiResponse<BonusTaxWithholdingRequest[]>> =
    await axiosInstance.post(
      `/taxes/bonus-tax-withholdings/${requestId}/sign`,
      body
    );
  return response.data;
};

export const payrollService = {
  getPayrollVouchers,
  getSummary,
  getUpcomingPayDate,
  getPayrollVoucherById,
  getPayrollVoucherPDF,
  getBonusTaxWithholdingById,
  getMyBonusTaxWithholdings,
  signBonusTaxWithholding,
};
