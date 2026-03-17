import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

type StoredUserHeaderInfo = { id: string; role: string };

type ApiErrorResponse = { message?: string };

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed && typeof parsed === 'object' && 'id' in parsed && 'role' in parsed) {
          const user = parsed as StoredUserHeaderInfo;
          config.headers['X-User-ID'] = user.id;
          config.headers['X-User-Role'] = user.role;
        }
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred';
      
      switch (status) {
        case 400:
          toast.error(`Bad Request: ${message}`);
          break;
        case 401:
          toast.error('Unauthorized. Please login again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          globalThis.dispatchEvent(new CustomEvent('auth:unauthorized'));
          break;
        case 403:
          toast.error('Forbidden. You don\'t have permission.');
          break;
        case 404:
          toast.error(`Not Found: ${message}`);
          break;
        case 500:
          toast.error('Server Error. Please try again later.');
          break;
        default:
          toast.error(`Error: ${message}`);
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  get: <T = object>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },
  
  post: <T = object>(url: string, data?: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },
  
  put: <T = object>(url: string, data?: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },
  
  patch: <T = object>(url: string, data?: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },
  
  delete: <T = object>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

export default apiClient;
