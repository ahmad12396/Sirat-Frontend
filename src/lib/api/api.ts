import type { AxiosRequestConfig } from "axios";

import { httpClient } from "@/lib/api/client";
import "@/lib/api/interceptors";

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.get<T>(url, config);
    return response.data;
  },
  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await httpClient.post<T>(url, data, config);
    return response.data;
  },
  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await httpClient.put<T>(url, data, config);
    return response.data;
  },
  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await httpClient.patch<T>(url, data, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.delete<T>(url, config);
    return response.data;
  },
};
