import { AxiosInstance, AxiosResponse } from 'axios';

export const getPrehireRedirect = async (
  axiosInstance: AxiosInstance,
  componentId?: string
): Promise<ApiResponse<string>> => {
  const response: AxiosResponse<ApiResponse<string>> = await axiosInstance.get(
    `/onboarding/prehire/redirect`,
    { params: { component_id: componentId } }
  );
  return response.data;
};

export const createPrehire = async (
  axiosInstance: AxiosInstance,
  body: NewHireRequestFormValues
): Promise<ApiResponse<PrismPrehire>> => {
  const response = await axiosInstance({
    method: 'POST',
    url: `/onboarding/prehire`,
    data: body,
  });
  return response.data;
};

export const createPrehireRequest = async (
  axiosInstance: AxiosInstance,
  id: number,
  body: NewHireRequestFormValues
): Promise<ApiResponse<PrismPrehire>> => {
  const response = await axiosInstance({
    method: 'POST',
    url: `/onboarding/prehire/new_hire_requests/${id}`,
    data: body,
    withCredentials: true, // allows cookies to be sent
  });
  return response.data;
};

export const getPrehireFields = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<PrehireFields>> => {
  const response: AxiosResponse<ApiResponse<PrehireFields>> =
    await axiosInstance.get(`/onboarding/prehire/fields`);
  return response.data;
};

export const createNewHireRequest = async (
  axiosInstance: AxiosInstance,
  newHireRequest: NewHireRequestForm
): Promise<ApiResponse<NewHireRequestForm>> => {
  const response: AxiosResponse<ApiResponse<NewHireRequestForm>> =
    await axiosInstance.post(
      `/onboarding/prehire/new_hire_requests`,
      newHireRequest
    );
  return response.data;
};

export const getNewHireRequests = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<NewHireRequest[]>> => {
  const response: AxiosResponse<ApiResponse<NewHireRequest[]>> =
    await axiosInstance.get(`/onboarding/prehire/new_hire_requests`);
  return response.data;
};

export const getNewHireRequestById = async (
  axiosInstance: AxiosInstance,
  id: string
): Promise<ApiResponse<NewHireRequest>> => {
  const response: AxiosResponse<ApiResponse<NewHireRequest>> =
    await axiosInstance.get(`/onboarding/prehire/new_hire_requests/${id}`);
  return response.data;
};

export const resendNewHireEmail = async (
  axiosInstance: AxiosInstance,
  id: number
): Promise<ApiResponse<NewHireRequest>> => {
  const response: AxiosResponse<ApiResponse<NewHireRequest>> =
    await axiosInstance.post(
      `/onboarding/prehire/new_hire_requests/${id}/resend_email`
    );
  return response.data;
};

export const deleteNewHireRequest = async (
  axiosInstance: AxiosInstance,
  id: number
): Promise<ApiResponse<NewHireRequest>> => {
  const response: AxiosResponse<ApiResponse<NewHireRequest>> =
    await axiosInstance.delete(`/onboarding/prehire/new_hire_requests/${id}`);
  return response.data;
};

export const bulkCreateQuickHireRequests = async (
  axiosInstance: AxiosInstance,
  requests: NewHireRequestForm[]
): Promise<
  ApiResponse<{
    created: Array<{
      row: number;
      email: string;
      new_hire_request_id: number;
      register_link: string;
    }>;
    errors: Array<{
      row: number;
      email: string;
      error: string;
    }>;
    total_processed: number;
    successful: number;
    failed: number;
  }>
> => {
  const response: AxiosResponse<
    ApiResponse<{
      created: Array<{
        row: number;
        email: string;
        new_hire_request_id: number;
        register_link: string;
      }>;
      errors: Array<{
        row: number;
        email: string;
        error: string;
      }>;
      total_processed: number;
      successful: number;
      failed: number;
    }>
  > = await axiosInstance.post(`/onboarding/prehire/bulk_quick_hire`, requests);
  return response.data;
};

export const bulkCompletePrehireRequests = async (
  axiosInstance: AxiosInstance,
  requests: NewHireRequestPrehireForm[]
): Promise<
  ApiResponse<{
    completed: Array<{
      row: number;
      new_hire_request_id: number;
      prism_results: any;
    }>;
    errors: Array<{
      row: number;
      new_hire_request_id: number;
      error: string;
    }>;
    total_processed: number;
    successful: number;
    failed: number;
  }>
> => {
  const response: AxiosResponse<
    ApiResponse<{
      completed: Array<{
        row: number;
        new_hire_request_id: number;
        prism_results: any;
      }>;
      errors: Array<{
        row: number;
        new_hire_request_id: number;
        error: string;
      }>;
      total_processed: number;
      successful: number;
      failed: number;
    }>
  > = await axiosInstance.post(
    `/onboarding/prehire/bulk_prehire_completion`,
    requests
  );
  return response.data;
};

export const downloadPrehireExcelTemplate = async (
  axiosInstance: AxiosInstance,
  requestIds?: number[]
): Promise<Blob> => {
  const response: AxiosResponse<Blob> = await axiosInstance.get(
    `/onboarding/prehire/new_hire_requests/template/excel`,
    {
      responseType: 'blob',
      params:
        requestIds && requestIds.length > 0
          ? { request_ids: requestIds.join(',') }
          : undefined,
    }
  );
  return response.data;
};

export const uploadPrehireExcelFile = async (
  axiosInstance: AxiosInstance,
  file: File
): Promise<ApiResponse<any[]>> => {
  const response: AxiosResponse<ApiResponse<any[]>> = await axiosInstance.post(
    `/onboarding/prehire/new_hire_requests/upload/excel`,
    file,
    {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }
  );
  return response.data;
};

export const downloadQuickHireExcelTemplate = async (
  axiosInstance: AxiosInstance
): Promise<Blob> => {
  const response: AxiosResponse<Blob> = await axiosInstance.get(
    `/onboarding/prehire/new_hire_requests/quick_hire_template/excel`,
    {
      responseType: 'blob',
    }
  );
  return response.data;
};

export const uploadQuickHireExcelFile = async (
  axiosInstance: AxiosInstance,
  file: File
): Promise<ApiResponse<any[]>> => {
  const response: AxiosResponse<ApiResponse<any[]>> = await axiosInstance.post(
    `/onboarding/prehire/new_hire_requests/upload/quick_hire_excel`,
    file,
    {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }
  );
  return response.data;
};

export const onboardingService = {
  createPrehire,
  createPrehireRequest,
  deleteNewHireRequest,
  getPrehireRedirect,
  getPrehireFields,
  getNewHireRequests,
  getNewHireRequestById,
  createNewHireRequest,
  resendNewHireEmail,
  bulkCreateQuickHireRequests,
  bulkCompletePrehireRequests,
  downloadPrehireExcelTemplate,
  uploadPrehireExcelFile,
  downloadQuickHireExcelTemplate,
  uploadQuickHireExcelFile,
};
