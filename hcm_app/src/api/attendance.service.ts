import { AxiosInstance, AxiosResponse } from 'axios';

export const getTimecardRedirect = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<string>> => {
  const response: AxiosResponse<ApiResponse<string>> = await axiosInstance.get(
    '/attendance/timecard/redirect'
  );
  return response.data;
};

export const getScheduleRedirect = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<string>> => {
  const response: AxiosResponse<ApiResponse<string>> = await axiosInstance.get(
    '/attendance/schedule/redirect'
  );
  return response.data;
};

export const getPtoRedirect = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<string>> => {
  const response: AxiosResponse<ApiResponse<string>> = await axiosInstance.get(
    '/attendance/pto/redirect'
  );
  return response.data;
};

export const getClockRedirect = async (
  axiosInstance: AxiosInstance
): Promise<ApiResponse<string>> => {
  const response: AxiosResponse<ApiResponse<string>> = await axiosInstance.get(
    '/attendance/clock/redirect'
  );
  return response.data;
};

export const attendanceService = {
  getTimecardRedirect,
  getScheduleRedirect,
  getPtoRedirect,
  getClockRedirect,
};
