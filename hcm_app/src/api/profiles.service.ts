import { AxiosInstance, AxiosResponse } from 'axios';

import { FormValues } from '../components/admin/userAccessFormValues';

export const getDashboard = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<DashboardPage>> => {
  const response: AxiosResponse<ApiResponse<DashboardPage>> =
    await axiosInstance.get('/profiles/dashboard');

  return response.data;
};

export const getUserProfile = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<UserProfile>> => {
  const response: AxiosResponse<ApiResponse<UserProfile>> =
    await axiosInstance.get('/profiles/me');

  return response.data;
};

export const getUserProfileWithStatus = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<UserProfileWithStatusResponse>> => {
  const response: AxiosResponse<ApiResponse<UserProfileWithStatusResponse>> =
    await axiosInstance.get('/profiles/me/with-status');

  return response.data;
};

export const getEmployeeProfile = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<EmployeeProfile>> => {
  const response: AxiosResponse<ApiResponse<EmployeeProfile>> =
    await axiosInstance.get('/profiles/employee');

  return response.data;
};

export const getUserAccess = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<UserAccess>> => {
  const response: AxiosResponse<ApiResponse<UserAccess>> =
    await axiosInstance.get('/profiles/me/access');

  return response.data;
};

export const getMyEmployees = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<PublicEmployeeProfile[]>> => {
  const response: AxiosResponse<ApiResponse<PublicEmployeeProfile[]>> =
    await axiosInstance.get('/profiles/me/employees');

  return response.data;
};

export const getSupportContacts = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<PrismTeamContact[]>> => {
  const response: AxiosResponse<ApiResponse<PrismTeamContact[]>> =
    await axiosInstance.get('/profiles/me/support/contacts');

  return response.data;
};

export const getPrismRedirect = async (
  axiosInstance: AxiosInstance,
  componentId?: string,
  prismClientId?: string
): Promise<ApiResponse<string>> => {
  const response: AxiosResponse<ApiResponse<string>> = await axiosInstance.get(
    '/profiles/me/prism/redirect',
    { params: { component_id: componentId, prism_client_id: prismClientId } }
  );

  return response.data;
};

export const getPrismHeadlessRedirect = async (
  axiosInstance: AxiosInstance,
  componentId?: string,
  prismClientId?: string,
  queryString?: string
): Promise<ApiResponse<string>> => {
  const response: AxiosResponse<ApiResponse<string>> = await axiosInstance.get(
    '/profiles/me/prism/redirect-sso',
    {
      params: {
        component_id: componentId,
        prism_client_id: prismClientId,
        query_string: queryString,
      },
    }
  );

  return response.data;
};

export const getLearningRedirect = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<string>> => {
  const response: AxiosResponse<ApiResponse<string>> = await axiosInstance.get(
    `/profiles/me/learning/redirect`
  );
  return response.data;
};

export const getUserProfileById = async (
  axiosInstance: AxiosInstance,
  id: string
): Promise<ApiResponse<PublicEmployeeProfile>> => {
  const response: AxiosResponse<ApiResponse<PublicEmployeeProfile>> =
    await axiosInstance.get(`/profiles/${id}`);
  return response.data;
};

export const updateUserProfile = async (
  axiosInstance: AxiosInstance,
  profile: EmployeeProfile
): Promise<ApiResponse<EmployeeProfile>> => {
  const response: AxiosResponse<ApiResponse<EmployeeProfile>> =
    await axiosInstance.patch('/profiles/me', profile);
  return response.data;
};

export const updateEmergencyContacts = async (
  axiosInstance: AxiosInstance,
  payload: UpdateEmergencyContactsPayload
): Promise<ApiResponse<UpdateEmergencyContactResponse>> => {
  const response: AxiosResponse<ApiResponse<any>> = await axiosInstance.put(
    '/profiles/update_emergency_contacts',
    payload
  );
  return response.data;
};

export const updateUserDefinedFields = async (
  axiosInstance: AxiosInstance,
  payload: UpdateUserDefinedFieldsPayload
): Promise<ApiResponse<any>> => {
  const response: AxiosResponse<ApiResponse<any>> = await axiosInstance.put(
    '/profiles/update_user_defined_fields',
    payload
  );
  return response.data;
};

export const getEmployeeCustomFields = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<ProfileCustomFieldValue[]>> => {
  const response: AxiosResponse<ApiResponse<ProfileCustomFieldValue[]>> =
    await axiosInstance.get('/profiles/me/custom-fields');
  return response.data;
};

export const updateEmployeeCustomFields = async (
  axiosInstance: AxiosInstance,
  payload: { field_values: Array<{ field_key: string; field_value: string }> }
): Promise<ApiResponse<any>> => {
  const response: AxiosResponse<ApiResponse<any>> = await axiosInstance.put(
    '/profiles/me/custom-fields',
    payload
  );
  return response.data;
};

export const getConfig = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<EmployeeConfig[]>> => {
  const response: AxiosResponse<ApiResponse<EmployeeConfig[]>> =
    await axiosInstance.get('/profiles/me/config');
  return response.data;
};

export const updateConfig = async (
  axiosInstance: AxiosInstance,
  config: EmployeeConfig
): Promise<ApiResponse<EmployeeConfig>> => {
  const response: AxiosResponse<ApiResponse<EmployeeConfig>> =
    await axiosInstance.post('/profiles/me/config', config);
  return response.data;
};

export const getUserPrismRoles = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<string[]>> => {
  const response: AxiosResponse<ApiResponse<string[]>> =
    await axiosInstance.get('/profiles/me/roles');
  return response.data;
};

export const requestUserAccess = async (
  axiosInstance: AxiosInstance,
  request: FormValues
): Promise<ApiResponse<any>> => {
  const newRequest = {
    ...request,
    payroll_role: request.payroll_roles.join(','),
  };

  const response: AxiosResponse<ApiResponse<any>> = await axiosInstance.post(
    '/admin/user-access-requests',
    newRequest
  );
  return response.data;
};

export const getUserAccessRequests = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<UserAccessRequest[]>> => {
  const response: AxiosResponse<ApiResponse<UserAccessRequest[]>> =
    await axiosInstance.get('/admin/user-access-requests');
  return response.data;
};

export const getUserAccessRequestPdf = async (
  axiosInstance: AxiosInstance,
  requestId: number
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(
    `/admin/user-access-requests/${requestId}/pdf`,
    { responseType: 'blob' }
  );
  return response;
};

export const uploadProfilePicture = async (
  axiosInstance: AxiosInstance,
  formData: FormData
): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.post(
    `/profiles/upload_profile_picture`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return response.data;
};

export const deleteProfilePicture = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.delete(
    `/profiles/delete_profile_picture`
  );
  return response.data;
};

export const updatePassword = async (
  axiosInstance: AxiosInstance,
  old_password: string,
  new_password: string
): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.put(`/profiles/update_password`, {
    old_password,
    new_password,
  });
  return response.data;
};

export const updateEmail = async (
  axiosInstance: AxiosInstance,
  new_email: string
): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.put(`/profiles/update_email`, {
    new_email,
  });
  return response.data;
};

export const sendResetPasswordEmail = async (
  axiosInstance: AxiosInstance,
  email: string
): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.post(`/profiles/reset_password`, {
    email,
  });
  return response.data;
};

export const updateAddresses = async (
  axiosInstance: AxiosInstance,
  name: string,
  address_info: AddressInfo,
  home_geo_code_override?: string | null
): Promise<ApiResponse<AddressInfo>> => {
  const response = await axiosInstance.post(`/addresses/update`, {
    name,
    address_info,
    home_geo_code_override,
  });
  return response.data;
};

export const getMyHandbooks = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<EmployeeHandbookAssignment[]>> => {
  const response = await axiosInstance.get('/profiles/me/handbooks');
  return response.data;
};

export const updateHandbookStatus = async (
  axiosInstance: AxiosInstance,
  payload: EmployeeHandbookAssignment
): Promise<ApiResponse<EmployeeHandbookAssignment>> => {
  const response = await axiosInstance.put(
    `/profiles/me/handbooks/${payload.id}`,
    payload
  );
  return response.data;
};

export const getMfaAuthenticators = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<MFAAuthenticator[]>> => {
  const response: AxiosResponse<ApiResponse<MFAAuthenticator[]>> =
    await axiosInstance.get('/profiles/me/mfa');
  return response.data;
};

export const profilesService = {
  deleteProfilePicture,
  getConfig,
  getDashboard,
  getLearningRedirect,
  getMyEmployees,
  getPrismRedirect,
  getPrismHeadlessRedirect,
  getSupportContacts,
  getUserAccess,
  getUserAccessRequests,
  getEmployeeProfile,
  getUserPrismRoles,
  getUserAccessRequestPdf,
  getUserProfile,
  getUserProfileById,
  requestUserAccess,
  sendResetPasswordEmail,
  updateAddresses,
  updateConfig,
  updateEmail,
  updatePassword,
  updateUserProfile,
  uploadProfilePicture,
  updateEmergencyContacts,
  updateUserDefinedFields,
  getEmployeeCustomFields,
  updateEmployeeCustomFields,
  getMyHandbooks,
  updateHandbookStatus,
  getMfaAuthenticators,
  getUserProfileWithStatus,
};
