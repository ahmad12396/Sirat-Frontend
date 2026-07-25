import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { STORAGE_KEYS } from "@/constants/storage";
import { httpClient } from "@/lib/api/client";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

function attachAuthToken(config: InternalAxiosRequestConfig) {
  const token = getAuthToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
}

function onResponse(response: AxiosResponse) {
  return response;
}

function onResponseError(error: AxiosError) {
  if (error.response?.status === 401 && typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
  return Promise.reject(error);
}

httpClient.interceptors.request.use(attachAuthToken);
httpClient.interceptors.response.use(onResponse, onResponseError);
