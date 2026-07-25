import axios from "axios";
import { ZodError } from "zod";

import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/ErrorCodes";
import { logger } from "@/lib/logger/logger";
import type { ApiErrorResponse } from "@/types/api";

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return AppError.validation(
      "Some fields are invalid.",
      error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (!error.response) {
      return new AppError(
        "Unable to reach the server.",
        ERROR_CODES.NETWORK_ERROR,
      );
    }

    const { status, data } = error.response;
    const message = data?.message ?? error.message;

    switch (status) {
      case 401:
        return AppError.unauthorized(message);
      case 403:
        return AppError.forbidden(message);
      case 404:
        return AppError.notFound(message);
      case 422:
        return AppError.validation(message, data?.errors);
      default:
        return new AppError(message, ERROR_CODES.INTERNAL_ERROR, {
          statusCode: status,
        });
    }
  }

  if (error instanceof Error) {
    return new AppError(error.message, ERROR_CODES.UNKNOWN_ERROR, {
      cause: error,
    });
  }

  return new AppError("Something went wrong.", ERROR_CODES.UNKNOWN_ERROR, {
    cause: error,
  });
}

export function handleError(error: unknown): AppError {
  const appError = normalizeError(error);
  logger.error(appError.message, appError, { code: appError.code });
  return appError;
}
