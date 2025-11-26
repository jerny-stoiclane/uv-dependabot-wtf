import axios, { AxiosResponse } from 'axios';

export const triggerResetPasswordFlow = async (
  email: string
): Promise<AxiosResponse> => {
  const axiosInstance = axios.create({
    baseURL: `https://${import.meta.env.VITE_APP_DOMAIN}`,
    headers: { 'Content-Type': 'application/json' },
  });
  const response: AxiosResponse = await axiosInstance.post(
    '/dbconnections/change_password',
    {
      client_id: import.meta.env.VITE_APP_CLIENT_ID,
      email,
      connection: 'Username-Password-Authentication',
    }
  );
  return response;
};

export const triggerForgotEmailFlow = async (
  email: string
): Promise<ApiResponse<boolean>> => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });
  const response: AxiosResponse<ApiResponse<boolean>> =
    await axiosInstance.post(`/public/forgot-email`, { email });
  return response.data;
};

export const unauthenticatedService = {
  triggerResetPasswordFlow,
  triggerForgotEmailFlow,
};
