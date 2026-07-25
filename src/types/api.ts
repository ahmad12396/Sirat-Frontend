export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiFieldError = {
  field: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: ApiFieldError[];
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
