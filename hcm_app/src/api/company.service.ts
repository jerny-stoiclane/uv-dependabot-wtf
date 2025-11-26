import { AxiosInstance, AxiosResponse } from 'axios';

export const getCompany = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<Company>> => {
  const response: AxiosResponse<ApiResponse<Company>> = await axiosInstance.get(
    '/company'
  );
  return response.data;
};

export const getCodes = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<CompanyCode>> => {
  const response: AxiosResponse<ApiResponse<CompanyCode>> =
    await axiosInstance.get('/company/codes');
  return response.data;
};

export const getEmployees = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<PublicEmployeeProfile[]>> => {
  const response: AxiosResponse<ApiResponse<PublicEmployeeProfile[]>> =
    await axiosInstance.get('/company/employees');
  return response.data;
};

export const getBirthdays = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<BirthdayPermission[]>> => {
  const response: AxiosResponse<ApiResponse<BirthdayPermission[]>> =
    await axiosInstance.get('/company/birthdays');
  return response.data;
};

export const getConfig = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<CompanyConfig[]>> => {
  const response: AxiosResponse<ApiResponse<CompanyConfig[]>> =
    await axiosInstance.get('/company/config');
  return response.data;
};

export const getPtoRequests = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<PtoRequest[]>> => {
  const response: AxiosResponse<ApiResponse<PtoRequest[]>> =
    await axiosInstance.get('/company/pto_requests');
  return response.data;
};

export const updateConfig = async (
  axiosInstance: AxiosInstance,
  config: CompanyConfig
): Promise<ApiResponse<CompanyConfig>> => {
  const response: AxiosResponse<ApiResponse<CompanyConfig>> =
    await axiosInstance.post('/company/config', config);
  return response.data;
};

export const uploadLogo = async (
  axiosInstance: AxiosInstance,
  formData: FormData
): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.post(`/company/upload_logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const getActivePrismUsers = async (
  axiosInstance: AxiosInstance,
  prismUserType?: readablePrismUserTypes
): Promise<ApiResponse<PrismSecurityUser[]>> => {
  const response: AxiosResponse<ApiResponse<PrismSecurityUser[]>> =
    await axiosInstance.get('/company/active-prism-users', {
      params: { user_type: prismUserType },
    });
  return response.data;
};

export const getLaborNotice = async (
  axiosInstance: AxiosInstance
): Promise<Blob> => {
  const response = await axiosInstance.get('/company/labor_notice', {
    responseType: 'blob',
  });
  return response.data;
};

export const companyService = {
  getCodes,
  getCompany,
  getEmployees,
  getBirthdays,
  getConfig,
  getPtoRequests,
  updateConfig,
  uploadLogo,
  getActivePrismUsers,
  getLaborNotice,
};
