import { bindApiService } from '@armhr/ui';
import axios, { InternalAxiosRequestConfig } from 'axios';

import { isProxying } from '../utils/proxy';
import { adminService } from './admin.service';
import { attendanceService } from './attendance.service';
import { benefitsService } from './benefits.service';
import { companyService } from './company.service';
import { onboardingService } from './onboarding.service';
import { payrollService } from './payroll.service';
import { profilesService } from './profiles.service';

const baseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL;
const tenantId = import.meta.env.VITE_APP_TENANT_ID;

export const createApiClient = (
  token: string,
  entity?: ClientEntity,
  user?: Auth0User | null
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'X-Api-Version': 'v2',
    'X-Armhr-Tenant': tenantId,
  };

  if (entity) {
    headers['X-Armhr-Client'] = entity.id || entity.client_id;
  }

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: headers,
  });

  // Request interceptor to block POST/DELETE requests for proxying users
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const method = config.method?.toUpperCase();

      if (user && isProxying(user) && !import.meta.env.DEV) {
        if (method === 'POST' || method === 'DELETE') {
          // Create a custom error that will be caught by the response interceptor
          const error = new Error('ProxyBlock');
          (error as any).isProxyBlock = true;
          (error as any).actionType = method;
          return Promise.reject(error);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(undefined, (error) => {
    // Handle proxy block errors
    if (error.isProxyBlock) {
      // Dispatch a custom event that can be listened to by components
      const event = new CustomEvent('proxyBlock', {
        detail: { actionType: error.actionType },
      });
      window.dispatchEvent(event);
      return Promise.reject(error);
    }

    // if any api request 401s that means the session is no longer valid, so log out
    if (error?.response && error?.response.status === 401) {
      window.location.href = '/logout';
    }
    return Promise.reject(error);
  });

  return {
    client: axiosInstance,
    // services
    admin: bindApiService(adminService, axiosInstance),
    benefits: bindApiService(benefitsService, axiosInstance),
    attendance: bindApiService(attendanceService, axiosInstance),
    profiles: bindApiService(profilesService, axiosInstance),
    payroll: bindApiService(payrollService, axiosInstance),
    company: bindApiService(companyService, axiosInstance),
    onboarding: bindApiService(onboardingService, axiosInstance),
  };
};

export type ApiClientType = ReturnType<typeof createApiClient>;
