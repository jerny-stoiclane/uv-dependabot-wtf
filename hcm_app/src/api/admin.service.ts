import { AxiosInstance, AxiosResponse } from 'axios';

export const getUserLoginEmail = async (
  axiosInstance: AxiosInstance,
  id: string
): Promise<ApiResponse<any>> => {
  const response: AxiosResponse<ApiResponse<any>> = await axiosInstance.get(
    `/admin/users/${id}/email`
  );

  return response.data;
};

export const getUserDetails = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<UserDetails[]>> => {
  const response: AxiosResponse<ApiResponse<UserDetails[]>> =
    await axiosInstance.get(`/admin/user-permissions`);
  return response.data;
};

export const uploadHandbook = async (
  axiosInstance: AxiosInstance,
  formData: FormData
): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.post(`/admin/handbooks`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const deleteHandbook = async (
  axiosInstance: AxiosInstance,
  handbook_id: number
): Promise<ApiResponse<boolean>> => {
  const response: AxiosResponse<ApiResponse<boolean>> =
    await axiosInstance.delete(`/admin/handbooks/${handbook_id}`);
  return response.data;
};

export const getCompanyHandbooks = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<HandbookAsset[]>> => {
  const response: AxiosResponse<ApiResponse<HandbookAsset[]>> =
    await axiosInstance.get(`/admin/handbooks`);
  return response.data;
};

export const assignEmployeeHandbook = async (
  axiosInstance: AxiosInstance,
  payload: EmployeeHandbookAssignment[]
): Promise<ApiResponse<EmployeeHandbookAssignment[]>> => {
  const response: AxiosResponse<ApiResponse<EmployeeHandbookAssignment[]>> =
    await axiosInstance.post('/admin/handbooks/assign', payload);
  return response.data;
};

export const unassignEmployeeHandbook = async (
  axiosInstance: AxiosInstance,
  payload: number[]
): Promise<ApiResponse<boolean>> => {
  const response: AxiosResponse<ApiResponse<boolean>> =
    await axiosInstance.delete('/admin/handbooks/unassign', { data: payload });
  return response.data;
};

export const getEmployeeAssignments = async (
  axiosInstance: AxiosInstance,
  handbook_id: number
): Promise<ApiResponse<EmployeeHandbookAssignment[]>> => {
  const response: AxiosResponse<ApiResponse<EmployeeHandbookAssignment[]>> =
    await axiosInstance.get(`/admin/handbooks/assign/${handbook_id}`);
  return response.data;
};

export const archiveEmployeeHandbook = async (
  axiosInstance: AxiosInstance,
  handbook_id: number,
  payload: HandbookAsset
): Promise<ApiResponse<HandbookAsset>> => {
  const response: AxiosResponse<ApiResponse<HandbookAsset>> =
    await axiosInstance.put(`/admin/handbooks/${handbook_id}/archive`, {
      client_id: payload.client_id,
      asset_type: payload.asset_type,
      archived: payload.archived,
    });
  return response.data;
};
export const getBackOfficeRedirect = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<string>> => {
  const response: AxiosResponse<ApiResponse<string>> = await axiosInstance.get(
    '/admin/back-office'
  );
  return response.data;
};

export const getEmployeeBonusTaxWithholdings = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<BonusTaxWithholdingRequest[]>> => {
  const response: AxiosResponse<ApiResponse<BonusTaxWithholdingRequest[]>> =
    await axiosInstance.get('/admin/bonus-tax-withholding');
  return response.data;
};

export const assignBonusTaxWithholdings = async (
  axiosInstance: AxiosInstance,
  body: BonusTaxWithholdingAssignRequest
): Promise<ApiResponse<BonusTaxWithholdingRequest[]>> => {
  const response: AxiosResponse<ApiResponse<BonusTaxWithholdingRequest[]>> =
    await axiosInstance.post('/admin/bonus-tax-withholding', body);
  return response.data;
};

export const deleteBonusTaxWithholding = async (
  axiosInstance: AxiosInstance,
  request_id: number
): Promise<ApiResponse<boolean>> => {
  const response: AxiosResponse<ApiResponse<boolean>> =
    await axiosInstance.delete(`/admin/bonus-tax-withholding/${request_id}`);
  return response.data;
};

export const sendPasswordReset = async (
  axiosInstance: AxiosInstance,
  payload: { id: string }
): Promise<ApiResponse<boolean>> => {
  const response: AxiosResponse<ApiResponse<boolean>> =
    await axiosInstance.post('/admin/send-password-reset', payload);
  return response.data;
};

export const getCustomFieldDefinitions = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<CustomFieldDefinition[]>> => {
  const response: AxiosResponse<ApiResponse<CustomFieldDefinition[]>> =
    await axiosInstance.get(`/admin/custom-fields`);
  return response.data;
};

export const createCustomFieldDefinition = async (
  axiosInstance: AxiosInstance,
  clientId: string,
  fieldData: CustomFieldDefinitionCreate
): Promise<ApiResponse<CustomFieldDefinition>> => {
  const response: AxiosResponse<ApiResponse<CustomFieldDefinition>> =
    await axiosInstance.post(`/admin/custom-fields`, fieldData);
  return response.data;
};

export const updateCustomFieldDefinition = async (
  axiosInstance: AxiosInstance,
  clientId: string,
  fieldId: number,
  fieldData: CustomFieldDefinitionUpdate
): Promise<ApiResponse<CustomFieldDefinition>> => {
  const response: AxiosResponse<ApiResponse<CustomFieldDefinition>> =
    await axiosInstance.put(`/admin/custom-fields/${fieldId}`, fieldData);
  return response.data;
};

export const deleteCustomFieldDefinition = async (
  axiosInstance: AxiosInstance,
  clientId: string,
  fieldId: number
): Promise<ApiResponse<{ status: string }>> => {
  const response: AxiosResponse<ApiResponse<{ status: string }>> =
    await axiosInstance.delete(`/admin/custom-fields/${fieldId}`);
  return response.data;
};

export const adminService = {
  assignEmployeeHandbook,
  deleteHandbook,
  getCompanyHandbooks,
  getEmployeeAssignments,
  getUserLoginEmail,
  getUserDetails,
  uploadHandbook,
  unassignEmployeeHandbook,
  archiveEmployeeHandbook,
  getBackOfficeRedirect,
  getEmployeeBonusTaxWithholdings,
  assignBonusTaxWithholdings,
  deleteBonusTaxWithholding,
  sendPasswordReset,
  getCustomFieldDefinitions,
  createCustomFieldDefinition,
  updateCustomFieldDefinition,
  deleteCustomFieldDefinition,
};
