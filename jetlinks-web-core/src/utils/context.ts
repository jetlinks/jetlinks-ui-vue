import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export interface ContextOptions {
  filterUrl?: string[];
  handleRequest?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig;
  handleResponse?: (response: AxiosResponse) => AxiosResponse;
  errorHandler?: (error: AxiosError) => void;
  loginInvalid?: () => void;
}

// 公用上下文
export let context: ContextOptions = {
  filterUrl: [],
  handleRequest: undefined,
  handleResponse: undefined,
  errorHandler: undefined,
};

export const initRequest = (func: () => ContextOptions) => {
  context = func();
};
